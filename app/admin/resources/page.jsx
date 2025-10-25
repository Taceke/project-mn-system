"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/app/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    projectId: "",
    userId: "",
    allocationPercent: 100,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const router = useRouter(); // ✅ ADD THIS

  // Modal state
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resR, resP, resU] = await Promise.all([
          fetch("/api/resources"),
          fetch("/api/projects"),
          fetch("/api/admin/users"),
        ]);

        const [dataR, dataP, dataU] = await Promise.all([
          resR.json(),
          resP.json(),
          resU.json(),
        ]);

        setResources(dataR);
        setProjects(dataP);
        setUsers(dataU);
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ✅ Create Resource
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create resource");

      const newResource = await res.json();
      setResources([newResource, ...resources]);
      toast.success("Resource created successfully");
      setForm({ projectId: "", userId: "", allocationPercent: 100 });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ✅ Delete Resource
  async function handleDelete(id) {
    if (!confirm("Delete this resource?")) return;
    try {
      const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete resource");
      setResources(resources.filter((r) => r.id !== id));
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
  }

  // ✅ Open Modal for Edit
  function openEditModal(resource) {
    setEditData(resource);
    setEditing(true);
  }

  // ✅ Update Resource
  async function handleUpdate() {
    setUpdating(true);
    try {
      const res = await fetch(`/api/resources/${editData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: editData.projectId,
          userId: editData.userId,
          allocationPercent: editData.allocationPercent,
        }),
      });

      if (!res.ok) throw new Error("Failed to update resource");

      const updated = await res.json();
      setResources(resources.map((r) => (r.id === updated.id ? updated : r)));
      toast.success("Resource updated successfully");
      setEditing(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <DashboardLayout>
      <Toaster />
      <div className="max-w-5xl mx-auto bg-white p-6 shadow rounded">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Resources</h1>

          {/* ✅ FIXED: Added Link import */}
          <Link
            href="/admin/resources/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + New Resource
          </Link>
        </div>

        {/* Create Resource Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 mb-6">
          <select
            value={form.projectId}
            onChange={(e) => setForm({ ...form, projectId: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={form.allocationPercent}
            onChange={(e) =>
              setForm({ ...form, allocationPercent: parseInt(e.target.value) })
            }
            placeholder="Allocation %"
            className="border p-2 rounded"
          />

          <button
            type="submit"
            disabled={saving}
            className={`col-span-3 px-4 py-2 text-white rounded ${
              saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Saving..." : "Add Resource"}
          </button>
        </form>

        {/* ✅ FIXED Resource List */}
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Project</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Allocation %</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((r) => (
              <tr key={r.id}>
                <td className="p-2 border">{r.project?.name || "N/A"}</td>
                <td className="p-2 border">{r.user?.name || "N/A"}</td>
                <td className="p-2 border">{r.allocationPercent}%</td>
                <td className="p-2 border text-center space-x-2">
                  {/* ✅ FIXED variable name and router usage */}
                  <button
                    onClick={() => router.push(`/admin/resources/${r.id}`)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => openEditModal(r)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Edit Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded shadow-lg w-96"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <h2 className="text-xl font-semibold mb-4">Edit Resource</h2>

              <select
                value={editData.projectId}
                onChange={(e) =>
                  setEditData({ ...editData, projectId: e.target.value })
                }
                className="border p-2 rounded w-full mb-3"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                value={editData.userId}
                onChange={(e) =>
                  setEditData({ ...editData, userId: e.target.value })
                }
                className="border p-2 rounded w-full mb-3"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={editData.allocationPercent}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    allocationPercent: parseInt(e.target.value),
                  })
                }
                className="border p-2 rounded w-full mb-3"
                placeholder="Allocation %"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditing(false)}
                  className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className={`px-3 py-1 text-white rounded ${
                    updating ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {updating ? "Updating..." : "Save"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
