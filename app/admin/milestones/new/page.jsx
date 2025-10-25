"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";

export default function NewMilestonePage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    name: "",
    dueDate: "",
    projectId: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch projects for dropdown
  useEffect(() => {
    async function fetchProjects() {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    }
    fetchProjects();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/milestones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success("✅ Milestone created!");
      setTimeout(() => router.push("/admin/milestones"), 1200);
    } else {
      const error = await res.json();
      toast.error(error.error || "❌ Failed to create milestone");
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white shadow-2xl rounded-2xl p-8">
          <h1 className="text-3xl font-extrabold mb-6 text-blue-700 text-center">
            Create New Milestone
          </h1>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Milestone Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Milestone Name
              </label>
              <input
                type="text"
                placeholder="Enter milestone name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* Project Selection */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Project
              </label>
              <select
                value={form.projectId}
                onChange={(e) =>
                  setForm({ ...form, projectId: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">-- Select Project --</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300"
            >
              {loading ? "Creating..." : "Create Milestone"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
