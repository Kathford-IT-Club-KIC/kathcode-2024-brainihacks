import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import axios from "axios";

export default function MessageInput({ roomName }) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    const authToken = localStorage.getItem("access_token");

    // Send message to backend via API
    axios
      .post(
        `http://127.0.0.1:8000/api/chat/send_message/`,
        { message: inputValue, room_name: roomName },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Message sent successfully:", response.data);
        setInputValue(""); // Clear input after sending message
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  return (
    <div className="flex flex-col border-t border-gray-600 pt-2 gap-1">
      <Textarea
        placeholder="Type a message..."
        value={inputValue}
        onChange={handleInputChange}
      />
      <Button onClick={handleSendMessage}>
        Send <Send size={16} strokeWidth={2} />
      </Button>
    </div>
  );
}
