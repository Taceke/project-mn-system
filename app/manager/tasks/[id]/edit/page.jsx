"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import TaskDependencies from "@/app/components/TaskDependencies";

export default function EditTaskPage({ params }) {
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projectTasks, setProjectTasks] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [form, setForm] = useState({
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

  // Fetch task details
  useEffect(() => {
    async function fetchTask() {
      const res = await fetch(`/api/tasks/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setTask(data);
        setForm({
          title: data.title,
          description: data.description || "",
          status: data.status,
          priority: data.priority,
          startDate: data.startDate ? data.startDate.split("T")[0] : "",
          dueDate: data.dueDate ? data.dueDate.split("T")[0] : "",
          estimatedHours: data.estimatedHours || 0,
          spentHours: data.spentHours || 0,
          deliverableName: data.deliverableName || "",
          assigneeId: data.assigneeId || "",
        });

        // Set initial dependencies if available
        if (data.dependencies) {
          setDependencies(data.dependencies.map(d => d.dependsOn));
        }

        // Fetch other tasks in the same project
        if (data.projectId) {
          const tasksRes = await fetch(`/api/tasks?projectId=${data.projectId}`);
          if (tasksRes.ok) {
            const allTasks = await tasksRes.json();
            // Exclude the current task
            setProjectTasks(allTasks.filter(t => t.id !== params.id));
          }
        }
      } else {
        alert("Failed to fetch task");
      }
      setLoading(false);
    }

    fetchTask();
  }, [params.id]);

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = { ...form, dependencies };

    const res = await fetch(`/api/tasks/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push(`/admin/tasks/${params.id}`);
    } else {
      alert("Failed to update task");
    }
  }

  if (loading) return <p className="p-6">Loading task...</p>;
  if (!task) return <p className="p-6">Task not found</p>;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">Edit Task</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-2 border rounded"
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-2 border rounded"
          />

          {/* Status */}
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="TO_DO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="COMPLETED">Completed</option>
            <option value="BLOCKED">Blocked</option>
          </select>

          {/* Priority */}
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>

          {/* Dates */}
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="w-full p-2 border rounded"
          />

          {/* Hours */}
          <input
            type="number"
            placeholder="Estimated Hours"
            value={form.estimatedHours}
            onChange={(e) => setForm({ ...form, estimatedHours: parseFloat(e.target.value) })}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Spent Hours"
            value={form.spentHours}
            onChange={(e) => setForm({ ...form, spentHours: parseFloat(e.target.value) })}
            className="w-full p-2 border rounded"
          />

          {/* Deliverable */}
          <input
            type="text"
            placeholder="Deliverable Name"
            value={form.deliverableName}
            onChange={(e) => setForm({ ...form, deliverableName: e.target.value })}
            className="w-full p-2 border rounded"
          />

          {/* Dependencies */}
          {projectTasks.length > 0 && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">Dependencies</label>
              <select
                multiple
                value={dependencies}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                  setDependencies(selected);
                }}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {projectTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
              <p className="text-gray-500 text-sm mt-1">
                Select tasks that must be completed before this task.
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
