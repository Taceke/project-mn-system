"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      const role = session.user.role;
      router.push(`/${role.toLowerCase()}/dashboard`);
    }
  }, [status, session, router]);

  // ✅ Handle Login
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      // Pass rememberMe value to backend through callback if you want
    });

    if (res?.error) {
      setError("Invalid credentials");
      setLoading(false);
      return;
    }

    router.refresh();
  }

  // ✅ Allow user to sign out if already logged in
  async function handleSignOut() {
    await signOut({ callbackUrl: "/auth/login" });
  }

  if (status === "loading") return <p className="p-6">Loading...</p>;

  // If user is already logged in, offer sign out
  if (status === "authenticated") {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <h1 className="text-2xl font-bold mb-4">
          You are already logged in as{" "}
          <span className="text-indigo-600">{session?.user?.email}</span>
        </h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white shadow-md rounded-xl p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border p-2 w-full rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2 w-full rounded"
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Remember Me</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-500 text-white w-full py-2 rounded hover:bg-indigo-600 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}

      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <Link href="/auth/register" className="text-blue-600 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
