"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";

export default function TaskDetails({ params }) {
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTask() {
      const res = await fetch(`/api/tasks/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setTask(data);
      } else {
        alert("Failed to fetch task");
      }
      setLoading(false);
    }
    fetchTask();
  }, [params.id]);

  if (loading) return <p className="p-6">Loading task...</p>;
  if (!task) return <p className="p-6">Task not found</p>;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-6 bg-white shadow rounded">
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <p className="text-gray-600 mt-2">{task.description || "No description provided."}</p>

          <div className="mt-4 space-y-2">
            <p>📌 Project: {task.project?.name || "N/A"}</p>
            <p>👤 Assignee: {task.assignee?.name || "Unassigned"}</p>
            <p>⚡ Priority: {task.priority}</p>
            <p>📊 Status: {task.status}</p>
            <p>⏳ Estimated Hours: {task.estimatedHours}</p>
            <p>🕒 Spent Hours: {task.spentHours}</p>
            <p>📄 Deliverable: {task.deliverableName || "N/A"}</p>
            <p>
              📅 Start Date:{" "}
              {task.startDate ? new Date(task.startDate).toDateString() : "N/A"}
            </p>
            <p>
              📅 Due Date:{" "}
              {task.dueDate ? new Date(task.dueDate).toDateString() : "N/A"}
            </p>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={() => router.push(`/admin/tasks/${task.id}/edit`)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              ✏️ Edit Task
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
