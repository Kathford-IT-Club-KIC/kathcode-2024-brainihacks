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
    <div className="container mx-auto px-4">
      <h1 className="text-5xl mb-4 text-center font-bold uppercase">
        Events List
      </h1>
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div key={event.id} className="flex flex-col max-w-[360px]">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription className="max-w-[320px] truncate">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Carousel className="w-full">
                  <Link to={`/event/${event.id}`}>
                    <CarouselContent className="w-full">
                      <CarouselItem className="w-full">
                        <img
                          src={`http://127.0.0.1:8000${event.photo1}`}
                          width={320}
                          className="aspect-square h-auto max-w-full rounded-sm mb-4 shadow-lg"
                          alt="Event Photo"
                        />
                      </CarouselItem>
                      <CarouselItem className="w-full">
                        <img
                          src={`http://127.0.0.1:8000${event.photo2}`}
                          width={320}
                          className="aspect-square h-auto max-w-full rounded-sm mb-4 shadow-lg"
                          alt="Event Photo"
                        />
                      </CarouselItem>
                      <CarouselItem className="w-full">
                        <img
                          src={`http://127.0.0.1:8000${event.photo3}`}
                          width={320}
                          className="aspect-square h-auto max-w-full rounded-sm mb-4 shadow-lg"
                          alt="Event Photo"
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
          </div>
        ))}
      </div>
    </div>
  );
}
