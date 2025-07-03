import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaTimes, FaTrash, FaPen, FaCheck } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../classes/CollabBoard.css";

const CollabBoard = () => {
  const [boardData, setBoardData] = useState([]);
  const [selectedBoardIndex, setSelectedBoardIndex] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({});
  const [showBoardInput, setShowBoardInput] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "todo",
    dueDate: "",
    priority: "low",
  });

  const fetchBoards = async () => {
    try {
      const res = await fetch("https://collabproject-t1vo.onrender.com/api/v1/boards");
      const data = await res.json();
      setBoardData(data?.data || []);
      if (data.data.length > 0 && selectedBoardIndex === null) {
        setSelectedBoardIndex(0);
      }
    } catch (err) {
      console.error("Error fetching boards:", err);
    }
  };

  const fetchTasks = async (boardId) => {
    try {
      const res = await fetch(`https://collabproject-t1vo.onrender.com/api/v1/boards/${boardId}/tasks`);
      const data = await res.json();
      setTasks(data?.data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://collabproject-t1vo.onrender.com/api/v1/users");
      const data = await res.json();
      setUsers(data?.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchBoards();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedBoardIndex !== null && boardData[selectedBoardIndex]) {
      fetchTasks(boardData[selectedBoardIndex]._id);
    }
  }, [selectedBoardIndex, boardData]);

  const handleAddBoard = async () => {
    if (!newBoardName.trim()) return;
    try {
      const res = await fetch("https://collabproject-t1vo.onrender.com/api/v1/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newBoardName }),
      });
      if (res.ok) {
        setNewBoardName("");
        setShowBoardInput(false);
        fetchBoards();
        toast.success("Board created successfully!");
      }
    } catch (err) {
      console.error("Error creating board:", err);
    }
  };

  const handleCreateTask = async () => {
    const boardId = boardData[selectedBoardIndex]?._id;
    if (!boardId) return toast.error("No board selected");

    const payload = {
      ...newTask,
      boardId,
    };

    try {
      setIsLoading(true);
      const res = await fetch(
        `https://collabproject-t1vo.onrender.com/api/v1/boards/${boardId}/tasks`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (res.ok) {
        toast.success("Task created!");
        setNewTask({
          title: "",
          description: "",
          assignedTo: "",
          status: "todo",
          dueDate: "",
          priority: "low",
        });
        setShowTaskForm(false);
        fetchTasks(boardId);
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to create task");
      }
    } catch (err) {
      console.error("Error creating task:", err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`https://collabproject-t1vo.onrender.com/api/v1/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Task deleted");
        const boardId = boardData[selectedBoardIndex]?._id;
        fetchTasks(boardId);
      } else {
        toast.error("Failed to delete task");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Something went wrong");
    }
  };

  const handleEditTask = (task) => {
    setEditTaskId(task._id);
    setEditedTask({
      title: task.title,
      priority: task.priority,
      status: task.status,
      assignedTo: task.assignedTo?._id || "",
    });
  };

  const handleSaveEditTask = async (taskId) => {
    if (!editedTask.assignedTo) return toast.error("assignedTo is required");
    const res = await fetch(`https://collabproject-t1vo.onrender.com/api/v1/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedTask),
    });
    if (res.ok) {
      toast.success("Task updated");
      setEditTaskId(null);
      fetchTasks(boardData[selectedBoardIndex]._id);
    } else {
      const data = await res.json();
      toast.error(data.message || "Failed to update task");
    }
  };

  return (
    <div className="collab-board">
      {isLoading && <div className="loader-overlay">Loading...</div>}

      <div className="collab-board-header">
        <p className="headingText">Team Collaboration</p>
        <button className="header-create-task-btn" onClick={() => setShowTaskForm(true)}>
          <FaPlus className="plus-icon" /> Create Task
        </button>
      </div>

      <div className="collab-board-mainContent">
        <div className="leftPartMainContent">
          <div className="Boards">
            <p className="boards-title">Boards</p>
          </div>

          <div className="Boards-body">
            {boardData.length === 0 && <p className="empty-state">No boards yet</p>}
            {boardData.map((board, index) => (
              <div
                key={board._id}
                className={`Board ${selectedBoardIndex === index ? "selected" : ""}`}
                onClick={() => setSelectedBoardIndex(index)}
              >
                <input type="checkbox" checked={selectedBoardIndex === index} readOnly />
                <p>{board.name}</p>
              </div>
            ))}
          </div>

          {showBoardInput && (
            <div className="addBoardInputContainer">
              <input
                type="text"
                className="addBoardInput"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="New board name"
              />
              <button className="saveBoardBtn" onClick={handleAddBoard}>Save</button>
            </div>
          )}

          <div className="addBoard amazing-add-btn" onClick={() => setShowBoardInput(!showBoardInput)}>
            <FaPlus className="addBoardIcon" />
            <p>Add Board</p>
          </div>
        </div>

        <div className="RightPartMainContent">
          {selectedBoardIndex === null ? (
            <p className="no-board-message">Select or create a board</p>
          ) : (
            <>
              <h2 className="board-title">{boardData[selectedBoardIndex]?.name}</h2>
              <table className="task-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task._id}>
                      <td>
                        {editTaskId === task._id ? (
                          <input value={editedTask.title} onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })} />
                        ) : task.title}
                      </td>
                      <td>
                        {editTaskId === task._id ? (
                          <select value={editedTask.priority} onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        ) : task.priority}
                      </td>
                      <td>
                        {editTaskId === task._id ? (
                          <select value={editedTask.status} onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}>
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                          </select>
                        ) : task.status}
                      </td>
                      <td>
                        {editTaskId === task._id ? (
                          <input value={editedTask.assignedTo} onChange={(e) => setEditedTask({ ...editedTask, assignedTo: e.target.value })} />
                        ) : task.assignedTo?.name || "Unknown"}
                      </td>
                      <td>
                        {editTaskId === task._id ? (
                          <FaCheck className="action-icon" style={{ color: "green", cursor: "pointer" }} onClick={() => handleSaveEditTask(task._id)} />
                        ) : (
                          <FaPen className="action-icon" style={{ marginRight: "10px", cursor: "pointer" }} onClick={() => handleEditTask(task)} />
                        )}
                        <FaTrash className="delete-icon" onClick={() => handleDeleteTask(task._id)} style={{ cursor: "pointer", color: "red", marginLeft: "10px" }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {showTaskForm && (
                <div className="task-creation-form">
                  <div className="form-header">
                    <h3>Create New Task</h3>
                    <FaTimes className="close-icon top-right" onClick={() => setShowTaskForm(false)} />
                  </div>
                  <input
                    type="text"
                    placeholder="Title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                  <textarea
                    placeholder="Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Assigned To (User Name)"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  />
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <button className="submit-task-btn" onClick={handleCreateTask} style={{ marginTop: "1rem" }}>
                    Create Task
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover />
    </div>
  );
};

export default CollabBoard;
