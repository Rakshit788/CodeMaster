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

      // Update counts only
      setTotalSubmissions(subjson.totalSubmissions || 0);
      setTotalSolved(passedJson.totalProblemsPassed || 0);
      setTotalAttempted(failedJson.totalProblemsFailed || 0);

      // Prepare last 10 submissions for display
      const displayProblems = (subjson.submissions || [])
        .slice(-10)
        .map((p) => ({
          id: p.id,
          title: p.title.split("").join(""),
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
      <aside className="w-64 p-6 bg-[#121212] hidden sm:flex flex-col gap-6">
        <div className="flex items-center gap-4">
          {userdata?.user?.image ? (
            <img
              src={userdata.user.image}
              alt="User"
              className="rounded-full h-14 w-14"
            />
          ) : (
            <Avatar name="User" size="lg" />
          )}
          <div>
            <p className="font-semibold">{userdata?.user?.name}</p>
            <p className="text-sm text-gray-400">{userdata?.user?.email}</p>
          </div>
        </div>

        <Button
          color="danger"
          variant="bordered"
          size="sm"
          className="bg-red-600 w-full"
          onClick={() => signOut()}
        >
          Sign Out
        </Button>

        <Divider className="bg-gray-700" />

        <h2 className="text-xl font-bold">Tags</h2>
        <div className="space-y-2">
          
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-4 py-8 max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">CodeMaster Stats</h1>
          <p className="text-gray-400">
            Overview of your problem-solving progress
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <Card className="rounded-2xl bg-[#1a1a1a] text-center hover:shadow-md transition">
            <CardHeader className="justify-center">
              <h2 className="text-3xl font-semibold">
                {totalSolved.toLocaleString()}
              </h2>
            </CardHeader>
            <CardBody className="text-gray-400">Solved</CardBody>
          </Card>

          <Card className="rounded-2xl bg-[#1a1a1a] text-center hover:shadow-md transition">
            <CardHeader className="justify-center">
              <h2 className="text-3xl font-semibold">
                {totalAttempted.toLocaleString()}
              </h2>
            </CardHeader>
            <CardBody className="text-gray-400">Attempted</CardBody>
          </Card>

          <Card className="rounded-2xl bg-[#1a1a1a] text-center hover:shadow-md transition">
            <CardHeader className="justify-center">
              <h2 className="text-3xl font-semibold">
                {totalSubmissions.toLocaleString()}
              </h2>
            </CardHeader>
            <CardBody className="text-gray-400">Submissions</CardBody>
          </Card>
        </section>

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
                className="rounded-lg bg-[#1a1a1a] hover:bg-[#262626] transition flex justify-between items-center p-4"
              >
                <div>
                  <h3 className="font-medium text-lg">{p.title}</h3>
                  <p className="text-sm text-gray-400">
                    {p.difficulty} •{" "}
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </p>
                </div>
                {p.status === "failed" && (
                  <Button size="sm" color="danger" variant="light">
                    Retry
                  </Button>
                )}
              </Card>
            ))}

            {filtered.length === 0 && (
              <p className="text-center text-gray-500">
                No problems to display.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
