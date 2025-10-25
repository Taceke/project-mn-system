"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg">
      {/* Logo / Title */}
      <h1 className="text-2xl font-extrabold text-white tracking-wide">
        Project Portal
      </h1>

      {/* Navigation Links */}
      <div className="space-x-4 flex">
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
        >
          Home
        </Link>
        <Link
          href="/auth/register"
          className="px-4 py-2 rounded-lg bg-brown-600 text-white hover:bg-gray-300 transition-all duration-200 shadow-md"
        >
          Register
        </Link>
        <Link
          href="/auth/login"
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 shadow-md"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
