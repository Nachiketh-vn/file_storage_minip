import { useState, useEffect, useRef, MutableRefObject } from "react";
import io, { ManagerOptions, SocketOptions, Socket } from "socket.io-client";

const STATUS = "status";
const RESPONSE_START = "res_start";
const RESPONES_END = "res_end";
const RESPONSE_UPDATE = "res";
const PROCESS_START = "process_start";
const PROCESS_END = "process_end";

type ChatMessages = {
  isQuestion: boolean;
  message: string;
};


export default function useSocket(
  url: string,
  options: Partial<ManagerOptions & SocketOptions> | undefined = {},
  updateChat: Function,
  ChatMessages:MutableRefObject<ChatMessages[]>,
) {
  const [currentresponse, setCurrentResponse] = useState<string>();
  const [message, setMessage] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [operationsCompleted, setOperationsCompleted] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const ref = useRef<string>('');

  useEffect(() => {
    socketRef.current = io(url, options);
    console.log("running use socket");

    // Set up event listeners
    socketRef.current.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected");
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    });

    socketRef.current.on("message", (data) => {
      console.log("Received Data", data);

      switch (data.type) {
        case PROCESS_START:
          setOperationsCompleted(false);
          break;
        case PROCESS_END:
          setOperationsCompleted(true);
          console.log("Process End", data);
          break;
        case RESPONSE_START:
          setOperationsCompleted(false);
          break;
        case RESPONSE_UPDATE:
          ref.current = ref.current + data.data;
          setCurrentResponse(ref.current);
          break;
        case RESPONES_END:
          setOperationsCompleted(true);
          setCurrentResponse("");
          ChatMessages.current?.push({ isQuestion: false, message: ref.current });
          ref.current = "";
          break;
        case STATUS:
          setMessage(data.data);
          break;
        default:
          break;
      }
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Connection Error:", error);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  return { message, isConnected,operationsCompleted ,currentresponse};
}
