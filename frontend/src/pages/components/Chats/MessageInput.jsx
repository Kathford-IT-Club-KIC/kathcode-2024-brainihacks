import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import axios from "axios";

export default function MessageInput({ roomType, roomPk }) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setError(null); // Clear any previous errors when input changes
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) {
      setError("Message cannot be empty");
      return;
    }

    setIsLoading(true);
    setError(null);

    const authToken = localStorage.getItem("access_token");
    const messagePayload = {
      content: inputValue.trim(),
      [roomType === "event_room" ? "event_room" : "tour_room"]: roomPk,
    };

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/chat/send-message/`,
        messagePayload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Message sent successfully:", response.data);
      setInputValue(""); // Clear input after sending message
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col border-t border-gray-600 pt-2 gap-1">
      <Textarea
        placeholder="Type a message..."
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button onClick={handleSendMessage} disabled={isLoading}>
        {isLoading ? "Sending..." : "Send"} <Send size={16} strokeWidth={2} />
      </Button>
    </div>
  );
}
