import DashboardLayout from "@/app/components/DashboardLayout";
import RequireRole from "@/app/components/RequireRole";

export default function AdminDashboard() {
  return (
    <RequireRole roles={["ADMIN"]}>

    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Manage users, projects, and system settings here.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="p-4 border rounded shadow">📊 Project Overview</div>
        <div className="p-4 border rounded shadow">👥 User Management</div>
        <div className="p-4 border rounded shadow">⚙️ System Settings</div>
      </div>
    </DashboardLayout>
    </RequireRole>

  );
}
