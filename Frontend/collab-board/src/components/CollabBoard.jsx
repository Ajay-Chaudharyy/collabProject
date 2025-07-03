import { useState,useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import "../classes/CollabBoard.css";

const CollabBoard = () => {

    const [boardData,setBoardData]= useState([]);
    useEffect(()=>{
        const fetchData = async () => {
            try{
                const response = await fetch('https://collabproject-t1vo.onrender.com/api/v1/boards');
                if(response.status === 200) {
                    const data = await response.json();
                    setBoardData(data?.data);
                    console.log("Board data fetched successfully:", data);
                }
            }catch(err)
            {
                console.error("Error fetching board data:", err);
            }
        }
        fetchData();
    },[])
  const boards = [
    "Frontend tasks",
    "Marketing Plan",
    "Meeting Notes",
    "Sprint Backlog",
    "Design Review",
    "Client Feedback",
    "Bug Tracking",
    "Product Roadmap",
    "Release Checklist",
    "Team Retrospective",
  ];

  const initialTasks = [
    { task: "UI updates", priority: "Low", done: true, assignedTo: "Alice" },
    { task: "Accessibility improvements", priority: "Mid", done: false, assignedTo: "Bob" },
    { task: "Bug fixes", priority: "High", done: false, assignedTo: "Charlie" },
    { task: "Code review", priority: "High", done: false, assignedTo: "" },
  ];

  const [selectedBoardIndex, setSelectedBoardIndex] = useState(0);
  const [tasks, setTasks] = useState(initialTasks);

  const handlePriorityChange = (index, newPriority) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].priority = newPriority;
    setTasks(updatedTasks);
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].done = newStatus === "Done";
    setTasks(updatedTasks);
  };

  const handleAssignToChange = (index, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].assignedTo = value;
    setTasks(updatedTasks);
  };

  return (
    <div className="collab-board">
      <div className="collab-board-header">
        <p className="headingText">Dummy Project</p>
      </div>

      <div className="collab-board-mainContent">
        {/* Sidebar */}
        <div className="leftPartMainContent">
          <div className="Boards">
            <p className="boards-title">Boards</p>
          </div>
          <div className="Boards-body">
            {boards.map((board, index) => (
              <div
                key={index}
                className={`Board ${selectedBoardIndex === index ? "selected" : ""}`}
                onClick={() => setSelectedBoardIndex(index)}
              >
                <input
                  type="checkbox"
                  checked={selectedBoardIndex === index}
                  readOnly
                />
                <p>{board}</p>
              </div>
            ))}
          </div>
          <div className="addBoard">
            <FaPlus className="addBoardIcon" />
            <p>Add Board</p>
          </div>
        </div>

        {/* Task View */}
        <div className="RightPartMainContent">
          <h2 className="board-title">{boards[selectedBoardIndex]}</h2>
          <table className="task-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assign To</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, idx) => (
                <tr key={idx}>
                  <td>{task.task}</td>
                  <td>
                    <select
                      value={task.priority}
                      onChange={(e) => handlePriorityChange(idx, e.target.value)}
                    >
                      <option value="Low">Low</option>
                      <option value="Mid">Mid</option>
                      <option value="High">High</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={task.done ? "Done" : "Pending"}
                      onChange={(e) => handleStatusChange(idx, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Done">Done</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="assign-input"
                      value={task.assignedTo}
                      onChange={(e) => handleAssignToChange(idx, e.target.value)}
                      placeholder="Type name"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CollabBoard;
