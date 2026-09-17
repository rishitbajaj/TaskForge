import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. FETCH TASKS (GET REQUEST WITH AUTHORIZATION)
  const fetchTasks = async () => {
    const token = localStorage.getItem('token'); 
    try {
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: {
          Authorization: `Bearer ${token}` // Passes token so backend doesn't throw a 500
        }
      });
      
      // Update this line if your backend returns data inside a nested object (e.g., response.data.tasks)
      setTasks(response.data); 
      setLoading(false);
    } catch (error) {
      console.error("Failed to load workspace tasks:", error);
      setLoading(false);
    }
  };

  // Run the fetch operation right when the component loads on the screen
  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. ADD TASK (POST REQUEST WITH AUTHORIZATION)
  const handleAddTask = async (e) => {
    if (e) e.preventDefault(); // Prevents page from standard HTML form submit refresh
    if (!taskTitle.trim()) return;

    const token = localStorage.getItem('token'); 

    try {
      const response = await axios.post('http://localhost:5000/api/tasks', 
        { 
          title: taskTitle, 
          status: "TODO", 
          priority: "MEDIUM" 
        },
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }
      );

      if (response.status === 201 || response.status === 200) {
        setTaskTitle('');
        fetchTasks(); // Refresh list dynamically without needing window.location.reload()!
      }
    } catch (error) {
      console.error("Task creation failed:", error);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading workspace tasks...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>TaskForge Workspace</h2>
      
      {/* Form to add a task */}
      <form onSubmit={handleAddTask} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Enter a new task..." 
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          style={{ padding: '8px', width: '250px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '8px 12px', cursor: 'pointer' }}> Add Task </button>
      </form>

      {/* Manual bypass button in case things fall out of sync */}
      <button 
        onClick={() => { localStorage.clear(); window.location.reload(); }} 
        style={{ marginBottom: '20px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
      >
        Reset Auth Token & Reload Workspace
      </button>

      {/* Task Grid Rendering */}
      <h3>Your Tasks ({tasks.length})</h3>
      {tasks.length === 0 ? (
        <p>No tasks found. Create one above!</p>
      ) : (
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {tasks.map((task) => (
            <li key={task._id || task.id} style={{ padding: '10px', border: '1px solid #ccc', marginBottom: '8px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', maxWidth: '400px' }}>
              <span><strong>{task.title}</strong></span>
              <span style={{ fontSize: '12px', backgroundColor: '#eee', padding: '2px 6px', borderRadius: '4px' }}>{task.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskBoard;