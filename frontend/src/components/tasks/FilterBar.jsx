import { Search } from 'lucide-react';

export default function FilterBar({ searchQuery, priorityFilter, onSearchChange, onPriorityChange }) {
  return (
    <div className="mb-5 flex flex-wrap gap-3 rounded-xl border border-forge-border bg-forge-surface p-4">
      <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-lg border border-gray-600 bg-forge-card px-3">
        <Search size={16} className="text-forge-muted" />
        <input
          type="text"
          placeholder="Filter tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-transparent py-2 text-sm text-white outline-none"
        />
      </div>

      <select
        value={priorityFilter}
        onChange={(e) => onPriorityChange(e.target.value)}
        className="rounded-lg border border-gray-600 bg-forge-card px-3 py-2 text-sm text-white"
      >
        <option value="ALL">All Priorities</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>
    </div>
  );
}
