const express = require("express");
const dotenv = require("dotenv");
const connection = require("./config/db");
const cookieParser = require("cookie-parser")
const cors = require('cors')
dotenv.config();



const port = process.env.port || 7799;

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true 
}));

app.use(cookieParser());

app.use(express.json());

const auth = require("./Routes/auth.route");
const user = require('./Routes/userdata.route')

app.use("/api/auth", auth);
app.use("/auth", user);

app.get("/", (req, res) => {
  res.send("welcome to home page");
});

app.listen(port, async () => {
  try {
    await connection;
    console.log("connected to db");
  } catch (err) {
    console.error(err);
  }

  console.log(`server is running on port ${port}`);
});
