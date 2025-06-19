// app/problem/page.tsx
import { prisma } from "../lib/prisma";
import ProblemsPage from "./Problemspage";

export default async function ProblemPageWrapper() {
  const problems = await prisma.problem.findMany({
    select: {
      id: true,
      title: true,
      difficulty: true,
      tags: true,
    },
  });

  return <ProblemsPage problems={problems} />;
}
