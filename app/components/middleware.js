import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    // Skip middleware for auth pages
    if (pathname.startsWith("/auth")) {
      return NextResponse.next();
    }

    // Redirect based on role if they hit the wrong dashboard
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(
        new URL(`/${roleToDashboard(role)}`, req.url)
      );
    }
    if (pathname.startsWith("/manager") && role !== "PROJECT_MANAGER") {
      return NextResponse.redirect(
        new URL(`/${roleToDashboard(role)}`, req.url)
      );
    }
    if (pathname.startsWith("/team") && role !== "TEAM_MEMBER") {
      return NextResponse.redirect(
        new URL(`/${roleToDashboard(role)}`, req.url)
      );
    }
    if (pathname.startsWith("/client-portal") && role !== "CLIENT") {
      return NextResponse.redirect(
        new URL(`/${roleToDashboard(role)}`, req.url)
      );
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

function roleToDashboard(role) {
  switch (role) {
    case "ADMIN":
      return "admin/dashboard";
    case "PROJECT_MANAGER":
      return "manager/dashboard";
    case "TEAM_MEMBER":
      return "team/dashboard";
    case "CLIENT":
      return "client-portal";
    default:
      return "auth/login";
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/manager/:path*",
    "/team/:path*",
    "/client-portal/:path*",
    // ⛔ exclude auth and API routes
    "/((?!auth|api).*)",
  ],
};
