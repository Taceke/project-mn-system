"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";

export default function ProjectDetails({ params }) {
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${params.id}`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to fetch project");
        }
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error("❌ Project fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [params.id]);

  if (loading) return <p className="p-6">⏳ Loading project...</p>;
  if (error) return <p className="p-6 text-red-600">⚠️ {error}</p>;
  if (!project) return <p className="p-6">❌ Project not found</p>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Project Overview */}
        <div className="p-6 bg-white shadow rounded">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="mt-2 text-gray-600">{project.description}</p>
          <p className="mt-2">💰 Budget: ${project.budgetedCost}</p>
          <p className="mt-2">
            📅 Start:{" "}
            {project.startDate ? new Date(project.startDate).toDateString() : "N/A"}
          </p>
          <p className="mt-2">
            📅 Due: {project.dueDate ? new Date(project.dueDate).toDateString() : "N/A"}
          </p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => router.push(`/admin/projects/${project.id}/edit`)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              ✏️ Edit Project
            </button>
          </div>
        </div>

        {/* Milestones */}
        <div className="p-6 bg-white shadow rounded">
          <h2 className="text-2xl font-bold mb-4">Milestones</h2>
          {project.milestones.length === 0 ? (
            <p>No milestones added yet.</p>
          ) : (
            <ul className="space-y-2">
              {project.milestones.map((m) => (
                <li
                  key={m.id}
                  className="border p-2 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{m.name}</p>
                    <p className="text-gray-600 text-sm">
                      Due: {m.dueDate ? new Date(m.dueDate).toDateString() : "N/A"}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      m.isCompleted
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {m.isCompleted ? "Completed" : "Pending"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tasks */}
        <div className="p-6 bg-white shadow rounded">
          <h2 className="text-2xl font-bold mb-4">Tasks</h2>
          {project.tasks.length === 0 ? (
            <p>No tasks assigned yet.</p>
          ) : (
            <ul className="space-y-2">
              {project.tasks.map((t) => (
                <li
                  key={t.id}
                  className="border p-2 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{t.title}</p>
                    <p className="text-gray-600 text-sm">
                      Status: {t.status} | Priority: {t.priority}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      t.status === "DONE"
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {t.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
