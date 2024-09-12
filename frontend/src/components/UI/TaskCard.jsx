import React from 'react';

const TaskCard = ({ task, handleDelete, onView, onEdit }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

    const formattedDate = date.toLocaleDateString('en-GB', options);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
    return `${formattedDate} ${formattedTime}`;
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task._id);
    e.target.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
  };

  return (
    <div
      key={task.id}
      className="w-full task-card border border-blue-300 p-4 mb-2 rounded-lg shadow-sm bg-blue-300 transition-transform duration-200 ease-in-out"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <h3 className="font-semibold text-lg">{task.title}</h3>
      <p className="text-gray-700 truncate max-h-16 overflow-hidden">{task.description}</p>
      <p>{formatDate(task.createdAt)}</p>
      <div className="mt-2 flex items-end justify-end gap-2">
        <button onClick={() => onView(task)} className="bg-yellow-500 px-2 rounded-md font-bold">
          View
        </button>
        <button onClick={() => onEdit(task)} className="bg-green-500 px-2 rounded-md font-bold">
          Edit
        </button>
        <button
          onClick={() => handleDelete(task._id)}
          className="bg-red-500 px-2 rounded-md font-bold"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
