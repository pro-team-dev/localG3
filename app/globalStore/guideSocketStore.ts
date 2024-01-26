import { create } from "zustand";

interface GuideUserSocketStore {
  data: string[]; // Add your desired type for the data property
  connectWebSocket: (userId: string) => void;
  disconnectWebSocket: () => void;
  sendWebSocket: (message: any) => void;
  location: { lat: number | null; lng: number | null };
}

const useGuideUserSocketStore = create<GuideUserSocketStore>((set) => {
  let socket: WebSocket | null = null;

  const initialState: GuideUserSocketStore = {
    data: [],
    connectWebSocket: (userId: string) => {
      const wsUrl = `ws://api.localg.biz/ws/guide-tour/${userId}`;

      socket = new WebSocket(wsUrl);

      // Set up event listeners for the WebSocket connection
      socket.addEventListener("open", () => {
        console.log("WebSocket connection opened");
      });

      socket.addEventListener("message", (event) => {
        console.log("WebSocket message received:", event.data);
        if (event.data) {
          let d = JSON.parse(event.data);
          if (d.type == "send_location") {
            let l = JSON.parse(d.location_data.current_location);
            set((state) => ({
              location: {
                lat: l.lat,
                lng: l.lng,
              },
            }));
          }
        }

        set((state) => ({
          data: [...state.data, event.data],
        }));
      });

      socket.addEventListener("close", () => {
        console.log("WebSocket connection closed");
      });
    },
    disconnectWebSocket: () => {
      if (socket) {
        socket.close();
      }
    },
    sendWebSocket: (message: any) => {
      if (socket) {
        socket.send(message);
      }
    },
    location: { lat: null, lng: null },
  };

  set(initialState);

  return initialState;
});

export default useGuideUserSocketStore;
