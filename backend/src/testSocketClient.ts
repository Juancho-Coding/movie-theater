import { io } from "socket.io-client";

const socket = io("http://localhost:9001");

socket.on("connect", () => {
  console.log("Connected with ID:", socket.id);
  setTimeout(() => {
    socket.disconnect();
  }, 5000);
});

socket.on("disconnect", () => {
  console.log("Disconnected with ID:", socket.id);
});
