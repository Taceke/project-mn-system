"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading) return <p className="p-6">Loading...</p>;
  if (!session || !session.user?.role)
    return <p className="p-6">Access denied. Please log in.</p>;

  const role = session.user.role;

  // Role-based nav links
  const navLinks = {
    ADMIN: [
      { href: "/admin/dashboard", label: "Overview" },

      { href: "/admin/users", label: "User Management" },
      { href: "/admin/projects", label: "Projects" },
      { href: "/admin/resources", label: "Resources" },
      { href: "/admin/attachments", label: "Attachments" },

      { href: "/admin/milestones", label: "milestones" },
      { href: "/admin/tasks", label: "Tasks" },
      { href: "/admin/risks", label: "risks" },
      { href: "/admin/teams", label: "Teams" },
      { href: "/admin/team-members", label: "Team-Members" },
      { href: "/admin/comments", label: "Comments" },

      // { href: "/admin/timesheets", label: "Timesheets" },

      { href: "/admin/settings", label: "Settings" },
    ],
    PROJECT_MANAGER: [
      { href: "/manager/dashboard", label: "Dashboard" },
      // { href: "/manager/projects", label: "Projects" },
      { href: "/manager/tasks", label: "Tasks" },
      { href: "/manager/teams", label: "Teams" },
    ],
    TEAM_MEMBER: [
      { href: "/team/dashboard", label: "My Dashboard" },
      { href: "/team/tasks", label: "My Tasks" },
      { href: "/team/timesheet", label: "Timesheet" },
    ],
    // CLIENT: [
    //   { href: "/client-portal", label: "Portal Home" },
    //   { href: "/client-portal/projects", label: "My Projects" },
    //   { href: "/client-portal/reports", label: "Reports" },
    // ],
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          {role} Panel
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navLinks[role]?.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block p-2 rounded hover:bg-gray-800"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded block text-center"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
