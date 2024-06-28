import React, { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import Message from "./Message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import withAuth from "@/utils/withAuth";

function ChatArea({ user, selectedRoom }) {
  const [messages, setMessages] = React.useState([]);
  const ws = useRef(null);
  const BASE_WS_URL = "ws://127.0.0.1:8000/api/chat/";

  useEffect(() => {
    if (user && selectedRoom) {
      // Initialize WebSocket connection
      ws.current = new WebSocket(`${BASE_WS_URL}${selectedRoom.id}/`);

      ws.current.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected");
      };

      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      return () => {
        ws.current.close();
      };
    }
  }, [user, selectedRoom]);

  return (
    <div className="chat-area flex flex-col justify-between w-[70vw] relative">
      <div className="chat-header border-b border-black bg-white">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="ml-2">{selectedRoom?.name}</span>
      </div>
      <div className="messages overflow-y-auto flex flex-col">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <Message
              key={index}
              text={msg.message}
              sent={msg.sender_id === user.id}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Say hi to the room.</p>
          </div>
        )}
      </div>
      <MessageInput roomName={selectedRoom?.name} />
    </div>
  );
}

export default withAuth(ChatArea);
