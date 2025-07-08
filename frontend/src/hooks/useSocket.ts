import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export function useSocket({
  url = "http://localhost:3000",
  namespace = "", // e.g. '/chat'
  onMessage = (msgObject: { [key: string]: string }) => {},
  onConnect = (id?: string) => {},
  onDisconnect = (reason?: string) => {},
}) {
  const socketRef = useRef(null);

  useEffect(() => {
    const fullUrl = `${url}${namespace}`;
    const socket = io(fullUrl, {
      transports: ["websocket"],
      reconnection: true,
      query: {
        clientId: localStorage.getItem("clientId"),
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 Connected:", socket.id);
      onConnect(socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("⚠️ Disconnected:", reason);
      onDisconnect(reason);
    });

    socket.on("notification", (data) => {
      console.log("📩 privateMessage:", data);
      onMessage(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [url, namespace]);

  // Send message
  const send = (event, payload) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, payload);
    } else {
      console.warn("Socket not connected");
    }
  };

  return {
    socket: socketRef.current,
    send,
  };
}
