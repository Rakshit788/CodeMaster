import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET() {
  const problems = await prisma.$queryRaw`
    SELECT id, title, difficulty, tags
    FROM "Problem"
    ORDER BY RANDOM()
    LIMIT 3
  `;
  return NextResponse.json(problems);
}
