// WebSocketService.js

class WebSocketService {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.socket.onopen = () => {
      console.log("WebSocket connection established.");
    };
    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    this.socket.onmessage = (event) => {
      console.log("Message from server:", event.data);
      // Handle incoming messages from the WebSocket server
      // Example: Update UI with new message
    };
  }

  send(message) {
    this.socket.send(message);
  }

  close() {
    this.socket.close();
  }
}

export default WebSocketService;
