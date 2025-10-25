"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";

export default function EditProjectPage({ params }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    dueDate: "",
    budgetedCost: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch project details
  useEffect(() => {
    async function fetchProject() {
      const res = await fetch(`/api/projects/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          name: data.name || "",
          description: data.description || "",
          startDate: data.startDate ? data.startDate.split("T")[0] : "",
          dueDate: data.dueDate ? data.dueDate.split("T")[0] : "",
          budgetedCost: data.budgetedCost || "",
        });
      } else {
        alert("Failed to fetch project");
      }
      setLoading(false);
    }
    fetchProject();
  }, [params.id]);

  if (loading) return <p className="p-6">Loading project...</p>;

  // Handle form submit (Update project)
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch(`/api/projects/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/projects");
    } else {
      const error = await res.json();
      alert(error.error || "Failed to update project");
      setSaving(false);
    }
  }

  // Handle delete
  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const res = await fetch(`/api/projects/${params.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/projects");
    } else {
      const error = await res.json();
      alert(error.error || "Failed to delete project");
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Project Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <input
            type="number"
            placeholder="Budget"
            value={form.budgetedCost}
            onChange={(e) => setForm({ ...form, budgetedCost: e.target.value })}
            className="border p-2 w-full rounded"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
