import { prisma } from "../../lib/prisma"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { problemId } = await req.json();

    if (!problemId) {
        return NextResponse.json({ message: "Problem ID is required" }, { status: 400 });
    }

    try {
        const testCases = await prisma.testCase.findMany({
            where: { problemId: problemId },
            select: {
                input: true,
                expected: true,
                id: true,
            },
            orderBy: {
                id: 'asc',
            },
            take: 2, // 👈 Limit to 2 test cases
        });

        if (!testCases || testCases.length === 0) {
            return NextResponse.json({ message: "No test cases found for this problem" }, { status: 404 });
        }

        return NextResponse.json(testCases, { status: 200 });
    } catch (error) {
        console.error("Error fetching test cases:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
