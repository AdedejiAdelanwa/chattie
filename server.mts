import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer);
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinRoom", ({ room, username }) => {
      socket.join(room);
      console.log(`User ${username} joined room ${room}`);

      socket.to(room).emit("joinRoom", `${username} joined room`);
    });

    socket.on("userTyping", ({ sender, room }) => {
      socket.to(room).emit("typing", `${sender} is typing...`);
    });

    socket.on("userStoppedTyping", ({ room }) => {
      socket.to(room).emit("userStoppedTyping");
    });

    socket.on("message", ({ room, message, sender }) => {
      socket.to(room).emit("message", { sender, message });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
