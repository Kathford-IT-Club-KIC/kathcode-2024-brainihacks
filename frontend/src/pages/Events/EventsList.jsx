import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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

import { format, parseISO } from "date-fns"; // Import format and parseISO functions from date-fns

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const authToken = localStorage.getItem("access_token");
      if (authToken) {
        try {
          const api = axios.create({
            baseURL: "http://127.0.0.1:8000/api/",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });

          const eventResponse = await api.get("events/");
          const eventData = eventResponse.data.map((event) => ({
            ...event,
            // Assuming start_date and end_date are combined datetime strings like "2024-06-30T15:30:00"
            start_date: format(parseISO(event.start_date), "dd/MM/yyyy HH:mm"),
            end_date: format(parseISO(event.end_date), "dd/MM/yyyy HH:mm"),
          }));
          setEvents(eventData);
        } catch (error) {
          console.error("Fetch events error:", error);
        }
      } else {
        // Redirect to login page or handle unauthorized access
        navigate.push("/login"); // Example of using navigate for redirect
      }
    };

    fetchEvents();
  }, [navigate]); // Include navigate in dependency array if used within useEffect

  return (
    <div>
      <h2>Events List</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription className=" max-w-[320px] truncate">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Carousel classN ame="w-[320px]">
                  <Link to={`/event/${event.id}`}>
                    <CarouselContent className="w-[320px]">
                      <CarouselItem className="w-[320px]">
                        <img
                          src={`http://127.0.0.1:8000${event.photo1}`}
                          width={320}
                        />
                      </CarouselItem>
                      <CarouselItem className="w-[320px]">
                        <img
                          src={`http://127.0.0.1:8000${event.photo2}`}
                          width={320}
                        />
                      </CarouselItem>
                      <CarouselItem className="w-[320px]">
                        <img
                          src={`http://127.0.0.1:8000${event.photo3}`}
                          width={320}
                        />
                      </CarouselItem>
                    </CarouselContent>
                  </Link>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </CardContent>
              <CardFooter className="flex flex-col">
                <p>Starts: {event.start_date}</p>
                <p>Ends: {event.end_date}</p>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
