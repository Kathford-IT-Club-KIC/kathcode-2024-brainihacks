import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { format, parseISO } from "date-fns";
import ExpressInterestButton from "../components/ExpressInterestButton";

export default function EventDetails() {
  const { id } = useParams(); // Get the event ID from URL params
  const [event, setEvent] = useState(null); // State to hold the event details

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const authToken = localStorage.getItem("access_token");
        if (!authToken) {
          // Redirect to login if not authenticated
          window.location.href = "/login"; // Example of redirecting to login page
          return;
        }

        const api = axios.create({
          baseURL: "http://127.0.0.1:8000/api/",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        const response = await api.get(`events/${id}/`); // Fetch event details by ID
        const eventData = response.data;

        // Format dates if needed
        eventData.start_date = format(
          parseISO(eventData.start_date),
          "dd/MM/yyyy HH:mm"
        );
        eventData.end_date = format(
          parseISO(eventData.end_date),
          "dd/MM/yyyy HH:mm"
        );

        setEvent(eventData); // Update state with event details
      } catch (error) {
        console.error("Fetch event details error:", error);
      }
    };

    fetchEventDetails();
  }, [id]); // Re-run effect when the ID changes

  if (!event) {
    return <div>Loading...</div>; // Placeholder for when event details are fetching
  }

  return (
    <div className="flex justify-center items-center flex-col">
      <Link to="/events" className="hover:underline hover:text-blue-600">
        Back to Events List
      </Link>
      <h1 className="text-5xl mb-4 text-center font-bold uppercase">
        {event.title}
      </h1>
      <p>
        Event Manager:{" "}
        <Link className="hover:underline hover:text-blue-600">
          {event.event_manager}
        </Link>
      </p>
      <hr />
      <Carousel
        className="w-[640px]"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="w-[640px]">
          <CarouselItem className="w-[640px] ">
            <img
              src={`http://127.0.0.1:8000${event.photo1}`}
              width={640}
              alt="Event Photo 1"
              className="aspect-square  h-auto max-w-[640px] rounded-sm mb-8 shadow-lg"
            />
          </CarouselItem>
          <CarouselItem className="w-[320px]">
            <img
              src={`http://127.0.0.1:8000${event.photo2}`}
              width={640}
              alt="Event Photo 2"
              className="aspect-square  h-auto max-w-[640px] rounded-sm mb-8 shadow-lg"
            />
          </CarouselItem>
          <CarouselItem className="w-[320px]">
            <img
              src={`http://127.0.0.1:8000${event.photo3}`}
              width={640}
              alt="Event Photo 3"
              className="aspect-square h-auto max-w-[640px] rounded-sm mb-8 shadow-lg"
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <p className="">{event.description}</p>
      {event.video_file && (
        <video
          className="my-4 rounded-lg"
          controls
          src={`http://127.0.0.1:8000${event.video_file}`}
        ></video>
      )}

      <p>Starts: {event.start_date}</p>
      <p>Ends: {event.end_date}</p>
      <ExpressInterestButton type="event" id={event.id} />
    </div>
  );
}
