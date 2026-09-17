import { Plus } from 'lucide-react';

export default function TaskForm({
  title,
  description,
  priority,
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-10 grid items-end gap-4 rounded-xl border border-forge-border bg-forge-surface p-6 md:grid-cols-4"
    >
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-400">TASK TITLE</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Task title..."
          className="w-full rounded-lg border border-gray-600 bg-forge-card px-3 py-2 text-white outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-400">DESCRIPTION</label>
        <input
          type="text"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Description..."
          className="w-full rounded-lg border border-gray-600 bg-forge-card px-3 py-2 text-white outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-400">PRIORITY</label>
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="w-full rounded-lg border border-gray-600 bg-forge-card px-3 py-2 text-white"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
      >
        <Plus size={16} />
        Deploy Task
      </button>
    </form>
  );
}
