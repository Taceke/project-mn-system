"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";

export default function EditMilestonePage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", dueDate: "", isCompleted: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMilestone() {
      const res = await fetch(`/api/milestones/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          name: data.name,
          dueDate: new Date(data.dueDate).toISOString().split("T")[0],
          isCompleted: data.isCompleted,
        });
      }
      setLoading(false);
    }
    fetchMilestone();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch(`/api/milestones/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success("Milestone updated!");
      router.push(`/admin/milestones/${id}`);
    } else {
      toast.error("Failed to update milestone");
    }
  }

  if (loading) return <p className="p-6">Loading milestone...</p>;

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-4">Edit Milestone</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Due Date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.isCompleted}
            onChange={(e) => setForm({ ...form, isCompleted: e.target.checked })}
          />
          <label>Completed</label>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </DashboardLayout>
  );
}
