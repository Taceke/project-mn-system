"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";

export default function NewTeamPage() {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [memberIds, setMemberIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/admin/users");
      if (res.ok) setUsers(await res.json());
      setLoading(false);
    }
    fetchUsers();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name) return toast.error("Team name is required");

    const res = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, memberIds }),
    });

    if (res.ok) {
      toast.success("Team created successfully!");
      router.push("/admin/teams");
    } else {
      toast.error("Failed to create team");
    }
  }

  if (loading) return <p className="p-6">Loading users...</p>;

  return (
    <DashboardLayout>
      <Toaster />
      <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">Create New Team</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Team name"
            required
          />

          <div>
            <label className="block mb-1 font-semibold">Select Members</label>
            <div className="grid grid-cols-2 gap-2">
              {users.map((u) => (
                <label key={u.id} className="flex items-center gap-2 border p-2 rounded">
                  <input
                    type="checkbox"
                    value={u.id}
                    onChange={(e) => {
                      const id = e.target.value;
                      setMemberIds((prev) =>
                        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                      );
                    }}
                  />
                  {u.name}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Create Team
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
