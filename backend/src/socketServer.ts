import { Server } from "socket.io";
import http from "http";

export function socketioServer(server: http.Server) {
  const port = parseInt(process.env.SOCKET_PORT || "9005");
  // TODO implement options to modify the socketio behaviour
  const io = new Server(server, {
    cors: { origin: "*" },
  });
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
  });
  io.on("disconnect", (socket) => {
    console.log(`Client disconnected: ${socket.id}`);
  });
  return io;
}
