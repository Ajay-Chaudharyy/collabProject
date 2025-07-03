const mongoose = require('mongoose');

const taskScehma = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    status:{
        type:String,
        enum: ['todo', 'in-progress', 'done'],
        default: 'todo',
    },
    priority:{
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    dueDate:{
        type: Date,
        required: true,
    },
    boardId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
});

module.exports = mongoose.model('Task', taskScehma);