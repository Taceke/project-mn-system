"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/app/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";

export default function RisksPage() {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Fetch all risks
  useEffect(() => {
    async function fetchRisks() {
      try {
        const res = await fetch("/api/risks");
        if (!res.ok) throw new Error("Failed to fetch risks");
        const data = await res.json();
        setRisks(data);
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRisks();
  }, []);

  // ✅ Delete risk
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this risk?")) return;

    try {
      const res = await fetch(`/api/risks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete risk");

      setRisks((prev) => prev.filter((r) => r.id !== id));
      toast.success("Risk deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  }

  if (loading) return <p className="p-6">Loading risks...</p>;
  if (risks.length === 0)
    return (
      <DashboardLayout>
        <Toaster />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Risks</h1>
          <Link
            href="/admin/risks/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + New Risk
          </Link>
          <p className="mt-4">No risks found.</p>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <Toaster />
      <div className="max-w-6xl mx-auto bg-white p-6 shadow rounded">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Risks</h1>
          <Link
            href="/admin/risks/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + New Risk
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 text-left shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border p-3">Title</th>
                <th className="border p-3">Project</th>
                <th className="border p-3">Severity</th>
                <th className="border p-3">Status</th>
                <th className="border p-3">Reported By</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition">
                  <td className="border p-3">{r.title}</td>
                  <td className="border p-3">{r.project?.name || "N/A"}</td>
                  <td className="border p-3">{r.severity}</td>
                  <td className="border p-3">{r.status}</td>
                  <td className="border p-3">{r.reportedBy?.name || "N/A"}</td>
                  <td className="border p-3 flex justify-center gap-2">
                    <button
                      onClick={() => router.push(`/admin/risks/${r.id}`)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/admin/risks/${r.id}/edit`)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
