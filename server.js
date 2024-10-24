const { createServer } = require("http");
const { Server } = require("socket.io");

// Set the hostname and port
const hostname = "localhost";
const port = process.env.PORT || 3000;

// Create an HTTP server
const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Socket.IO server running\n");
});

// Allow CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["https://mediscan.care", "http://localhost:3000"], // Frontend URL
    methods: ["GET", "POST"],
  },
});

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("room:join", ({ roomId, user }) => {
    socket.join(roomId);
    socket.to(roomId).emit("user:joined", user);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the server
server.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://${hostname}:${port}`);
});
