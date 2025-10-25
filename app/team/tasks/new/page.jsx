"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";

export default function NewTaskPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    projectId: "",
    title: "",
    description: "",
    status: "TO_DO",
    priority: "MEDIUM",
    startDate: "",
    dueDate: "",
    estimatedHours: 0,
    spentHours: 0,
    deliverableName: "",
    assigneeId: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch projects & users for dropdowns
  useEffect(() => {
    async function fetchData() {
      const [projRes, userRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/admin/users"),
      ]);
      if (projRes.ok) setProjects(await projRes.json());
      if (userRes.ok) setUsers(await userRes.json());
    }
    fetchData();
  }, []);

  function validateForm() {
    const newErrors = {};
    if (!form.projectId) newErrors.projectId = "Project is required.";
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (form.startDate && form.dueDate && form.startDate > form.dueDate)
      newErrors.dueDate = "Due date must be after start date.";
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success("✅ Task created successfully!");
      setTimeout(() => router.push("/admin/tasks"), 1500);
    } else {
      const error = await res.json();
      toast.error(error.error || "❌ Failed to create task");
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
        <Toaster position="top-right" />
        <div className="max-w-2xl w-full bg-white shadow-2xl rounded-2xl p-8">
          <h1 className="text-3xl font-extrabold mb-6 text-green-700 text-center">
            Create New Task
          </h1>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Project */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Project
              </label>
              <select
                value={form.projectId}
                onChange={(e) =>
                  setForm({ ...form, projectId: e.target.value })
                }
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-300 ${
                  errors.projectId ? "border-red-400" : "border-gray-300"
                }`}
              >
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.projectId && (
                <p className="text-red-500 text-sm mt-1">{errors.projectId}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                placeholder="Task title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-300 ${
                  errors.title ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
                rows={4}
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                  className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-300 ${
                    errors.dueDate ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
                )}
              </div>
            </div>

            {/* Priority & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  <option value="TO_DO">TO_DO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="IN_REVIEW">IN_REVIEW</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="BLOCKED">BLOCKED</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Priority
                </label>
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
            </div>

            {/* Hours & Deliverable */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  value={form.estimatedHours}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      estimatedHours: parseFloat(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Spent Hours
                </label>
                <input
                  type="number"
                  value={form.spentHours}
                  onChange={(e) =>
                    setForm({ ...form, spentHours: parseFloat(e.target.value) })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>
            </div>

            {/* Deliverable */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Deliverable Name
              </label>
              <input
                type="text"
                value={form.deliverableName}
                onChange={(e) =>
                  setForm({ ...form, deliverableName: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Assign To
              </label>
              <select
                value={form.assigneeId}
                onChange={(e) =>
                  setForm({ ...form, assigneeId: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <option value="">Select user</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300"
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
