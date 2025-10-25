import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/login");

  // Role-based redirect
  if (session.user.role === "CLIENT") redirect("/client-portal");
  if (session.user.role === "ADMIN") redirect("/admin/dashboard");
  if (session.user.role === "PROJECT_MANAGER") redirect("/manager/dashboard");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Welcome, {session.user.name || session.user.email}
      </h1>
      <p className="mt-2">Role: {session.user.role}</p>
    </div>
  );
}
