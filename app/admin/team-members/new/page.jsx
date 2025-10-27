"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/app/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function NewTeamMemberPage() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [teamId, setTeamId] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [teamsRes, usersRes] = await Promise.all([
          fetch("/api/teams"),
          fetch("/api/admin/users"),
        ]);

        if (teamsRes.ok) setTeams(await teamsRes.json());
        if (usersRes.ok) setUsers(await usersRes.json());
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!teamId || !userId) {
      toast.error("Please select both team and user");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/team-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, userId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add member");
      }

      toast.success("Member added successfully");
      router.push("/admin/team-members");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">Add Team Member</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Team */}
          <div>
            <label className="block mb-1 font-semibold">Team *</label>
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Select Team</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select User */}
          <div>
            <label className="block mb-1 font-semibold">User *</label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded text-white ${
              submitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Adding..." : "Add Member"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
