import { prisma } from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

     const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        Submission: {
          select: {
             problem: {
                select: {
                    id: true,
                    title: true,
                    difficulty: true,
                    tags: true,
                },
             }
          },
        },
      },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const total  =  await  prisma.submission.count({
      where: {  
        user: {
          email: email,
        }  } })
    
    const ans = {
      totalSubmissions: total,
        submissions: user.Submission.map((entry) => entry.problem),
    };

    return NextResponse.json(ans, { status: 200 });

    
    
    
    } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error processing request" }, { status: 500 });
  }

}
