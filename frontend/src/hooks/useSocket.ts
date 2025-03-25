import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BASE_IO_URL } from "../api/apiHelper";

export const useSocket = (): [
  boolean,
  string | undefined,
  () => Array<{ status: boolean; row: number; col: number }>
] => {
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<
    { status: boolean; row: number; col: number }[]
  >([]);

  const getMessages = useCallback((): Array<{
    status: boolean;
    row: number;
    col: number;
  }> => {
    let buffer: { status: boolean; row: number; col: number }[] = [];
    if (messages.length !== 0) {
      buffer = [...messages];
      setMessages((prev) => {
        return prev.slice(buffer.length);
      });
    }
    return buffer;
  }, [messages, setMessages]);

  useEffect(() => {
    const socket = io(BASE_IO_URL, { autoConnect: false });
    function onConnect() {
      setSocketId(socket.id);
      setIsConnected(true);
      console.log("Conectado");
    }

    function onDisconnect() {
      setSocketId(undefined);
      setIsConnected(false);
      console.log("Desconectado");
    }

    function onEvent(value: { status: boolean; row: number; col: number }) {
      setMessages((previous) => [...previous, value]);
    }

    socket.connect();
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("event", onEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("event", onEvent);
      socket.disconnect();
    };
  }, []);

  return [isConnected, socketId, getMessages];
};
