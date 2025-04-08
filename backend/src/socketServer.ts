import { Server } from "socket.io";
import http from "http";

export let sioServer: Server | null = null;

export function socketioServer(server: http.Server) {
  const port = parseInt(process.env.SOCKET_PORT || "9005");
  // TODO implement options to modify the socketio behaviour
  const io = new Server(server, {
    path: "/api/socket",
    cors: { origin: "*" },
  });
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
  });
  io.on("disconnect", (socket) => {
    console.log(`Client disconnected: ${socket.id}`);
  });
  io.on("error", (err) => {
    console.error("Socket error:", err);
  });
  setIOServer(io);
}

function setIOServer(io: Server) {
  sioServer = io;
}
