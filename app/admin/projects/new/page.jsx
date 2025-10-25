"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import DashboardLayout from "@/app/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";

export default function NewProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    dueDate: "",
    budgetedCost: "",
    status: "Planning",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validateForm() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Project name is required.";
    if (form.budgetedCost && Number(form.budgetedCost) < 0)
      newErrors.budgetedCost = "Budget must be positive.";
    if (form.startDate && form.dueDate && form.startDate > form.dueDate)
      newErrors.dueDate = "Due date must be after start date.";
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success("✅ Project created successfully!");
      setTimeout(() => router.push("/admin/projects"), 1500);
    } else {
      const error = await res.json();
      toast.error(error.error || "❌ Failed to create project");
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
        <Toaster position="top-right" reverseOrder={false} />

        <div className="max-w-lg w-full bg-white shadow-2xl rounded-2xl p-8">
          <h1 className="text-3xl font-extrabold mb-6 text-green-700 text-center">
            Create New Project
          </h1>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Project Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Project Name
              </label>
              <input
                type="text"
                placeholder="Enter project name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 transition ${
                  errors.name
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-green-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Description
              </label>
              <textarea
                placeholder="Project description"
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
                  className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 transition ${
                    errors.dueDate
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-300 focus:ring-green-300"
                  }`}
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
                )}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Budget ($)
              </label>
              <input
                type="number"
                placeholder="Enter budgeted cost"
                value={form.budgetedCost}
                onChange={(e) =>
                  setForm({ ...form, budgetedCost: e.target.value })
                }
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 transition ${
                  errors.budgetedCost
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-green-300"
                }`}
              />
              {errors.budgetedCost && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.budgetedCost}
                </p>
              )}
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Project"
              )}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
