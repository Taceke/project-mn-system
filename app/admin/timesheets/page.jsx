"use client";

import { useEffect, useState } from "react";

export default function TaskTimesheets({ taskId }) {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    userId: "",
    minutes: "",
    description: "",
    isBillable: true,
    date: "",
  });
  const [users, setUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // ✅ ensure taskId is valid before fetching
  useEffect(() => {
    if (!taskId) return;
    async function fetchData() {
      try {
        const [tsRes, usersRes] = await Promise.all([
          fetch(`/api/timesheets?taskId=${taskId}`),
          fetch("/api/admin/users"),
        ]);

        if (tsRes.ok) setTimesheets(await tsRes.json());
        if (usersRes.ok) setUsers(await usersRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [taskId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!taskId) {
      alert("Missing taskId – TaskTimesheets did not receive props.");
      return;
    }

    const minutesNum = parseInt(form.minutes, 10);
    if (!form.userId || !form.date || isNaN(minutesNum) || minutesNum <= 0) {
      alert("Please fill out all required fields correctly.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/timesheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          userId: form.userId,
          minutes: minutesNum,
          description: form.description || null,
          isBillable: form.isBillable,
          date: new Date(form.date).toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create timesheet");

      setTimesheets([data, ...timesheets]);
      setForm({
        userId: "",
        minutes: "",
        description: "",
        isBillable: true,
        date: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this timesheet?")) return;
    try {
      const res = await fetch(`/api/timesheets/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete timesheet");
      setTimesheets(timesheets.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  if (loading) return <p>Loading timesheets...</p>;

  return (
    <div>
      {/* Timesheet Form */}
      <form className="mb-6 p-4 border rounded" onSubmit={handleSubmit}>
        <h2 className="font-bold mb-2">Log Time</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <select
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value })}
            required
            className="border p-2 rounded"
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            placeholder="Minutes"
            value={form.minutes}
            onChange={(e) => setForm({ ...form, minutes: e.target.value })}
            required
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
            className="border p-2 rounded"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isBillable}
              onChange={(e) =>
                setForm({ ...form, isBillable: e.target.checked })
              }
            />
            Billable
          </label>
        </div>

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded w-full mt-2"
        />

        <button
          type="submit"
          disabled={submitting}
          className={`px-4 py-2 mt-2 rounded text-white ${
            submitting ? "bg-gray-400" : "bg-green-600"
          }`}
        >
          {submitting ? "Adding..." : "Add Timesheet"}
        </button>
      </form>

      {/* Timesheets Table */}
      {timesheets.length === 0 ? (
        <p>No timesheets logged yet.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">User</th>
              <th className="border p-2">Minutes</th>
              <th className="border p-2">Billable</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {timesheets.map((t) => (
              <tr key={t.id}>
                <td className="border p-2">{t.user?.name}</td>
                <td className="border p-2">{t.minutes}</td>
                <td className="border p-2">{t.isBillable ? "Yes" : "No"}</td>
                <td className="border p-2">{t.description}</td>
                <td className="border p-2">
                  {new Date(t.date).toLocaleDateString()}
                </td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
