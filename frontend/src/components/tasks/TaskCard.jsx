import { AlignLeft, Move, Trash2 } from 'lucide-react';

const priorityStyles = {
  HIGH: 'text-red-400',
  MEDIUM: 'text-amber-400',
  LOW: 'text-emerald-400',
};

export default function TaskCard({ task, onDelete, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
      className="cursor-grab rounded-xl border border-gray-700 bg-forge-card p-4 active:cursor-grabbing"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
          <Move size={10} /> #{task._id.slice(-4)}
        </span>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-semibold ${priorityStyles[task.priority]}`}>
            {task.priority}
          </span>
          <button
            type="button"
            onClick={() => onDelete(task._id)}
            className="text-gray-500 hover:text-red-400"
            aria-label="Delete task"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <h4 className="mb-1 text-sm font-semibold text-gray-100">{task.title}</h4>
      <p className="flex items-start gap-1 text-xs text-gray-400">
        <AlignLeft size={12} className="mt-0.5" />
        {task.description || 'No description provided.'}
      </p>
    </div>
  );
}
