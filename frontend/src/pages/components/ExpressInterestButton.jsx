import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ExpressInterestButton = ({ type, id }) => {
  const [isInterested, setIsInterested] = useState(false);
  const [buttonText, setButtonText] = useState(
    `Express Interest in ${type === "event" ? "Event" : "Tour"}`
  );
  const navigate = useNavigate();

  useEffect(() => {
    const checkInterest = async () => {
      try {
        const authToken = localStorage.getItem("access_token");
        if (!authToken) {
          // Handle authentication logic here, such as redirecting to login page
          navigate("/accounts");
          return;
        }

        const endpoint =
          type === "event"
            ? `http://127.0.0.1:8000/api/chat/check-event-interest/${id}/`
            : `http://127.0.0.1:8000/api/chat/check-tour-interest/${id}/`;

        const config = {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        };

        const response = await axios.get(endpoint, config);
        setIsInterested(response.data.interested);
        setButtonText(
          response.data.interested
            ? `Unexpress Interest in ${type === "event" ? "Event" : "Tour"}`
            : `Express Interest in ${type === "event" ? "Event" : "Tour"}`
        );
      } catch (error) {
        console.error("Error checking interest:", error);
        // Handle error state or display an error message
      }
    };

    checkInterest();
  }, [type, id, navigate]);

  const expressInterest = async () => {
    try {
      const authToken = localStorage.getItem("access_token");
      if (!authToken) {
        // Handle authentication logic here, such as redirecting to login page
        navigate("/accounts");
        return;
      }

      let endpoint = null;
      if (isInterested) {
        endpoint =
          type === "event"
            ? `http://127.0.0.1:8000/api/chat/unexpress-event-interest/${id}/`
            : `http://127.0.0.1:8000/api/chat/unexpress-tour-interest/${id}/`;
      } else {
        endpoint =
          type === "event"
            ? `http://127.0.0.1:8000/api/chat/express-event-interest/${id}/`
            : `http://127.0.0.1:8000/api/chat/express-tour-interest/${id}/`;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      const response = await axios.post(endpoint, null, config);
      console.log("Interest action successful:", response.data);
      toast.success(
        `Interest ${isInterested ? "Unexpressed" : "Expressed"} successfully`
      );
      setIsInterested(!isInterested);
      setButtonText(
        isInterested
          ? `Express Interest in ${type === "event" ? "Event" : "Tour"}`
          : `Unexpress Interest in ${type === "event" ? "Event" : "Tour"}`
      );
    } catch (error) {
      toast.error("Error processing interest action");
      // Handle error state or display an error message
    }
  };

  return <Button onClick={expressInterest}>{buttonText}</Button>;
};

export default ExpressInterestButton;
