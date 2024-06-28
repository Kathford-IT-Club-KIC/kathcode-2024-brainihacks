import React from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ExpressInterestButton = ({ type, id }) => {
  const expressInterest = async () => {
    try {
      const authToken = localStorage.getItem("access_token");
      if (!authToken) {
        // Handle authentication logic here, such as redirecting to login page
        useNavigate("/accounts");
        return;
      }

      const endpoint =
        type === "event"
          ? `http://127.0.0.1:8000/api/chat/express-event-interest/${id}/`
          : `http://127.0.0.1:8000/api/chat/express-tour-interest/${id}/`;

      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      const response = await axios.post(endpoint, null, config);
      console.log("Interest expressed successfully:", response.data);
      toast.success("Interest expressed successfully");
      // Optionally, you can show a success message or update state after successful API call
    } catch (error) {
      toast.error("Error expressing interest");
      // Handle error state or display an error message
    }
  };

  return (
    <Button onClick={expressInterest}>
      Express Interest in {type === "event" ? "Event" : "Tour"}
    </Button>
  );
};

export default ExpressInterestButton;
