import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

export default function UserItem(props) {
  const { user } = props;

  // Capitalize the first letter of the first and last names
  const capitalize = (name) => name.charAt(0).toUpperCase() + name.slice(1);
  const userProfileUrl = `/chat/user/${user.id}`;
  return (
    <TableRow key={user.id}>
      <Link to={userProfileUrl}>
        <TableCell className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src={
                user.pfp
                  ? `http://127.0.0.1:8000${user.pfp}`
                  : "http://127.0.0.1:8000/media/user_avatar/default.jpg"
              }
            />
            <AvatarFallback>
              {user.first_name.charAt(0).toUpperCase()}
              {user.last_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p>
              {capitalize(user.first_name)} {capitalize(user.last_name)}{" "}
            </p>
            <p className="font-light text-sm text-wrap">{user.username}</p>
          </div>
        </TableCell>
      </Link>
    </TableRow>
  );
}
