"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";

export default function NewRiskPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    projectId: "",
    title: "",
    description: "",
    severity: "LOW",
    mitigationPlan: "",
    reportedById: "",
  });

  // Fetch projects and users
  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsRes, usersRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/admin/users"),
        ]);

        if (projectsRes.ok) setProjects(await projectsRes.json());
        if (usersRes.ok) setUsers(await usersRes.json());
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch projects or users");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.projectId ||
      !form.title ||
      !form.severity ||
      !form.reportedById
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/risks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create risk");

      toast.success("Risk created successfully!");
      router.push("/admin/risks");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">Create New Risk</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-semibold">Project *</label>
            <select
              value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="Risk title"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="border p-2 rounded w-full"
              placeholder="Describe the risk"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Severity *</label>
            <select
              value={form.severity}
              onChange={(e) => setForm({ ...form, severity: e.target.value })}
              className="border p-2 rounded w-full"
              required
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Mitigation Plan</label>
            <textarea
              value={form.mitigationPlan}
              onChange={(e) =>
                setForm({ ...form, mitigationPlan: e.target.value })
              }
              className="border p-2 rounded w-full"
              placeholder="Plan to mitigate risk"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Reported By *</label>
            <select
              value={form.reportedById}
              onChange={(e) =>
                setForm({ ...form, reportedById: e.target.value })
              }
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded text-white ${
              submitting ? "bg-gray-400" : "bg-green-600"
            }`}
          >
            {submitting ? "Creating..." : "Create Risk"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
