import React, { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";

const ChatRoom = ({ roomId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `ws://127.0.0.1:8000/ws/chat/${roomId}/`
  );

  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      setMessages((prev) => [...prev, data]);
    }
  }, [lastMessage]);

  const handleSendMessage = () => {
    sendMessage(
      JSON.stringify({
        message: inputMessage,
        user_id: userId,
      })
    );
    setInputMessage("");
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.user_id}: {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;
