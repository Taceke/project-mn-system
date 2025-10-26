"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [captchaToken, setCaptchaToken] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!captchaToken) {
      alert("Please complete the captcha.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value,
        role: e.target.role.value,
        captchaToken,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 1500);
    } else {
      setMessage(data.message || "Registration failed");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          className="border p-2 w-full"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          required
        />
        <select name="role" className="border p-2 w-full">
          <option value="PROJECT_MANAGER">Project Manager</option>
          <option value="TEAM_MEMBER">Team Member</option>
          {/* <option value="CLIENT">Client</option> */}
          <option value="ADMIN">Admin</option>
        </select>

        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
          onChange={(token) => setCaptchaToken(token)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 w-full"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
