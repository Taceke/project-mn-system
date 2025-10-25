import DashboardLayout from "@/app/components/DashboardLayout";
import RequireRole from "@/app/components/RequireRole";

export default function ManagerDashboard() {
  return (
    <RequireRole roles={["PROJECT_MANAGER"]}>
      <DashboardLayout>
        <h1 className="text-2xl font-bold mb-6">Project Manager Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 bg-white rounded shadow">
            📅 Active Projects: 5
          </div>
          <div className="p-6 bg-white rounded shadow">
            ✅ Tasks Assigned: 23
          </div>
          <div className="p-6 bg-white rounded shadow">
            📈 Performance Reports
          </div>
          <div className="p-6 bg-white rounded shadow">⚠️ Risks & Issues</div>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
