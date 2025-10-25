"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";

export default function ViewResourcePage() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);

  useEffect(() => {
    async function fetchResource() {
      const res = await fetch(`/api/resources/${id}`);
      if (res.ok) {
        setResource(await res.json());
      }
    }
    fetchResource();
  }, [id]);

  if (!resource) return <p className="p-6">Loading...</p>;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">Resource Details</h1>
        <p><strong>Project:</strong> {resource.project?.name}</p>
        <p><strong>User:</strong> {resource.user?.name}</p>
        <p><strong>Allocation:</strong> {resource.allocationPercent}%</p>
      </div>
    </DashboardLayout>
  );
}
