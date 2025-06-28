import { prisma } from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const {  email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Get user with failedProblems
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        failedQuestions: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                difficulty: true,
                tags: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const total = await prisma.failedProblem.count({
      where: {
        userId: user.id,
      },
    });

    const ans = {
      totalProblemsFailed: total,
      problems: user.failedQuestions.map((entry) => entry.problem),
    };

    return NextResponse.json(ans, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching user data" }, { status: 500 });
  }
}