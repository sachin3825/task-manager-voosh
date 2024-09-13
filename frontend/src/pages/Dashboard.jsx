import React, { useState, useEffect } from 'react';
import Button from '../components/UI/Button';
import ModalComponent from '../components/Modal';
import TaskColumn from '../components/TaskColumn';
import { useSelector } from 'react-redux';
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetAllTasksQuery,
  useUpdateTaskMutation,
} from '../store/api/index';
import useApiErrorHandling from '../hooks/useApiErrorHandling';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const token = useSelector((state) => state.auth.token);
  const [tasks, setTasks] = useState([]);
  const { handleApiError } = useApiErrorHandling();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedTask, setSelectedTask] = useState(null);
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const { data: fetchedTasks, refetch } = useGetAllTasksQuery();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');

  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token, refetch]);

  useEffect(() => {
    if (fetchedTasks) {
      setTasks(fetchedTasks.tasks);
    } else {
      setTasks([]);
    }
  }, [fetchedTasks]);

  useEffect(() => {
    if (!token) {
      setTasks([]);
    }
  }, [token]);

  const openModal = (task = null, mode = 'create') => {
    setSelectedTask(task);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleSave = async (data) => {
    try {
      if (modalMode === 'edit' && selectedTask) {
        if (!selectedTask._id) {
          throw new Error('Task ID is missing');
        }
        await updateTask({ id: selectedTask._id, ...data }).unwrap();
        toast.success('Task updated successfully!');
      } else {
        await createTask(data).unwrap();
        toast.success('Task created successfully!');
      }
      refetch();
      closeModal();
    } catch (error) {
      console.error('Error in handleSave:', error);
      handleApiError(error);
      toast.error('Failed to create or update task.');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId).unwrap();
      refetch();
      toast.success('Task deleted successfully!');
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to delete task.');
    }
  };

  const handleDropTask = async (taskId, newStatus) => {
    const taskToUpdate = tasks.find((task) => task._id === taskId);
    if (taskToUpdate) {
      try {
        await updateTask({ id: taskId, status: newStatus }).unwrap();
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task._id === taskId ? { ...task, status: newStatus } : task))
        );
        toast.success('Task status updated successfully!');
      } catch (error) {
        handleApiError(error);
        toast.error('Failed to update task status.');
      }
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === 'title-asc') {
      return a.title.localeCompare(b.title);
    } else if (sortOption === 'title-desc') {
      return b.title.localeCompare(a.title);
    } else if (sortOption === 'created-asc') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortOption === 'created-desc') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  return (
    <section className="w-full p-5">
      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Search tasks by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="border p-2"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="default">Sort by</option>
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
          <option value="created-asc">Created Date (Oldest)</option>
          <option value="created-desc">Created Date (Newest)</option>
        </select>
      </div>

      <Button type={'button'} width={'max-content'} onClick={() => openModal(null, 'create')}>
        Add Task
      </Button>

      <ModalComponent
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onSave={handleSave}
        onCancel={closeModal}
        title={
          modalMode === 'view' ? 'View Task' : modalMode === 'edit' ? 'Edit Task' : 'Create Task'
        }
        initialValues={selectedTask || { title: '', description: '' }}
        mode={modalMode}
      />

      <main className="flex flex-col lg:flex-row justify-between px-2 py-5 w-full space-y-4 lg:space-y-0 lg:space-x-4">
        <TaskColumn
          title="To Do"
          tasks={sortedTasks}
          status="normal"
          handleDelete={handleDelete}
          onView={(task) => openModal(task, 'view')}
          onEdit={(task) => openModal(task, 'edit')}
          onDropTask={handleDropTask}
        />
        <TaskColumn
          title="In Progress"
          tasks={sortedTasks}
          status="in_process"
          handleDelete={handleDelete}
          onView={(task) => openModal(task, 'view')}
          onEdit={(task) => openModal(task, 'edit')}
          onDropTask={handleDropTask}
        />
        <TaskColumn
          title="Completed"
          tasks={sortedTasks}
          status="completed"
          handleDelete={handleDelete}
          onView={(task) => openModal(task, 'view')}
          onEdit={(task) => openModal(task, 'edit')}
          onDropTask={handleDropTask}
        />
      </main>
    </section>
  );
};

export default Dashboard;
