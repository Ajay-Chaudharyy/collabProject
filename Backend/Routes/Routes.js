const express = require("express");
const router = express.Router();


const {getTasksByBoard,createTask,updateTask,deleteTask} = require('../Controller/Tasks');
const {CreateBoard,getAllBoards} = require('../Controller/BoardController');


router.get("/boards", getAllBoards);
router.post("/boards", CreateBoard);

router.get("/boards/:id/tasks", getTasksByBoard);
router.post("/boards/:id/tasks", createTask);
router.put("/tasks/:taskId", updateTask);
router.delete("/tasks/:taskId", deleteTask);



module.exports = router;