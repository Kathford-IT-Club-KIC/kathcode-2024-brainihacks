import React, { useState } from "react";
import Sidebar from "./components/Chats/Sidebar";
import ChatArea from "./components/Chats/ChatArea";
import AIChat from "./components/Chats/AIChat";
import useAuthCheck from "@/utils/hooks/withAuthCheck"; // Adjust the path as per your project structure

function Inbox() {
  const { userProfile, isLoading } = useAuthCheck(); // Ensure userProfile is correctly fetched

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

  // Ensure userProfile is loaded before rendering
  if (isLoading || !userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="inbox flex border rounded-lg justify-center">
      <Sidebar
        onRoomSelect={handleRoomSelect}
        onAIChatSelect={handleAIChatSelect}
      />
      {isAIChat ? (
        <AIChat />
      ) : (
        <ChatArea roomId={selectedRoom?.id} userId={userProfile?.user.id} /> // Ensure userId is passed down
      )}
    </div>
  );
}

export default Inbox;
