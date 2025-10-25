import DashboardLayout from "@/app/components/DashboardLayout";
import RequireRole from "@/app/components/RequireRole";

export default function ClientPortal() {
  return (
    <RequireRole roles={["CLIENT"]}>
      <DashboardLayout >
        <h1 className="text-2xl font-bold mb-6">Client Portal</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 bg-white rounded shadow">📊 Project Status</div>
          <div className="p-6 bg-white rounded shadow">📅 Milestones</div>
          <div className="p-6 bg-white rounded shadow">📄 Reports</div>
          <div className="p-6 bg-white rounded shadow">💬 Communication</div>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
