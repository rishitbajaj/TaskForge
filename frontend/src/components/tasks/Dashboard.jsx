import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import {
  clearTaskError,
  createTask,
  deleteTask,
  fetchTasks,
  updateTaskStatus,
} from '../../store/taskSlice';
import ErrorBanner from '../common/ErrorBanner';
import LoadingScreen from '../common/LoadingScreen';
import Header from '../layout/Header';
import FilterBar from './FilterBar';
import KanbanColumn from './KanbanColumn';
import TaskForm from './TaskForm';

const COLUMNS = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items: tasks, loading, error } = useSelector((state) => state.tasks);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [isDraggingOver, setIsDraggingOver] = useState({});

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch(
      createTask({
        title: title.trim(),
        description: description.trim(),
        status: 'TODO',
        priority,
      })
    );

    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e, columnStatus) => {
    e.preventDefault();
    setIsDraggingOver((prev) => ({ ...prev, [columnStatus]: true }));
  };

  const handleDragLeave = (columnStatus) => {
    setIsDraggingOver((prev) => ({ ...prev, [columnStatus]: false }));
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setIsDraggingOver((prev) => ({ ...prev, [targetStatus]: false }));
    const taskId = e.dataTransfer.getData('text/plain');
    dispatch(updateTaskStatus({ id: taskId, status: targetStatus }));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const doneCount = tasks.filter((task) => task.status === 'DONE').length;
  const completionRate = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  if (loading && tasks.length === 0) {
    return <LoadingScreen message="Loading your tasks..." />;
  }

  return (
    <div className="min-h-screen bg-forge-bg px-6 py-8 text-gray-100 md:px-10">
      <Header user={user} completionRate={completionRate} onLogout={handleLogout} />

      <ErrorBanner message={error} onDismiss={() => dispatch(clearTaskError())} />

      <FilterBar
        searchQuery={searchQuery}
        priorityFilter={priorityFilter}
        onSearchChange={setSearchQuery}
        onPriorityChange={setPriorityFilter}
      />

      <TaskForm
        title={title}
        description={description}
        priority={priority}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onPriorityChange={setPriority}
        onSubmit={handleCreateTask}
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={filteredTasks.filter((task) => task.status === status)}
            isDraggingOver={isDraggingOver[status]}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onDelete={(id) => dispatch(deleteTask(id))}
          />
        ))}
      </div>
    </div>
  );
}
