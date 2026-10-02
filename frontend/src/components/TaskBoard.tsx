import { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus } from '../api/client';
import TaskItem from './TaskItem';

export default function TaskBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!projectId) return;
    getTasks(projectId).then((data) => {
      setTasks(data || []);
    });
  }, [projectId]);

  const handleToggle = (task) => {
    const next = task.status === 'DONE' ? 'TODO' : 'DONE';
    updateTaskStatus(task.id, next)
      .then((updated) => {
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? updated : t))
        );
      })
      .catch((err) => {
        console.error('Failed to update task status:', err);
      });
  };

  return (
    <div>
      <div className="board-header">
        <h2>Tasks</h2>
        <span className="task-count">{tasks.length}</span>
      </div>
      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet for this project.</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
