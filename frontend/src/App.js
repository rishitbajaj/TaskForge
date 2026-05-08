import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:5000/api/tasks');
    setTasks(res.data);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    const res = await axios.post('http://localhost:5000/api/tasks', { title });
    setTasks([...tasks, res.data]);
    setTitle('');
  };

  const toggleComplete = async (id) => {
    const res = await axios.patch(`http://localhost:5000/api/tasks/${id}`);
    setTasks(tasks.map(t => t._id === id ? res.data : t));
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    setTasks(tasks.filter(t => t._id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div style={styles.body}>
      <div style={styles.glassContainer}>
        
        {/* Header Section */}
        <div style={styles.header}>
          <h1 style={styles.logo}>TASK<span style={styles.neonText}>FORGE</span></h1>
          <div style={styles.statsBar}>
            <div style={styles.statBox}>
              <span style={styles.statNum}>{tasks.length}</span>
              <span style={styles.statLabel}>Total</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNum}>{completedCount}</span>
              <span style={styles.statLabel}>Done</span>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <form onSubmit={addTask} style={styles.inputGroup}>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Summon a new task..." 
            style={styles.neonInput}
          />
          <button type="submit" style={styles.neonButton}>+</button>
        </form>

        {/* Task List */}
        <div style={styles.scrollArea}>
          {tasks.map(task => (
            <div key={task._id} style={{
              ...styles.taskCard, 
              borderLeft: task.completed ? '5px solid #00f2fe' : '5px solid #f953c6'
            }}>
              <div onClick={() => toggleComplete(task._id)} style={styles.taskContent}>
                <div style={{
                  ...styles.customCheck, 
                  background: task.completed ? 'linear-gradient(45deg, #00f2fe, #4facfe)' : 'transparent'
                }}>
                  {task.completed && '✓'}
                </div>
                <span style={{
                  ...styles.taskTitle, 
                  textDecoration: task.completed ? 'line-through' : 'none',
                  opacity: task.completed ? 0.5 : 1
                }}>
                  {task.title}
                </span>
              </div>
              <button onClick={() => deleteTask(task._id)} style={styles.iconBtn}>✕</button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

const styles = {
  body: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top left, #1a1a2e, #16213e)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Inter', 'Segoe UI', sans-serif", // Added Inter for better web rendering
    color: '#fff',
    padding: '20px'
  },
  glassContainer: {
    width: '100%',
    maxWidth: '480px', // Slightly wider for better text flow
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    borderRadius: '28px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '40px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '35px'
  },
  logo: {
    fontSize: '1.8rem', // Increased from 1.5
    fontWeight: '900',
    letterSpacing: '3px',
    margin: 0,
    textTransform: 'uppercase'
  },
  neonText: {
    color: '#4facfe',
    textShadow: '0 0 15px rgba(79, 172, 254, 0.8)'
  },
  statsBar: {
    display: 'flex',
    gap: '20px'
  },
  statBox: {
    textAlign: 'center'
  },
  statNum: {
    display: 'block',
    fontSize: '1.4rem', // Increased for better visibility
    fontWeight: '800',
    color: '#00f2fe'
  },
  statLabel: {
    fontSize: '0.7rem', // Slightly larger but kept secondary
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    opacity: 0.7
  },
  inputGroup: {
    display: 'flex',
    gap: '12px',
    marginBottom: '30px'
  },
  neonInput: {
    flex: 1,
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '14px',
    padding: '14px 20px',
    color: '#fff',
    outline: 'none',
    fontSize: '1.1rem', // Bigger input text
    transition: '0.3s border-color'
  },
  neonButton: {
    width: '55px',
    background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
    border: 'none',
    borderRadius: '14px',
    color: '#fff',
    fontSize: '1.8rem', // Larger '+' icon
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(79, 172, 254, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollArea: {
    maxHeight: '450px',
    overflowY: 'auto',
    paddingRight: '8px'
  },
  taskCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    marginBottom: '15px',
    padding: '18px 20px',
    borderRadius: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'transform 0.2s ease',
    cursor: 'default'
  },
  taskContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    cursor: 'pointer',
    flex: 1
  },
  customCheck: {
    width: '24px',
    height: '24px',
    borderRadius: '8px', // More squircle than circle
    border: '2px solid #4facfe',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '14px',
    transition: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },
  taskTitle: {
    fontSize: '1.15rem', // Optimal reading size
    fontWeight: '500',
    lineHeight: '1.4',
    letterSpacing: '0.3px'
  },
  iconBtn: {
    background: 'rgba(255, 75, 43, 0.1)',
    border: 'none',
    color: '#ff4b2b',
    fontSize: '1.2rem', // Larger delete icon
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '10px',
    marginLeft: '15px',
    transition: '0.2s'
  }
};

export default App;