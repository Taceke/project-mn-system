"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";

export default function EditRiskPage() {
  const router = useRouter();
  const { id } = useParams(); // risk id from URL

  const [risk, setRisk] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch risk, projects, users
  useEffect(() => {
    async function fetchData() {
      try {
        const [riskRes, projectsRes, usersRes] = await Promise.all([
          fetch(`/api/risks/${id}`),
          fetch("/api/projects"),
          fetch("/api/admin/users"),
        ]);

        if (riskRes.ok) setRisk(await riskRes.json());
        if (projectsRes.ok) setProjects(await projectsRes.json());
        if (usersRes.ok) setUsers(await usersRes.json());
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();

    if (!risk?.projectId || !risk?.title || !risk?.severity || !risk?.reportedById) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/risks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(risk), // ✅ now correctly sending `risk`
      });

      const data = res.status !== 204 ? await res.json() : null;

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update risk");
      }

      toast.success("Risk updated successfully!");
      router.push("/admin/risks");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (!risk) return <p className="p-6">Risk not found.</p>;

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">Edit Risk</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Project */}
          <div>
            <label className="block mb-1 font-semibold">Project *</label>
            <select
              value={risk.projectId}
              onChange={(e) => setRisk({ ...risk, projectId: e.target.value })}
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

          {/* Title */}
          <div>
            <label className="block mb-1 font-semibold">Title *</label>
            <input
              type="text"
              value={risk.title}
              onChange={(e) => setRisk({ ...risk, title: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="Risk title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              value={risk.description || ""}
              onChange={(e) => setRisk({ ...risk, description: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="Describe the risk"
            />
          </div>

          {/* Severity */}
          <div>
            <label className="block mb-1 font-semibold">Severity *</label>
            <select
              value={risk.severity}
              onChange={(e) => setRisk({ ...risk, severity: e.target.value })}
              className="border p-2 rounded w-full"
              required
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {/* Mitigation Plan */}
          <div>
            <label className="block mb-1 font-semibold">Mitigation Plan</label>
            <textarea
              value={risk.mitigationPlan || ""}
              onChange={(e) => setRisk({ ...risk, mitigationPlan: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="Plan to mitigate risk"
            />
          </div>

          {/* Reported By */}
          <div>
            <label className="block mb-1 font-semibold">Reported By *</label>
            <select
              value={risk.reportedById}
              onChange={(e) => setRisk({ ...risk, reportedById: e.target.value })}
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

          {/* Status */}
          <div>
            <label className="block mb-1 font-semibold">Status *</label>
            <select
              value={risk.status}
              onChange={(e) => setRisk({ ...risk, status: e.target.value })}
              className="border p-2 rounded w-full"
              required
            >
              <option value="Open">Open</option>
              <option value="Mitigated">Mitigated</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded text-white ${
              submitting ? "bg-gray-400" : "bg-blue-600"
            }`}
          >
            {submitting ? "Updating..." : "Update Risk"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
