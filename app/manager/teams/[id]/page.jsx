"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";

export default function ViewTeamPage() {
  const { id } = useParams();
  const router = useRouter();
  const [team, setTeam] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function fetchTeamAndUsers() {
      try {
        const [teamRes, usersRes] = await Promise.all([
          fetch(`/api/teams/${id}`),
          fetch("/api/admin/users"),
        ]);

        if (!teamRes.ok || !usersRes.ok)
          throw new Error("Failed to load team or users");

        const [teamData, usersData] = await Promise.all([
          teamRes.json(),
          usersRes.json(),
        ]);

        setTeam(teamData);
        setUsers(usersData);
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTeamAndUsers();
  }, [id]);

  async function handleAddMember() {
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }

    setAdding(true);
    try {
      const res = await fetch("/api/team-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: id, userId: selectedUser }),
      });

      if (!res.ok) throw new Error("Failed to add member");
      const newMember = await res.json();

      setTeam((prev) => ({
        ...prev,
        members: [...prev.members, newMember],
      }));

      toast.success("Member added successfully");
      setSelectedUser("");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  }

  async function handleRemoveMember(memberId) {
    if (!confirm("Remove this member from team?")) return;
    try {
      const res = await fetch(`/api/team-members/${memberId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove member");
      setTeam({
        ...team,
        members: team.members.filter((m) => m.id !== memberId),
      });
      toast.success("Member removed");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (!team) return <p className="p-6">Team not found.</p>;

  return (
    <DashboardLayout>
      <Toaster />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{team.name}</h1>
          <button
            onClick={() => router.push(`/admin/teams/${id}/edit`)}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            Edit Team
          </button>
        </div>

        {/* Add Member Section */}
        <div className="border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Add Member</h2>
          <div className="flex gap-2 items-center">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="border p-2 rounded flex-grow"
            >
              <option value="">Select a user</option>
              {users
                .filter(
                  (u) =>
                    !team.members.some((m) => m.userId === u.id)
                )
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
            </select>
            <button
              onClick={handleAddMember}
              disabled={adding}
              className={`px-4 py-2 rounded text-white ${
                adding ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {adding ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        {/* Team Members List */}
        <h2 className="text-lg font-semibold mb-2">Team Members</h2>
        {team.members.length === 0 ? (
          <p>No members in this team.</p>
        ) : (
          <ul className="space-y-2">
            {team.members.map((m) => (
              <li
                key={m.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>{m.user?.name}</span>
                <button
                  onClick={() => handleRemoveMember(m.id)}
                  className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}
