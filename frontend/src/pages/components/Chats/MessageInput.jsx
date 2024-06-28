import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Send } from 'lucide-react';
export default function MessageInput() {
  const [ inputValue, setInputValue]  = useState("");
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleSendMessage = () => {
    console.log(inputValue);
    // send message logic here
  };
  return (
    <div className="flex flex-col border-t border-gray-600 pt-2 gap-1">
      <Textarea
        placeholder="Type a message..."
        value={inputValue}
        onChange={handleInputChange}
      />
      <Button onClick={handleSendMessage}>Send &nbsp;<Send size={16} strokeWidth={2} /></Button>
    </div>
  );
}
