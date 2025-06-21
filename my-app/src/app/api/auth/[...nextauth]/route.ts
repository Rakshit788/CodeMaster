import NextAuth,  {NextAuthOptions} from "next-auth";
import Github from "next-auth/providers/github"
import { prisma } from "../../../lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter"


export const authOptions: NextAuthOptions = {
   adapter : PrismaAdapter(prisma) , 

   providers : [
      Github({
         clientId : process.env.GITHUB_CLIENT_ID,
         clientSecret: process.env.GITHUB_CLIENT_SECRET 

      })
   ]
}


export  const handler  =  NextAuth(authOptions)
export { handler as GET, handler as POST }