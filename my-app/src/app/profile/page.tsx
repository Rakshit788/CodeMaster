"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Tabs,
  Tab,
  Button,
  Avatar,
  Divider,
} from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";

interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "solved" | "failed" | "attempted";
  tag?: string;
}

export default function ProfilePage() {
  const [totalSolved, setTotalSolved] = useState<number>(0);
  const [totalAttempted, setTotalAttempted] = useState<number>(0);
  const [totalSubmissions, setTotalSubmissions] = useState<number>(0);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("all");

  const { data: userdata } = useSession();

  const fetchData = async () => {
    try {
      const submissionRes = await fetch("/api/getuserinfo/submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userdata?.user?.email }),
      });
      const subjson = await submissionRes.json();

      const passedRes = await fetch("/api/getuserinfo/passedProblem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userdata?.user?.email }),
      });
      const passedJson = await passedRes.json();

      const failedRes = await fetch("/api/getuserinfo/failedproblem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userdata?.user?.email }),
      });
      const failedJson = await failedRes.json();

      setTotalSubmissions(subjson.totalSubmissions || 0);
      setTotalSolved(passedJson.totalProblemsPassed || 0);
      setTotalAttempted(failedJson.totalProblemsFailed || 0);

      const displayProblems = (subjson.submissions || [])
        .slice(-10)
        .map((p) => ({
          id: p.id,
          title: p.title,
          difficulty: p.difficulty,
          tag: p.tags?.[0] || "Other",
          status: p.status || "attempted",
        }));

      setProblems(displayProblems);
    } catch (error) {
      console.error("Error fetching profile data", error);
    }
  };

  useEffect(() => {
    if (userdata?.user?.email) {
      fetchData();
    }
  }, [userdata]);

  const filtered = problems.filter((p) =>
    selectedTab === "all"
      ? true
      : selectedTab === "failed"
      ? p.status === "failed"
      : p.status === selectedTab
  );

  return (
    <div className="min-h-screen flex bg-[#0d0d0d] text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 p-6 bg-[#121212] hidden sm:flex flex-col gap-6 border-r border-gray-800">
        <div className="flex items-center gap-4">
          {userdata?.user?.image ? (
            <img
              src={userdata.user.image}
              alt="User"
              className="rounded-full h-14 w-14 border-2 border-purple-500 shadow-purple-500/40 shadow-md object-cover"
            />
          ) : (
            <Avatar name="User" size="lg" />
          )}
          <div className="min-w-0">
            <p className="font-semibold truncate">{userdata?.user?.name}</p>
            <p className="text-sm text-gray-400 truncate">{userdata?.user?.email}</p>
          </div>
        </div>

        <Button
          onClick={() => signOut()}
          className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition hover:scale-105"
        >
          Sign Out
        </Button>

        <Divider className="bg-gray-700" />

        <h2 className="text-lg font-bold">Profile Navigation</h2>
        <p className="text-sm text-gray-400">Tags section coming soon...</p>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 w-full max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
            CodeMaster Stats
          </h1>
          <p className="text-gray-400">Your problem-solving journey at a glance.</p>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 w-full">
          {[
            { label: "Solved", value: totalSolved },
            { label: "Attempted", value: totalAttempted },
            { label: "Submissions", value: totalSubmissions },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="rounded-2xl bg-[#1a1a1a] text-center hover:shadow-purple-500/40 hover:shadow-md transition transform hover:-translate-y-1 w-full"
            >
              <CardHeader className="justify-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
                  {stat.value.toLocaleString()}
                </h2>
              </CardHeader>
              <CardBody className="text-gray-400">{stat.label}</CardBody>
            </Card>
          ))}
        </section>

        {/* Tabs + Recent Problems */}
        <section>
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key.toString())}
            variant="underlined"
            color="primary"
            className="mb-6"
          >
            <Tab key="all" title="All" />
            <Tab key="solved" title="Solved" />
            <Tab key="attempted" title="Attempted" />
            <Tab key="failed" title="Failed" />
          </Tabs>

          <div className="space-y-4">
            {filtered.map((p) => (
              <Card
                key={p.id}
                isPressable
                onPress={() => (window.location.href = `/problems/${p.id}`)}
                className="rounded-lg bg-[#1a1a1a] hover:bg-[#262626] transition flex justify-between items-center p-4 border border-gray-800 hover:border-purple-500 w-full"
              >
                <div className="w-full">
                  <h3 className="font-medium text-lg truncate">{p.title}</h3>
                  <p className="text-sm text-gray-400">
                    {p.difficulty} • {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </p>
                </div>
                {p.status === "failed" && (
                  <Button
                    size="sm"
                    variant="bordered"
                    className="border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white transition"
                  >
                    Retry
                  </Button>
                )}
              </Card>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-gray-500">No problems to display.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
