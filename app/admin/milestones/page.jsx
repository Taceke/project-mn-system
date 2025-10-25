"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/app/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";

export default function AdminMilestonesPage() {
  const router = useRouter();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all milestones
  useEffect(() => {
    async function fetchMilestones() {
      const res = await fetch("/api/milestones");
      if (res.ok) {
        const data = await res.json();
        setMilestones(data);
      } else {
        toast.error("Failed to fetch milestones");
      }
      setLoading(false);
    }
    fetchMilestones();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this milestone?")) return;

    const res = await fetch(`/api/milestones/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Milestone deleted!");
      setMilestones((prev) => prev.filter((m) => m.id !== id));
    } else {
      const error = await res.json();
      toast.error(error.error || "Failed to delete milestone");
    }
  }

  if (loading) return <p className="p-6">Loading milestones...</p>;

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Milestones</h1>
        <Link
          href="/admin/milestones/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Milestone
        </Link>
      </div>

      {milestones.length === 0 ? (
        <p>No milestones found.</p>
      ) : (
        <table className="w-full border border-gray-200 text-left rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Project</th>
              <th className="p-3 border">Due Date</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {milestones.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="p-3 border">{m.name}</td>
                <td className="p-3 border">{m.project?.name || "Unknown"}</td>
                <td className="p-3 border">{new Date(m.dueDate).toDateString()}</td>
                <td className="p-3 border">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      m.isCompleted
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {m.isCompleted ? "Completed" : "Pending"}
                  </span>
                </td>
                <td className="p-3 border text-center space-x-2">
                  <Link
                    href={`/admin/milestones/${m.id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/milestones/${m.id}/edit`}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DashboardLayout>
  );
}
