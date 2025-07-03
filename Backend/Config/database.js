const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://ajaychaudharyy4308:TFwiMmgrFFR2zmRm@cluster0.nlblak6.mongodb.net/collabDB?retryWrites=true&w=majority");
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
    }
};

module.exports = connectDB;