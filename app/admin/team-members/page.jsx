"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/app/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";

export default function TeamMembersPage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        const res = await fetch("/api/team-members");
        if (res.ok) {
          setTeamMembers(await res.json());
        } else {
          toast.error("Failed to fetch team members");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching team members");
      } finally {
        setLoading(false);
      }
    }
    fetchTeamMembers();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this team member?")) return;
    try {
      const res = await fetch(`/api/team-members/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setTeamMembers(teamMembers.filter((tm) => tm.id !== id));
      toast.success("Member removed");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  }

  if (loading) return <p className="p-6">Loading team members...</p>;

  return (
    <DashboardLayout>
      <Toaster />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <Link
          href="/admin/team-members/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add Member
        </Link>
      </div>

      {teamMembers.length === 0 ? (
        <p>No team members found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 text-left shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border p-3">Team</th>
                <th className="border p-3">Member</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((tm) => (
                <tr key={tm.id} className="hover:bg-gray-50 transition">
                  <td className="border p-3">{tm.team?.name}</td>
                  <td className="border p-3">{tm.user?.name}</td>
                  <td className="border p-3 text-center space-x-2">
                    <button
                      onClick={() => handleDelete(tm.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
