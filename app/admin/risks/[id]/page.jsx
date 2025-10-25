"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";

export default function ViewRiskPage() {
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    async function fetchRisk() {
      try {
        const res = await fetch(`/api/risks/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch risk");
        const data = await res.json();
        setRisk(data);
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRisk();
  }, [params.id]);

  if (loading) return <p className="p-6">Loading risk details...</p>;
  if (!risk) return <p className="p-6">Risk not found.</p>;

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="p-6 border rounded shadow bg-white">
        <h1 className="text-2xl font-bold mb-4">Risk Details</h1>
        <p><strong>Title:</strong> {risk.title}</p>
        <p><strong>Description:</strong> {risk.description}</p>
        <p><strong>Severity:</strong> {risk.severity}</p>
        <p><strong>Status:</strong> {risk.status}</p>
        <p><strong>Mitigation Plan:</strong> {risk.mitigationPlan || "N/A"}</p>
        <p><strong>Project:</strong> {risk.project?.name || "N/A"}</p>
        <p><strong>Reported By:</strong> {risk.reportedBy?.name}</p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => router.push(`/admin/risks/${params.id}/edit`)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            Edit
          </button>
          <button
            onClick={() => router.push("/admin/risks")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Back to Risks
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
