import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Upload, X } from "lucide-react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setError(null);
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

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !uploadedPhoto) {
      setError("Please enter a message or upload a photo");
      return;
    }

    const userMessage = {
      content: inputValue.trim(),
      sentBy: "user",
      image: uploadedPhoto ? uploadedPhoto.url : null,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setUploadedPhoto(null);
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("prompt", userMessage.content);
      if (uploadedPhoto) {
        formData.append("image", uploadedPhoto.file);
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/api/chat/gemini/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const aiMessage = {
        content: response.data.text,
        sentBy: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setUploadedPhoto(null);
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
    <div className="ai-chat flex flex-col justify-between w-[70vw] h-[80vh] relative bg-gray-100 rounded-lg shadow-lg">
      <div className="chat-header flex py-3 items-center border-b border-gray-300 bg-white rounded-t-lg">
        <Avatar>
          <AvatarImage src="/perdotcom-bot-head.gif" alt="AI" />
          <AvatarFallback>"AI"</AvatarFallback>
        </Avatar>
        <span className="ml-4 font-semibold text-lg">AI Chat✨</span>
      </div>
      <div className="messages overflow-y-auto flex flex-col p-4 flex-grow">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message my-2 p-3 rounded-lg max-w-[70%] ${
                msg.sentBy === "user"
                  ? "bg-blue-600 text-white self-end"
                  : "bg-white border border-gray-300 self-start"
              }`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Uploaded"
                  className="max-w-full mb-2 rounded"
                />
              )}
              <p>{msg.content}</p>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Start chatting with our AI!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex flex-col border-t border-gray-300 p-4 bg-white rounded-b-lg">
        {uploadedPhoto && (
          <div className="relative w-24 h-24 mb-2">
            <img
              src={uploadedPhoto.url}
              alt="Upload preview"
              className="w-full h-full object-cover rounded"
            />
            <Button
              onClick={removeUploadedPhoto}
              className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
            >
              <X size={16} />
            </Button>
          </div>
        )}
        <textarea
          placeholder="Type a message..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="border p-2 rounded-lg mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex justify-between">
          <Button
            onClick={() => fileInputRef.current.click()}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Upload size={16} className="mr-2" /> Upload Photo
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out"
          >
            {isLoading ? (
              <>
                <span className="animate-spin inline-block mr-2">⋯</span>
                Sending...
              </>
            ) : (
              <>
                Send <Send size={16} strokeWidth={2} className="ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
