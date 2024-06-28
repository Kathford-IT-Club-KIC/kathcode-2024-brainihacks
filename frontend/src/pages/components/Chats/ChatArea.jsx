import React, { useEffect, useState, useCallback } from "react";
import MessageInput from "./MessageInput";
import Message from "./Message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import withAuth from "@/utils/withAuth";

function ChatArea({ user, selectedRoom }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const connectWebSocket = useCallback(() => {
    if (!selectedRoom?.id || !selectedRoom?.room_type) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Token is missing");
      return;
    }

    console.log("Connecting with token:", token);

    const newSocket = new WebSocket(
      `ws://127.0.0.1:8000/${selectedRoom.room_type}/ws/chat/${selectedRoom.id}/?token=${token}`
    );

    newSocket.onopen = () => {
      console.log("WebSocket connection established");
      setReconnectAttempts(0);
    };

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    newSocket.onclose = (event) => {
      console.log("WebSocket connection closed", event.code, event.reason);
      if (reconnectAttempts < 5) {
        setTimeout(() => {
          setReconnectAttempts((prev) => prev + 1);
          connectWebSocket();
        }, Math.min(10000, (reconnectAttempts + 1) * 2000));
      }
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [selectedRoom, reconnectAttempts]);

  useEffect(() => {
    const cleanup = connectWebSocket();
    return () => {
      if (cleanup) cleanup();
    };
  }, [connectWebSocket]);

  const sendMessage = useCallback(
    (content) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const message = {
          message: content,
          receiver_id: selectedRoom.id, // Adjust based on your message format
        };
        socket.send(JSON.stringify(message));
      } else {
        console.error("WebSocket is not connected.");
      }
    },
    [socket, selectedRoom]
  );

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="chat-area flex flex-col justify-between w-[70vw] relative">
      <div className="chat-header flex py-2 items-center border-b border-black bg-white">
        <Avatar>
          <AvatarImage src={`http://127.0.0.1:8000${selectedRoom?.photo}`} />
          <AvatarFallback>
            {selectedRoom?.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="ml-2">{selectedRoom?.name}</span>
      </div>
      <div className="messages overflow-y-auto flex flex-col">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <Message
              key={index}
              text={msg.content}
              sent={msg.sender === user.username}
              timestamp={formatTimestamp(msg.timestamp)}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Say hi to the room.</p>
          </div>
        )}
      </div>
      <MessageInput
        roomPk={selectedRoom.id}
        roomType={selectedRoom.room_type}
        onSendMessage={sendMessage}
      />
    </div>
  );
}

export default withAuth(ChatArea);
