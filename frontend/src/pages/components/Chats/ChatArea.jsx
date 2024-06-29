import React, { useState, useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { Send, Upload, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const ChatArea = ({ roomId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    roomId ? `ws://127.0.0.1:8000/ws/chat/${roomId}/` : null,
    {
      shouldReconnect: (closeEvent) => true,
    }
  );

  // In your component:
  if (readyState !== WebSocket.OPEN) {
    return <div>Connecting...</div>;
  }
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/chat/rooms/${roomId}/messages/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError("Failed to fetch messages. Please try again.");
      }
      setIsLoading(false);
    };
    if (roomId) {
      fetchMessages();
    }
  }, [roomId]);

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const data = JSON.parse(lastMessage.data);
        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        console.error("Error parsing message data:", error);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" && !uploadedPhoto) {
      setError("Please enter a message or upload a photo");
      return;
    }

    setIsLoading(true);

    let photoUrl = null;
    if (uploadedPhoto) {
      try {
        const formData = new FormData();
        formData.append("file", uploadedPhoto.file);

        const response = await axios.post(
          `http://127.0.0.1:8000/api/chat/send-message/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        photoUrl = response.data.url;
      } catch (error) {
        console.error("Error uploading photo:", error);
        setError("Failed to upload photo. Please try again.");
        setIsLoading(false);
        return;
      }
    }

    const messageData = {
      message: inputMessage,
      user_id: userId, // Ensure userId is included
      image: photoUrl,
      sender: {
        id: userId,
      },
    };

    console.log("Sending message:", messageData); // Log to check message data

    sendMessage(JSON.stringify(messageData));

    setMessages((prevMessages) => [...prevMessages, messageData]);
    setInputMessage("");
    setUploadedPhoto(null);
    setIsLoading(false);
    setError(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedPhoto({
          file: file,
          url: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeUploadedPhoto = () => {
    setUploadedPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col w-[70vw] h-[80vh] relative bg-gray-100 rounded-lg shadow-lg">
      <div className="chat-header flex py-3 items-center border-b border-gray-300 bg-white rounded-t-lg">
        <Avatar>
          <AvatarImage src="" alt="AI" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <span className="ml-4 font-semibold text-lg">Chat Room</span>
      </div>
      <div className="messages overflow-y-auto flex flex-col p-4 flex-grow">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Loading messages...</p>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message my-2 p-3 rounded-lg max-w-[70%] ${
                msg.sender && msg.sender.id === userId
                  ? "bg-blue-600 text-white self-end"
                  : "bg-white border border-gray-300 self-start"
              }`}
            >
              {msg.image && (
                <img
                  src={`http://127.0.0.1:8000${msg.image}`}
                  alt="Uploaded"
                  className="max-w-full mb-2 rounded"
                />
              )}
              <p className="font-medium">
                {msg.sender && msg.sender.id === userId
                  ? "You"
                  : msg.sender?.username}
              </p>
              <p>{msg.content || msg.message}</p>
              <p className="text-xs mt-1 opacity-75">
                {msg.timestamp && typeof msg.timestamp === "string"
                  ? formatDistanceToNow(new Date(msg.timestamp), {
                      addSuffix: true,
                    })
                  : ""}
              </p>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Start chatting in this room!</p>
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="chat-input p-4 border-t border-gray-300 bg-white rounded-b-lg">
        <div className="flex items-center">
          <textarea
            rows="1"
            className="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-blue-500"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          ></textarea>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
          {uploadedPhoto && (
            <div className="flex items-center ml-4">
              <img
                src={uploadedPhoto.url}
                alt="Preview"
                className="max-h-16 rounded"
              />
              <Button
                onClick={removeUploadedPhoto}
                className="ml-2 p-1 rounded-full"
              >
                <X size={16} />
              </Button>
            </div>
          )}
          <Button
            onClick={() => fileInputRef.current.click()}
            className="ml-4 p-2 rounded-md"
          >
            <Upload size={16} />
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="ml-2 p-2 bg-blue-600 text-white rounded-md"
          >
            {isLoading ? "Sending..." : <Send size={16} />}
          </Button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default ChatArea;
