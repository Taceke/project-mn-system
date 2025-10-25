"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequireRole({ roles = [], children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // wait for session
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (session && !roles.includes(session.user.role)) {
      router.push("/auth/login"); // or redirect to 403 page
    }
  }, [session, status, router, roles]);

  if (
    status === "loading" ||
    !session ||
    !roles.includes(session?.user?.role)
  ) {
    return <p className="p-6">Loading...</p>;
  }

  return <>{children}</>;
}
