import { AlertTriangle, CheckCircle2, Circle, HelpCircle } from 'lucide-react';
import TaskCard from './TaskCard';

const columnConfig = {
  TODO: { accent: 'border-blue-500', icon: <Circle size={16} className="text-blue-500" /> },
  IN_PROGRESS: { accent: 'border-amber-500', icon: <AlertTriangle size={16} className="text-amber-500" /> },
  REVIEW: { accent: 'border-purple-500', icon: <HelpCircle size={16} className="text-purple-500" /> },
  DONE: { accent: 'border-emerald-500', icon: <CheckCircle2 size={16} className="text-emerald-500" /> },
};

export default function KanbanColumn({
  status,
  tasks,
  isDraggingOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
  onDelete,
}) {
  const config = columnConfig[status];

  return (
    <div
      onDragOver={(e) => onDragOver(e, status)}
      onDragLeave={() => onDragLeave(status)}
      onDrop={(e) => onDrop(e, status)}
      className={`min-h-[500px] rounded-2xl border bg-forge-surface p-5 ${
        isDraggingOver ? config.accent : 'border-forge-border'
      }`}
    >
      <div className="mb-5 flex items-center justify-between border-b border-forge-border pb-3">
        <div className="flex items-center gap-2">
          {config.icon}
          <h3 className="text-sm font-bold text-white">{status.replace('_', ' ')}</h3>
        </div>
        <span className="rounded-full bg-forge-card px-2 py-0.5 text-[11px] text-gray-400">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onDelete={onDelete} onDragStart={onDragStart} />
        ))}
      </div>
    </div>
  );
}
