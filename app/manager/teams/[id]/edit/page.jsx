"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";

export default function EditTeamPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isClient, setIsClient] = useState(false);

  const [team, setTeam] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ Fetch team and users
  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      try {
        const [teamRes, usersRes] = await Promise.all([
          fetch(`/api/teams/${id}`),
          fetch("/api/admin/users"),
        ]);

        if (teamRes.ok && usersRes.ok) {
          const teamData = await teamRes.json();
          const usersData = await usersRes.json();
          setTeam(teamData);
          setUsers(usersData);
          setSelectedMembers(teamData.members.map((m) => m.userId));
        } else {
          toast.error("Failed to fetch team data");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error loading team");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // ✅ Handle update
  async function handleSubmit(e) {
    e.preventDefault();
    if (!team.name) {
      toast.error("Please enter a team name");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/teams/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: team.name,
          members: selectedMembers,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update team");
      }

      toast.success("Team updated successfully!");
      router.push("/admin/teams");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // ✅ Handle delete
  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this team?")) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/teams/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete team");
      }

      toast.success("Team deleted successfully!");
      router.push("/admin/teams");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  }

  if (!isClient) return null;
  if (loading) return <p className="p-6">Loading team...</p>;
  if (!team) return <p className="p-6">Team not found.</p>;

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Edit Team</h1>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`px-3 py-2 rounded text-white ${
              deleting ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {deleting ? "Deleting..." : "Delete Team"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team Name */}
          <div>
            <label className="block mb-1 font-semibold">Team Name *</label>
            <input
              type="text"
              value={team.name}
              onChange={(e) => setTeam({ ...team, name: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="Enter team name"
              required
            />
          </div>

          {/* Members */}
          <div>
            <label className="block mb-1 font-semibold">Select Members</label>
            <div className="grid grid-cols-2 gap-2">
              {users.map((u) => (
                <label
                  key={u.id}
                  className="flex items-center gap-2 border p-2 rounded"
                >
                  <input
                    type="checkbox"
                    value={u.id}
                    checked={selectedMembers.includes(u.id)}
                    onChange={(e) => {
                      const uid = e.target.value;
                      setSelectedMembers((prev) =>
                        prev.includes(uid)
                          ? prev.filter((x) => x !== uid)
                          : [...prev, uid]
                      );
                    }}
                  />
                  {u.name}
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded text-white ${
              submitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Updating..." : "Update Team"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
