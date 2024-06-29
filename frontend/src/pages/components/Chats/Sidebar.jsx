import React, { useState, useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000/";

const Sidebar = ({ onRoomSelect, onAIChatSelect }) => {
  const { isAuthenticated } = useAuthCheck();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const authToken = localStorage.getItem("access_token");
    if (isAuthenticated) {
      fetchRooms(authToken);
    }
  }, [isAuthenticated]);

  const fetchRooms = async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}api/chat/rooms/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(Array.isArray(response.data) ? response.data : []);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching rooms", error);
      setLoader(false);
    }
  };

  const fetchRoomDetails = async (roomId, token) => {
    try {
      const response = await axios.get(`${BASE_URL}api/chat/rooms/${roomId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedRoom(response.data);
    } catch (error) {
      console.error("Error fetching room details", error);
    }
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    onRoomSelect(room); // Example: pass selected room to parent component
  };

  const handleAIChatSelect = () => {
    setSelectedRoom(null);
    onAIChatSelect();
  };

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
          <TableRow onClick={handleAIChatSelect} className="cursor-pointer">
            <TableCell className="flex gap-2 items-center">
              <Avatar>
                <AvatarImage src="/perdotcom-bot-head.gif" alt="AI" />
                <AvatarFallback>"AI"</AvatarFallback>
              </Avatar>
              <div>
                <p>AI Chat✨</p>
              </div>
            </TableCell>
          </TableRow>
          {!loader ? (
            rooms.length > 0 ? (
              rooms.map((room) => (
                <UserItem
                  key={`room-${room.id}`}
                  room={room}
                  onRoomSelect={() => handleRoomSelect(room)}
                />
              ))
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
};

export default Sidebar;
