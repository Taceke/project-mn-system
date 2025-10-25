"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";

export default function NewResourcePage() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    projectId: "",
    userId: "",
    allocationPercent: 100,
  });
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const [projRes, userRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/admin/users"),
        ]);
        const [projData, userData] = await Promise.all([
          projRes.json(),
          userRes.json(),
        ]);
        setProjects(projData);
        setUsers(userData);
      } catch (err) {
        toast.error("Failed to load projects or users");
      }
    }
    loadData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create resource");
      toast.success("Resource created successfully");
      router.push("/admin/resources");
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <DashboardLayout>
      <Toaster />
      <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Add Resource</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Project</label>
            <select
              className="border p-2 w-full rounded"
              value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
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
            <label className="block font-semibold mb-1">User</label>
            <select
              className="border p-2 w-full rounded"
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
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

          <div>
            <label className="block font-semibold mb-1">
              Allocation Percent (%)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              className="border p-2 w-full rounded"
              value={form.allocationPercent}
              onChange={(e) =>
                setForm({ ...form, allocationPercent: Number(e.target.value) })
              }
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Save Resource
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
