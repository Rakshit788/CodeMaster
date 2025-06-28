
import {    NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { useSession } from "next-auth/react";
import { use } from "react";



export  async function POST(req : NextRequest){
    
   const {email , problemid  ,  status , code} =  await  req.json() ;  // rember to check the name of problem id sending here  
    if (!email || !problemid || !status || !code) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
   
try { 
    const user  =  await  prisma.user.findUnique({
        where : {
            email  : email
        }
    })
     if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userid  =  user.id 

await prisma.submission.create({
  data: {
    code,
    verdict: status === "success" ? "Accepted" : status,
    output: "", // You can update this if your judge provides output
    userId: userid,
    problemId: problemid,
    createdAt: new Date(),
  },
});

if(status== "success"){
     await prisma.passedProblem.upsert({
        where: {
          userId_problemId: {
            userId: userid,
            problemId: problemid,
          },
        },
        update: {}, // no-op update if already exists
        create: {
          userId: userid,
          problemId: problemid,
        },
      });
   
      await prisma.failedProblem.deleteMany({
        where : {
            userId: userid ,
            problemId : problemid 
        }
      })

}else {

     await prisma.failedProblem.upsert({
        where: {
          userId_problemId: {
            userId: userid,
            problemId: problemid,
          },
        },
        update: {}, // no-op update if already exists
        create: {
          userId: userid,
          problemId: problemid,
        },
      });
   
      await prisma.passedProblem.deleteMany({
        where : {
            userId: userid ,
            problemId : problemid 
        }
      }) 
      const updateduser  =  await prisma.user.findUnique({
        where : {
            id : userid
        }
      })

     return NextResponse.json({message : "sucess" ,  "updateduser" :updateduser })
}

} catch (error) {
    return NextResponse.json({
        error : error
    })
}

 }