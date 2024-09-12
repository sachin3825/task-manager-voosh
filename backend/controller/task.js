import Task from '../models/task.js';

export const createTask = async (req, res) => {
  const { title, description, dueDate, status = 'normal' } = req.body;

  try {
    const task = new Task({
      title,
      description,
      status,
      dueDate,
      user: req.user._id,
    });

    await task.save();
    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to create task',
      error: error.message,
    });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.status(200).json({
      message: 'Tasks fetched successfully',
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch tasks',
      error: error.message,
    });
  }
};

export const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task || task.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        message: 'Task not found or unauthorized access',
      });
    }

    res.status(200).json({
      message: 'Task fetched successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch task',
      error: error.message,
    });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task || task.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        message: 'Task not found or unauthorized access',
      });
    }

    Object.keys(req.body).forEach((key) => {
      task[key] = req.body[key];
    });

    await task.save();

    res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to update task',
      error: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await Task.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete task',
      error: error.message,
    });
  }
};
