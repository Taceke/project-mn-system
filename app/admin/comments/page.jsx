"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/app/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    content: "",
    userId: "",
    projectId: "",
    taskId: "",
    file: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Load comments, projects, tasks, users
  useEffect(() => {
    async function fetchData() {
      try {
        const [commentsRes, projectsRes, tasksRes, usersRes] =
          await Promise.all([
            fetch("/api/comments"),
            fetch("/api/projects"),
            fetch("/api/tasks"),
            fetch("/api/admin/users"),
          ]);

        const [commentsData, projectsData, tasksData, usersData] =
          await Promise.all([
            commentsRes.json(),
            projectsRes.json(),
            tasksRes.json(),
            usersRes.json(),
          ]);

        setComments(commentsData);
        setProjects(projectsData);
        setTasks(tasksData);
        setUsers(usersData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Add new comment
  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.content.trim()) return toast.error("Comment content required");
    if (!form.userId) return toast.error("Select a user");

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("content", form.content);
      formData.append("userId", form.userId);
      if (form.projectId) formData.append("projectId", form.projectId);
      if (form.taskId) formData.append("taskId", form.taskId);
      if (form.file) formData.append("file", form.file);

      const res = await fetch("/api/comments", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to add comment");

      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      toast.success("Comment added successfully");

      setForm({
        content: "",
        userId: "",
        projectId: "",
        taskId: "",
        file: null,
      });
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Open edit modal
  function openEditModal(comment) {
    setEditData({
      id: comment.id,
      content: comment.content,
      userId: comment.userId || "",
      projectId: comment.projectId || "",
      taskId: comment.taskId || "",
      file: null,
    });
    setEditing(true);
  }

  // Update comment
  async function handleUpdate() {
    if (!editData.content.trim())
      return toast.error("Comment content required");
    if (!editData.userId) return toast.error("Select a user");

    setUpdating(true);
    try {
      const res = await fetch(`/api/comments/${editData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: editData.content,
          userId: editData.userId,
          projectId: editData.projectId || null,
          taskId: editData.taskId || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to update comment");
      const updatedComment = await res.json();

      setComments((prev) =>
        prev.map((c) => (c.id === updatedComment.id ? updatedComment : c))
      );
      toast.success("Comment updated");
      setEditing(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  }

  // Delete comment
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete comment");

      setComments((prev) => prev.filter((c) => c.id !== id));
      toast.success("Comment deleted");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  }

  if (loading) return <p className="p-6">Loading comments...</p>;

  return (
    <DashboardLayout>
      <Toaster />
      <div className="max-w-5xl mx-auto bg-white p-6 shadow rounded">
        <h1 className="text-2xl font-bold mb-4">Comments</h1>

        {/* Add Comment Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 mb-6">
          <select
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value })}
            className="border p-2 rounded col-span-1"
            required
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <select
            value={form.projectId}
            onChange={(e) => setForm({ ...form, projectId: e.target.value })}
            className="border p-2 rounded col-span-1"
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={form.taskId}
            onChange={(e) => setForm({ ...form, taskId: e.target.value })}
            className="border p-2 rounded col-span-1"
          >
            <option value="">Select Task</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>

          <input
            type="file"
            onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
            className="border p-2 rounded col-span-1"
          />

          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Write your comment..."
            className="border p-2 rounded col-span-3 h-24"
          />

          <button
            type="submit"
            disabled={saving}
            className={`col-span-3 px-4 py-2 text-white rounded ${
              saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Posting..." : "Add Comment"}
          </button>
        </form>

        {/* Comments Table */}
        {comments.length === 0 ? (
          <p>No comments found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Comment</th>
                <th className="border p-2">Project</th>
                <th className="border p-2">Task</th>
                <th className="border p-2">User</th>
                <th className="border p-2">Attachment</th>
                <th className="border p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((c) => (
                <tr key={c.id}>
                  <td className="border p-2">{c.content}</td>
                  <td className="border p-2">{c.project?.name || "—"}</td>
                  <td className="border p-2">{c.task?.title || "—"}</td>
                  <td className="border p-2">{c.user?.name || "—"}</td>
                  <td className="border p-2">
                    {c.attachments?.length > 0
                      ? c.attachments.map((a) => (
                          <a
                            key={a.id}
                            href={a.filePath.startsWith("/") ? a.filePath : `/uploads/${a.filePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline mr-2"
                          >
                            {a.fileName}
                          </a>
                        ))
                      : "—"}
                  </td>
                  <td className="border p-2 text-center space-x-2">
                    <button
                      onClick={() => openEditModal(c)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
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
              <h2 className="text-xl font-semibold mb-4">Edit Comment</h2>

              <select
                value={editData.userId}
                onChange={(e) => setEditData({ ...editData, userId: e.target.value })}
                className="border p-2 rounded w-full mb-3"
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <select
                value={editData.projectId}
                onChange={(e) => setEditData({ ...editData, projectId: e.target.value })}
                className="border p-2 rounded w-full mb-3"
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                value={editData.taskId}
                onChange={(e) => setEditData({ ...editData, taskId: e.target.value })}
                className="border p-2 rounded w-full mb-3"
              >
                <option value="">Select Task</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>

              <textarea
                value={editData.content}
                onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                className="border p-2 rounded w-full mb-3 h-24"
              />

              <input
                type="file"
                onChange={(e) => setEditData({ ...editData, file: e.target.files[0] })}
                className="border p-2 rounded w-full mb-3"
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
