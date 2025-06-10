import { prisma } from "../../lib/prisma"
import CodeEditor from "../../components/editor";

interface ProblemPage{
  params : {
    id : string;
  }
}

export default async function ProblemPage({params} : ProblemPage){
      const problem =  await  prisma.problem.findUnique({
        where : {
           id :  parseInt(params.id)
        },
        include : {
          testCases : true
        }
      })

      if (!problem) {
        return <div className="p-6 text-red-600">Problem not found</div>;
      }
    
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 h-full">
          <div className="prose max-w-none bg-gray-900 rounded-xl p-6 shadow">
            <h2 className="text-2xl font-bold mb-4">{problem.title}</h2>
            <pre className="whitespace-pre-wrap">{problem.description}</pre>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl shadow text-white">
            <CodeEditor initialCode={problem.startcode} />
          </div>
        </div>
      );
}