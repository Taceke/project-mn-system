"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Paperclip,
  Flag,
  CheckSquare,
  ShieldAlert,
  Users2,
  UserPlus,
  MessageSquare,
  Settings,
} from "lucide-react";

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
      { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/users", label: "User Management", icon: Users },
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/resources", label: "Resources", icon: FileText },
      { href: "/admin/attachments", label: "Attachments", icon: Paperclip },
      { href: "/admin/milestones", label: "Milestones", icon: Flag },
      { href: "/admin/tasks", label: "Tasks", icon: CheckSquare },
      { href: "/admin/risks", label: "Risks", icon: ShieldAlert },
      { href: "/admin/teams", label: "Teams", icon: Users2 },
      { href: "/admin/team-members", label: "Team Members", icon: UserPlus },
      { href: "/admin/comments", label: "Comments", icon: MessageSquare },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],

    PROJECT_MANAGER: [
      { href: "/manager/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/manager/tasks", label: "Tasks", icon: CheckSquare },
      { href: "/manager/teams", label: "Teams", icon: Users2 },
    ],

    TEAM_MEMBER: [
      { href: "/team/dashboard", label: "My Dashboard", icon: LayoutDashboard },
      { href: "/team/tasks", label: "My Tasks", icon: CheckSquare },
      { href: "/team/timesheet", label: "Timesheet", icon: FileText },
    ],
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
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition"
                >
                  <link.icon size={18} />
                  <span>{link.label}</span>
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
