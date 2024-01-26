import { create } from "zustand";

interface Message {
  sender: string;
  content: string;
}

interface UserSocketStore {
  messages: Message[];
  connectWebSocket: (userId: string) => void;
  disconnectWebSocket: () => void;
  sendWebSocket: (message: string) => void;
}

const useUserSocketStore = create<UserSocketStore>((set) => {
  let socket: WebSocket | null = null;

  const connectWebSocket = (userId: string) => {
    const wsUrl = `ws://api.localg.biz/ws/tourist-tour/${userId}`;
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (event) => {
      const newMessage: Message = JSON.parse(event.data);
      set((state) => ({ messages: [...state.messages, newMessage] }));
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
  };

  const disconnectWebSocket = () => {
    socket?.close();
  };

  const sendWebSocket = (message: string) => {
    socket?.send(message);
  };

  return {
    messages: [],
    connectWebSocket,
    disconnectWebSocket,
    sendWebSocket,
  };
});

export default useUserSocketStore;