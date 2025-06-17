// pages/api/run-cpp.ts
import { NextResponse , NextRequest } from 'next/server';
import { v4 as uuid } from 'uuid';
import { prisma } from '../../lib/prisma';
import { jobQueue } from '../../lib/queue/codequeue';
import { log } from 'console';



export async function POST(req :NextRequest ) {
  const {problemId ,  code  } = await req.json();
 
  if(!problemId || !code ) {
    return NextResponse.json(
      { error: 'Missing required fields: problemId, code, or testCode' },
      { status: 400 }
    );
  }
 
  
  
  const problem  =  await  prisma.problem.findUnique({
    where : {id: problemId}  , 
    select : {
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
          expected: true
        }
      }
    }
  })
  
console.log(problem);
  

  const jobId = uuid();

  // 2) Enqueue a new job with code + harness
  await jobQueue.add(
    'run-cpp',
    {
      code,                     
      testCode: problem?.testcode,
      jobId,
    },
    { jobId }
  );

  // 3) Return the job ID for polling
  return NextResponse.json({ status: 'queued', jobId });
}
