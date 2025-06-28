import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const {  email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Get user with passedProblems
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        passedQuestions: {
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

    const total = await prisma.passedProblem.count({
      where: {
        userId: user.id,
      },
    });

    const ans = {
      totalProblemsPassed: total,
      problems: user.passedQuestions.map((entry) => entry.problem),
    };

    return NextResponse.json(ans, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching user data" }, { status: 500 });
  }
}
