import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import UserItem from "./UserItem";
import useAuthCheck from "@/utils/hooks/withAuthCheck";
import { Link } from "react-router-dom";

export default function Sidebar({ onRoomSelect }) {
  const { isAuthenticated } = useAuthCheck();
  const [eventRooms, setEventRooms] = useState([]);
  const [tourRooms, setTourRooms] = useState([]);
  const [loader, setLoader] = useState(true);
  const BASE_URL = "http://127.0.0.1:8000/";

  useEffect(() => {
    const authToken = localStorage.getItem("access_token");
    if (isAuthenticated) {
      const fetchRooms = async () => {
        try {
          const [eventResponse, tourResponse] = await Promise.all([
            axios.get(`${BASE_URL}api/chat/event-rooms/`, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }),
            axios.get(`${BASE_URL}api/chat/tour-rooms/`, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }),
          ]);

          setEventRooms(
            Array.isArray(eventResponse.data) ? eventResponse.data : []
          );
          setTourRooms(
            Array.isArray(tourResponse.data) ? tourResponse.data : []
          );
          setLoader(false);
        } catch (error) {
          console.error("Error fetching rooms", error);
          setLoader(false);
        }
      };
      fetchRooms();
    }
  }, [isAuthenticated]);

  return (
    <div className="sidebar w-[320px] border-r border-black">
      <Table>
        <TableCaption>End-to-end encrypted.🔒</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <h1 className="text-black text-xl text-center">Inbox</h1>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!loader ? (
            eventRooms.length > 0 || tourRooms.length > 0 ? (
              <>
                {eventRooms.map((room) => (
                  <UserItem
                    key={`event-room-${room.id}`}
                    room={room}
                    onRoomSelect={onRoomSelect}
                  />
                ))}
                {tourRooms.map((room) => (
                  <UserItem
                    key={`tour-room-${room.id}`}
                    room={room}
                    onRoomSelect={onRoomSelect}
                  />
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell>
                  <p>No rooms available. Join any rooms first.</p>
                  <Link to="/explore">Explore rooms</Link>
                </TableCell>
              </TableRow>
            )
          ) : (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell className="flex items-center gap-4">
                  <Skeleton className="w-[100px] h-[20px] rounded-full" />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
