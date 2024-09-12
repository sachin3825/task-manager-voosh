import React from 'react';
import TaskCard from './UI/TaskCard';

const TaskColumn = ({ title, tasks, status, handleDelete, onView, onEdit, onDropTask }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drop-hover');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drop-hover');
  };

  const handleDrop = (e) => {
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onDropTask(taskId, status);
    }
    e.currentTarget.classList.remove('drop-hover');
  };

  return (
    <div
      className="task-column border  p-1 w-full lg:w-[33%] transition-all duration-200 ease-in-out"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2 className="text-lg font-bold mb-4 flex items-center bg-blue-500 p-2 text-white">
        {title}
      </h2>
      <div>
        {tasks
          .filter((task) => task.status === status)
          .map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              handleDelete={handleDelete}
              onView={onView}
              onEdit={onEdit}
            />
          ))}
      </div>
    </div>
  );
};

export default TaskColumn;
