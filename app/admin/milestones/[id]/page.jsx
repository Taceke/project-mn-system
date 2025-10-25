"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";

export default function MilestoneDetails({ params }) {
  const router = useRouter();
  const [milestone, setMilestone] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMilestone() {
      const res = await fetch(`/api/milestones/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setMilestone(data);
      } else {
        toast.error("Failed to fetch milestone");
      }
      setLoading(false);
    }
    fetchMilestone();
  }, [params.id]);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this milestone?")) return;

    const res = await fetch(`/api/milestones/${params.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Milestone deleted!");
      setTimeout(() => router.push("/admin/milestones"), 1000);
    } else {
      const error = await res.json();
      toast.error(error.error || "Failed to delete milestone");
    }
  }

  if (loading) return <p className="p-6">Loading milestone...</p>;
  if (!milestone) return <p className="p-6">Milestone not found</p>;

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto bg-gray-50 min-h-screen p-6 space-y-6">
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <h1 className="text-3xl font-extrabold text-blue-700">
            {milestone.name}
          </h1>
          <p className="mt-2 text-gray-600">
            Project: {milestone.project?.name || "Unknown"}
          </p>
          <p className="mt-2 text-gray-600">
            Due Date: {milestone.dueDate ? new Date(milestone.dueDate).toDateString() : "N/A"}
          </p>
          <p className="mt-2 text-gray-600">
            Status:{" "}
            <span
              className={`px-2 py-1 rounded font-semibold text-sm ${
                milestone.isCompleted ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"
              }`}
            >
              {milestone.isCompleted ? "Completed" : "Pending"}
            </span>
          </p>

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => router.push(`/admin/milestones/${milestone.id}/edit`)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
