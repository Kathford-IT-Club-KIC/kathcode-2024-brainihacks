import React, { useState } from "react";
import Sidebar from "./components/Chats/Sidebar";
import ChatArea from "./components/Chats/ChatArea";

export default function Inbox() {
  const [selectedRoom, setSelectedRoom] = useState(null); // State to track selected room

  // Function to handle room selection
  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  return (
    <div className="flex gap-4 w-[100vw] h-[70vh] border border-black p-5 rounded-lg">
      <Sidebar
        className="flex-1 border-black"
        onRoomSelect={handleRoomSelect}
      />
      {selectedRoom ? (
        <ChatArea className="flex-3" selectedRoom={selectedRoom} />
      ) : (
        <div className="flex-1 justify-center items-center border-black">
          <p>No rooms are open. Click any chats to start talking.</p>
        </div>
      )}
    </div>
  );
}
