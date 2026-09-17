import { BarChart4, LogOut } from 'lucide-react';

export default function Header({ user, completionRate, onLogout }) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-forge-border pb-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">TaskForge Architecture Panel</h1>
        <p className="mt-1 text-sm text-forge-muted">
          Signed in as {user?.name || user?.email}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 rounded-xl border border-forge-border bg-forge-surface px-4 py-3">
          <BarChart4 size={20} className="text-blue-500" />
          <div>
            <div className="text-[10px] font-bold text-forge-muted">COMPLETION RATE</div>
            <div className="text-lg font-extrabold text-blue-500">{completionRate}%</div>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-lg border border-forge-border bg-forge-card px-4 py-2 text-sm font-semibold text-gray-200 hover:border-red-500 hover:text-red-300"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
