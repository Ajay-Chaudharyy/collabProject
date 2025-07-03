const Board = require('../Models/Board');

exports.CreateBoard = async (req, res) => {
    try{
        const { name } = req.body;
        if(!name || typeof name !== 'string') {
            return res.status(400).json({ message: "Invalid board name" });
        };
        if (!name) {
            return res.status(400).json({ message: "Board name is required" });
        };

        // Check if board with the same name already exists
        const existingBoard = await Board.findOne({ name });
        if(existingBoard) {
            return res.status(400).json({ message: "Board with this name already exists" });
        };


        //Create a new BoardName

        const newBoard = new Board({ name });
        await newBoard.save();

        res.status(201).json({ message: "Board created successfully", board: newBoard });
    } catch (error){
        res.status(500).json({ message: "Error creating board", error: error.message });
    }
}

exports.getAllBoards = async (req,res) => {
    try {
        const boards = await Board.find();
        res.status(200).json({success:true,
             message: "Boards fetched successfully", 
             data:boards });
    } catch (error) {
        res.status(500).json({ message: "Error fetching boards", error: error.message });
    }
}