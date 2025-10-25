import DashboardLayout from "@/app/components/DashboardLayout";
import RequireRole from "@/app/components/RequireRole";

export default function TeamDashboard() {
  return (
    <RequireRole roles={["TEAM_MEMBER"]}>
      <DashboardLayout >
        <h1 className="text-2xl font-bold mb-6">Team Member Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 bg-white rounded shadow">📝 My Tasks: 8</div>
          <div className="p-6 bg-white rounded shadow">⏱ Hours Logged: 32</div>
          <div className="p-6 bg-white rounded shadow">📅 Upcoming Deadlines</div>
          <div className="p-6 bg-white rounded shadow">💬 Team Collaboration</div>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
