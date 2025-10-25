"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/app/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch("/api/teams");
        if (!res.ok) throw new Error("Failed to fetch teams");
        const data = await res.json();
        setTeams(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch teams");
      } finally {
        setLoading(false);
      }
    }
    fetchTeams();
  }, []);

  if (loading) return <p className="p-6">Loading teams...</p>;

  return (
    <DashboardLayout>
      <Toaster />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Teams</h1>
        <Link
          href="/admin/teams/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + New Team
        </Link>
      </div>

      {teams.length === 0 ? (
        <p>No teams found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 text-left shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border p-3">Name</th>
                <th className="border p-3">Members</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition">
                  <td className="border p-3">{t.name}</td>
                  <td className="border p-3">
                    {t.members.length > 0
                      ? t.members
                          .map((m) => m.user?.name || "Unnamed")
                          .join(", ")
                      : "No members"}
                  </td>
                  <td className="border p-3 text-center space-x-2">
                    {/* ✅ View Button */}
                    <Link
                      href={`/admin/teams/${t.id}`}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      View
                    </Link>

                    {/* ✅ Edit Button */}
                    <Link
                      href={`/admin/teams/${t.id}/edit`}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </Link>
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
