const express = require("express");
const dotenv = require("dotenv");
const connection = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();
const http = require("http"); // Add this
const socketIO = require("socket.io"); // Add this


const port = process.env.port || 7799;

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = socketIO(server, {  // Initialize Socket.IO
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }
});

const notificationController = require('./controllers/notificationController');
notificationController.setIo(io)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected at:', new Date().toISOString());  // Current time

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their notification room at ${new Date().toISOString()}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected at:', new Date().toISOString());
  });
});

const auth = require("./Routes/auth.route");
const user = require("./Routes/userdata.route");
const payment = require("./Routes/userPayement.route");
const notifications = require("./Routes/notification.route")

app.use("/api/auth", auth);
app.use("/auth", user);
app.use("/payment", payment);
app.use("/notifications", notifications)

app.get("/", (req, res) => {
  res.send("welcome to home page");
});

server.listen(port, async () => {
  try {
    await connection;
    console.log("connected to db");
  } catch (err) {
    console.error(err);
  }

  console.log(`server is running on port ${port}`);
});
// Export the io instance
module.exports = { io };
