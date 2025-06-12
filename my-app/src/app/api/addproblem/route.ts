// app/api/problems/route.ts
import { prisma } from '../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { title, description, difficulty, tags, startcode, testcode, testCases } = body;

    const newProblem = await prisma.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        startcode,
        testcode,
        testCases: {
          create: testCases, // expects [{input: "", expected: ""}, ...]
        },
      },
      include: {
        testCases: true,
      },
    });

    return NextResponse.json({ success: true, problem: newProblem }, { status: 201 });
  } catch (error) {
    console.error('Error creating problem:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
