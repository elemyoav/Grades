require("dotenv").config();

const express = require("express");
const app = express();

const connectDB = require("./db/connect");

const gradesRouter = require("./routes/gradeRouter");
const userRouter = require("./routes/userRouter");

const cors = require("cors");
app.use(cors());

app.use(express.json());

app.use("/grades", gradesRouter);
app.use("/users", userRouter);

const PORT = process.env.PORT || 3001;

const start = async () => {
    try {
      await connectDB(process.env.MONGODB_CONNECTION_URL);
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error(error);
    }
  };
  
start();