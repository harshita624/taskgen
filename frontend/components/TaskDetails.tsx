export default function TaskDetails() {
  return (
    <div className="w-full md:w-1/3 bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold">Task:</h2>
      <input className="w-full border rounded px-3 py-2 mt-2" placeholder="Title" />
      <textarea className="w-full border rounded px-3 py-2 mt-2" placeholder="Description" />

      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">List</label>
        <select className="w-full border px-2 py-1 rounded">
          <option>Personal</option>
          <option>Work</option>
        </select>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Due Date</label>
        <input type="date" className="w-full border px-2 py-1 rounded" />
      </div>

      <div className="mt-4">
        <h3 className="font-medium">Subtasks:</h3>
        <button className="text-blue-600 mt-1 text-sm">+ Add New Subtask</button>
      </div>

      <div className="flex justify-between mt-6">
        <button className="border px-4 py-2 rounded text-red-600">Delete Task</button>
        <button className="bg-yellow-400 px-4 py-2 rounded text-white">Save Changes</button>
      </div>
    </div>
  );
}
