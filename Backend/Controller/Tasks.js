const Tasks = require('../Models/Task');
const Board = require('../Models/Board');

// Get all tasks in a specific board
exports.getTasksByBoard = async (req, res) => {
  try {
    const boardId = req.params.id;

    const tasks = await Tasks.find({ boardId });

    res.status(200).json({
      success: true,
      message: 'Tasks fetched successfully',
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
};

// Create a new task in a board
exports.createTask = async (req, res) => {
  try {
    const boardId = req.params.id;
    const { title, description, assignedTo, status, dueDate, priority } = req.body;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const newTask = new Tasks({
      title,
      description,
      boardId,
      assignedTo: assignedTo || 'Unassigned',
      status: status || 'todo',
      dueDate: dueDate || null,
      priority: priority || 'medium',
    });

    await newTask.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const updates = req.body;

    const updatedTask = await Tasks.findByIdAndUpdate(taskId, updates, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const deletedTask = await Tasks.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
};
