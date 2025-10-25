{/* Dependencies Section */}
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function TaskDependencies({ taskId, projectTasks }) {
  const [dependencies, setDependencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDep, setSelectedDep] = useState("");

  // Fetch current dependencies
  useEffect(() => {
    async function fetchDependencies() {
      const res = await fetch(`/api/tasks/${taskId}/dependencies`);
      if (res.ok) {
        const data = await res.json();
        setDependencies(data);
      }
      setLoading(false);
    }
    fetchDependencies();
  }, [taskId]);

  // Add dependency
  async function handleAdd() {
    if (!selectedDep) return;
    const res = await fetch(`/api/tasks/${taskId}/dependencies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dependsOn: selectedDep }),
    });
    if (res.ok) {
      const newDep = await res.json();
      setDependencies([...dependencies, newDep]);
      toast.success("Dependency added!");
    } else {
      const err = await res.json();
      toast.error(err.error || "Failed to add dependency");
    }
  }

  // Remove dependency
  async function handleRemove(depId) {
    const res = await fetch(`/api/tasks/${taskId}/dependencies`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: depId }),
    });
    if (res.ok) {
      setDependencies(dependencies.filter((d) => d.id !== depId));
      toast.success("Dependency removed!");
    } else {
      const err = await res.json();
      toast.error(err.error || "Failed to remove dependency");
    }
  }

  if (loading) return <p>Loading dependencies...</p>;

  return (
    <div className="p-4 bg-gray-50 rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-2">Task Dependencies</h2>

      {/* Existing Dependencies */}
      <ul className="mb-4">
        {dependencies.length === 0 && <li className="text-gray-500">No dependencies added.</li>}
        {dependencies.map((dep) => (
          <li key={dep.id} className="flex justify-between items-center mb-1">
            <span>{dep.depends.title}</span>
            <button
              onClick={() => handleRemove(dep.id)}
              className="text-red-500 px-2 py-1 text-sm bg-red-100 rounded hover:bg-red-200"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {/* Add New Dependency */}
      <div className="flex gap-2 items-center">
        <select
          value={selectedDep}
          onChange={(e) => setSelectedDep(e.target.value)}
          className="flex-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Select a task to depend on</option>
          {projectTasks
            .filter((t) => t.id !== taskId) // exclude current task
            .map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
        </select>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}
