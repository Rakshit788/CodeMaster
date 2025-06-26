// pages/api/run-cpp.ts

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { prisma } from '../../lib/prisma';
import { jobQueue } from '../../lib/queue/codequeue';

type ResponseType = {
  jobId: string;
  status: string;
};

export async function POST(req: NextRequest) {
  const { problemId, code } = await req.json();

  if (!problemId || !code) {
    return NextResponse.json(
      { error: 'Missing required fields: problemId, code' },
      { status: 400 }
    );
  }

  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      title: true,
      description: true,
      difficulty: true,
      tags: true,
      startcode: true,
      testcode: true,
      testCases: {
        select: {
          input: true,
          expected: true,
        },
      },
    },
  });

  if (!problem) {
    return NextResponse.json(
      { error: 'Problem not found' },
      { status: 404 }
    );
  }

  const jobId = uuid();

  // Enqueue job
  await jobQueue.add(
    'run-cpp',
    {
      code,
      testCode: problem.testcode,
      jobId,
    },
    { jobId }
  );

  // Return jobId
  const response: ResponseType = {
    jobId,
    status: 'Queued',
  };

  return NextResponse.json(response);
}
