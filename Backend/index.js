require("dotenv").config();
const express = require("express");
const app = express();

const cors = require('cors');


app.use(cors({
  origin: '*', 
  credentials: true, 
}));

app.use(express.json());
const routes = require("./Routes/Routes");
app.use("/api/v1", routes);


const connectDB = require("./Config/database");
connectDB();


const port = process.env.PORT || 5000;

app.listen(port,()=>console.log(`Server is running on port ${port}`));

app.get("/", (req, res) => {
    res.send("Hello World!");
});