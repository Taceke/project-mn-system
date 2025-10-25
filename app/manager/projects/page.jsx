"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/app/components/DashboardLayout";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else {
        alert("Failed to fetch projects");
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  // 🗑️ Handle Delete
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });

    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert("Failed to delete project");
    }
  }

  if (loading) return <p className="p-6">Loading projects...</p>;

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="w-full border border-gray-200 text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Budget</th>
                <th className="p-3 border">Start Date</th>
                <th className="p-3 border">Due Date</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-3 border font-semibold">{p.name}</td>
                  <td className="p-3 border text-gray-600">
                    {p.description || "No description"}
                  </td>
                  <td className="p-3 border">${p.budgetedCost}</td>
                  <td className="p-3 border">
                    {p.startDate ? new Date(p.startDate).toDateString() : "N/A"}
                  </td>
                  <td className="p-3 border">
                    {p.dueDate ? new Date(p.dueDate).toDateString() : "N/A"}
                  </td>
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        p.status === "Completed"
                          ? "bg-green-200 text-green-800"
                          : p.status === "In Progress"
                          ? "bg-blue-200 text-blue-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 border text-center space-x-2">
                    <Link
                      href={`/admin/projects/${p.id}`}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/projects/${p.id}/edit`}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
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
