import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserItem({ room, onRoomSelect }) {
  const capitalize = (name) =>
    name ? name.charAt(0).toUpperCase() + name.slice(1) : "";

  return (
    <TableRow onClick={() => onRoomSelect(room)} className="cursor-pointer">
      <TableCell className="flex gap-2 items-center">
        <Avatar>
          <AvatarImage
            src={
              room.photo
                ? `http://127.0.0.1:8000${room.photo}`
                : "http://127.0.0.1:8000/media/user_avatar/default.jpg"
            }
            alt={room.name}
          />
          <AvatarFallback>
            {room.name ? room.name.slice(0, 2).toUpperCase() : "RM"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p>{capitalize(room.name)}</p>
          <p className="font-light text-sm text-wrap">
            Host: {room.created_by}
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
}
