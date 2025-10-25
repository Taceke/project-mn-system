"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/app/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchTasks() {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      } else {
        toast.error("Failed to fetch tasks");
      }
      setLoading(false);
    }
    fetchTasks();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Task deleted!");
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } else {
      const error = await res.json();
      toast.error(error.error || "Failed to delete task");
    }
  }

  if (loading) return <p className="p-6">Loading tasks...</p>;

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Link
          href="/admin/tasks/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + New Task
        </Link>
      </div>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 text-left shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border p-3">Title</th>
                <th className="border p-3">Project</th>
                <th className="border p-3">Assignee</th>
                <th className="border p-3">Status</th>
                <th className="border p-3">Priority</th>
                <th className="border p-3">Due Date</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition">
                  <td className="border p-3">{t.title}</td>
                  <td className="border p-3">{t.project?.name || "N/A"}</td>
                  <td className="border p-3">{t.assignee?.name || "Unassigned"}</td>
                  <td className="border p-3">{t.status}</td>
                  <td className="border p-3">{t.priority}</td>
                  <td className="border p-3">
                    {t.dueDate ? new Date(t.dueDate).toDateString() : "N/A"}
                  </td>
                  <td className="border p-3 flex justify-center gap-2">
                    <button
                      onClick={() => router.push(`/admin/tasks/${t.id}`)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/admin/tasks/${t.id}/edit`)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
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
