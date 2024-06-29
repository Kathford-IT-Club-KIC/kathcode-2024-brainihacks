import React, { useState } from "react";
import Sidebar from "./components/Chats/Sidebar";
import ChatArea from "./components/Chats/ChatArea";
import AIChat from "./components/Chats/AIChat";

function Inbox() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isAIChat, setIsAIChat] = useState(false);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setIsAIChat(false);
  };

  const handleAIChatSelect = () => {
    setSelectedRoom(null);
    setIsAIChat(true);
  };

  return (
    <div className="inbox flex border rounded-lg justify-center">
      <Sidebar
        onRoomSelect={handleRoomSelect}
        onAIChatSelect={handleAIChatSelect}
      />
      {isAIChat ? <AIChat /> : <ChatArea selectedRoom={selectedRoom} />}
    </div>
  );
}

export default Inbox;
