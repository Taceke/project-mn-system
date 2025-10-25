"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-10 text-center max-w-lg w-full"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Project Portal 🚀
        </motion.h1>

        <p className="text-gray-700 text-lg mb-10">
          Streamline your workflow. Manage projects, tasks, and users with
          secure authentication and elegant simplicity.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/auth/register"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition transform duration-200"
          >
            Create Account
          </Link>

          <Link
            href="/auth/login"
            className="px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 font-semibold hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition transform duration-200"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
