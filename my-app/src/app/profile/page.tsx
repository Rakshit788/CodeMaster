'use client'

import { Card, CardHeader, CardBody, Tabs, Tab } from "@nextui-org/react";
import { useState } from "react";

export default function ProfilePage() {
  // Dummy data to replace with Prisma later
  const totalSolved = 123;
  const easySolved = 50;
  const mediumSolved = 53;
  const hardSolved = 20;
  const rank = 342;

  // Dummy category solved counts
  const categoryCounts = {
    array: 40,
    linkedList: 15,
    tree: 20,
    graph: 8,
    dp: 12,
  };

  const [selectedTab, setSelectedTab] = useState("all");

  // Dummy solved problems
  const solvedProblems = [
    { id: 1, title: "Two Sum", difficulty: "Easy" },
    { id: 2, title: "Longest Substring Without Repeating Characters", difficulty: "Medium" },
    { id: 3, title: "Reverse Nodes in k-Group", difficulty: "Hard" },
    { id: 4, title: "Valid Parentheses", difficulty: "Easy" },
    { id: 5, title: "Median of Two Sorted Arrays", difficulty: "Hard" },
  ];

  const filteredProblems = solvedProblems.filter(problem =>
    selectedTab === "all" || problem.difficulty.toLowerCase() === selectedTab
  );

  return (
    <div className="min-h-screen flex bg-[#0d0d0d] text-white font-sans">

      {/* LEFT SIDEBAR */}
      <aside className="w-64 p-6 bg-[#121212] hidden sm:block">
        <h2 className="text-xl font-bold mb-4">Your Rank</h2>
        <Card className="bg-[#1a1a1a] mb-6">
          <CardHeader className="justify-center">
            <h3 className="text-2xl font-bold">#{rank}</h3>
          </CardHeader>
          <CardBody className="text-center text-gray-400 text-sm">
            Global Rank
          </CardBody>
        </Card>

        <h2 className="text-xl font-bold mb-4">Categories Solved</h2>
        <div className="space-y-3">
          <Card className="bg-[#1a1a1a] p-3 flex justify-between items-center">
            <span>Array</span>
            <span className="text-green-400">{categoryCounts.array}</span>
          </Card>
          <Card className="bg-[#1a1a1a] p-3 flex justify-between items-center">
            <span>Linked List</span>
            <span className="text-green-400">{categoryCounts.linkedList}</span>
          </Card>
          <Card className="bg-[#1a1a1a] p-3 flex justify-between items-center">
            <span>Tree</span>
            <span className="text-green-400">{categoryCounts.tree}</span>
          </Card>
          <Card className="bg-[#1a1a1a] p-3 flex justify-between items-center">
            <span>Graph</span>
            <span className="text-green-400">{categoryCounts.graph}</span>
          </Card>
          <Card className="bg-[#1a1a1a] p-3 flex justify-between items-center">
            <span>Dynamic Programming</span>
            <span className="text-green-400">{categoryCounts.dp}</span>
          </Card>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-gray-400 mb-6">Track your progress and explore your solved problems.</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#1a1a1a] text-center">
            <CardHeader className="justify-center">
              <h2 className="text-2xl font-bold">{totalSolved}</h2>
            </CardHeader>
            <CardBody className="text-sm text-gray-400">Total Solved</CardBody>
          </Card>
          <Card className="bg-[#1a1a1a] text-center">
            <CardHeader className="justify-center">
              <h2 className="text-2xl font-bold">{easySolved}</h2>
            </CardHeader>
            <CardBody className="text-sm text-green-400">Easy</CardBody>
          </Card>
          <Card className="bg-[#1a1a1a] text-center">
            <CardHeader className="justify-center">
              <h2 className="text-2xl font-bold">{mediumSolved}</h2>
            </CardHeader>
            <CardBody className="text-sm text-yellow-400">Medium</CardBody>
          </Card>
          <Card className="bg-[#1a1a1a] text-center">
            <CardHeader className="justify-center">
              <h2 className="text-2xl font-bold">{hardSolved}</h2>
            </CardHeader>
            <CardBody className="text-sm text-red-400">Hard</CardBody>
          </Card>
        </div>

        {/* Tabs for filtering */}
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key.toString())}
          variant="underlined"
          color="primary"
          className="mb-6"
        >
          <Tab key="all" title="All" />
          <Tab key="easy" title="Easy" />
          <Tab key="medium" title="Medium" />
          <Tab key="hard" title="Hard" />
        </Tabs>

        {/* Solved Problems List */}
        <div className="grid gap-4">
          {filteredProblems.map(problem => (
            <Card key={problem.id} className="bg-[#1a1a1a] hover:bg-[#262626] transition cursor-pointer">
              <CardHeader className="justify-between items-center px-4 py-3">
                <h3 className="text-lg font-semibold">{problem.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  problem.difficulty === "Easy" ? "bg-green-700 text-green-200" :
                  problem.difficulty === "Medium" ? "bg-yellow-700 text-yellow-200" :
                  "bg-red-700 text-red-200"
                }`}>
                  {problem.difficulty}
                </span>
              </CardHeader>
            </Card>
          ))}

          {filteredProblems.length === 0 && (
            <p className="text-gray-500 text-center">No problems solved in this category yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
