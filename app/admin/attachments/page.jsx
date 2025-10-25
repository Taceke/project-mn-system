"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/app/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";

export default function AttachmentsPage() {
  const [attachments, setAttachments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    projectId: "",
    taskId: "",
    uploadedById: "",
  });
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  // ✅ Fetch all data
  useEffect(() => {
    async function fetchData() {
      try {
        const [aRes, pRes, tRes, uRes] = await Promise.all([
          fetch("/api/attachments"),
          fetch("/api/projects"),
          fetch("/api/tasks"),
          fetch("/api/admin/users"),
        ]);

        const [aData, pData, tData, uData] = await Promise.all([
          aRes.json(),
          pRes.json(),
          tRes.json(),
          uRes.json(),
        ]);

        setAttachments(aData);
        setProjects(pData);
        setTasks(tData);
        setUsers(uData);
      } catch {
        toast.error("Failed to load data");
      }
    }
    fetchData();
  }, []);

  // ✅ Upload file
  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return toast.error("Please select a file");
    if (!form.uploadedById)
      return toast.error("Please select the uploader");

    const formData = new FormData();
    formData.append("file", file);
    if (form.projectId) formData.append("projectId", form.projectId);
    if (form.taskId) formData.append("taskId", form.taskId);
    formData.append("uploadedById", form.uploadedById);

    setUploading(true);
    try {
      const res = await fetch("/api/attachments", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const newAttachment = await res.json();
      setAttachments([newAttachment, ...attachments]);
      toast.success("File uploaded successfully");
      setFile(null);
      setForm({ projectId: "", taskId: "", uploadedById: "" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  // ✅ Delete attachment
  async function handleDelete(id) {
    if (!confirm("Delete this attachment?")) return;
    try {
      const res = await fetch(`/api/attachments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete attachment");
      setAttachments(attachments.filter((a) => a.id !== id));
      toast.success("Attachment deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
  }

  const openPreview = (filePath) => setPreview(filePath);
  const closePreview = () => setPreview(null);

  return (
    <DashboardLayout>
      <Toaster />
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📎 Attachments</h1>
        </div>

        {/* Upload Form */}
        <form
          onSubmit={handleUpload}
          className="grid md:grid-cols-5 gap-3 items-center bg-gray-50 p-4 rounded-xl mb-8 shadow-sm"
        >
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border border-gray-300 p-2 rounded w-full bg-white"
          />

          <select
            value={form.projectId}
            onChange={(e) => setForm({ ...form, projectId: e.target.value })}
            className="border border-gray-300 p-2 rounded bg-white"
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
            className="border border-gray-300 p-2 rounded bg-white"
          >
            <option value="">Select Task</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>

          <select
            value={form.uploadedById}
            onChange={(e) =>
              setForm({ ...form, uploadedById: e.target.value })
            }
            className="border border-gray-300 p-2 rounded bg-white"
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={uploading}
            className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {/* Attachments Table */}
        <div className="overflow-x-auto rounded-xl shadow-sm">
          <table className="w-full border-collapse overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">File</th>
                <th className="p-3 text-left">Project</th>
                <th className="p-3 text-left">Task</th>
                <th className="p-3 text-left">Uploaded By</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attachments.map((a) => (
                <tr
                  key={a.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td
                    className="p-3 font-medium text-blue-600 hover:underline cursor-pointer"
                    onClick={() => openPreview(a.filePath)}
                  >
                    {a.fileName}
                  </td>
                  <td className="p-3">{a.project?.name || "-"}</td>
                  <td className="p-3">{a.task?.title || "-"}</td>
                  <td className="p-3">{a.uploadedBy?.name || "Unknown"}</td>
                  <td className="p-3">
                    {new Date(a.uploadedAt).toLocaleDateString("en-US")}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <a
                      href={a.filePath}
                      download
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Download
                    </a>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {attachments.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-6 text-center text-gray-500 italic"
                  >
                    No attachments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 👁️ Preview Modal */}
      <AnimatePresence>
        {preview && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-4 max-w-4xl w-full relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={closePreview}
                className="absolute top-2 right-2 text-gray-700 hover:text-black text-xl"
              >
                ✕
              </button>
              {preview.endsWith(".pdf") ? (
                <iframe
                  src={preview}
                  className="w-full h-[500px] rounded"
                  title="Preview"
                />
              ) : (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto rounded-lg"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
