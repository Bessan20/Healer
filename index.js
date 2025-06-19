//*dotenv
require("dotenv").config({ path: ".env" }); //!must write the path

// Import Express and create an app instance
const express = require("express");
const app = express();

// Import HTTP to create a server for Socket.io
const http = require("http");
const server = http.createServer(app); // Use HTTP Server instead of app.listen directly
const { Server } = require("socket.io");
const io = new Server(server); // Create a Socket.io Server

// Import middleware libraries: morgan, helmet, cors, body-parser
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

// Import database connection
const dbConnection = require("./config/dbConnection.js");

// Import custom middlewares
const logging = require("./middlewares/logging.js");

// Import routes
const authRouter = require("./routes/authRouter.js");
const profileRouter = require("./routes/profileRoute.js");
const doctorRouter = require("./routes/doctorRouter.js");
const appointmentRouter = require("./routes/appointmentRouter.js");
const socialRouter = require("./routes/socialRouter.js");
const healthRouter = require("./routes/healthRouter.js");
const MedicineRouter = require("./routes/medicineRouter.js");

// Import global error handler
const globalError = require("./middlewares/globalError.js");

// Connect to the database
dbConnection();

// Socket.io Setup
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for 'register' event to get userId from the client
  socket.on("register", (userId) => {
    socket.join(userId); // Add the socket to a room named after the userId
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make io accessible in routes
app.set("socketio", io);

// Apply built-in middlewares
app.use(helmet());
app.use(cors());
app.use(express.static("./public"));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(logging);

//* endpoints
app.use("/api/v1", authRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/social", socialRouter);
app.use("/api/v1/healthInsurance", healthRouter);
app.use("/api/v1/medicine", MedicineRouter);

app.use(globalError);

// Start the server on the specified port
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Successfully listening to port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting down");
    process.exit(1);
  });
});

module.exports = app;
