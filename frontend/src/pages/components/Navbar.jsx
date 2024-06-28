import React, { useEffect, useState } from "react";
import { House, MessageCircle, Telescope, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import useAuthCheck from "@/utils/hooks/withAuthCheck";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "./Navbar.css";

export default function Navbar() {
  const { isAuthenticated, userProfile, isLoading } = useAuthCheck();
  const [avatarKey, setAvatarKey] = useState(0); // State to force re-render

  useEffect(() => {
    // Whenever isAuthenticated changes, force re-render by changing the key
    setAvatarKey((prevKey) => prevKey + 1);
  }, [isAuthenticated]);

  const renderAvatar = () => {
    if (!isAuthenticated || isLoading || !userProfile) {
      return <UserRound />;
    }

    const initials = `${userProfile.user.first_name.charAt(
      0
    )}${userProfile.user.last_name.charAt(0)}`.toUpperCase();
    const avatarSrc = userProfile.user.pfp
      ? `http://127.0.0.1:8000${userProfile.user.pfp}`
      : "http://127.0.0.1:8000/media/user_avatar/default.jpg";

    return (
      <Avatar key={avatarKey} className="w-[24px] h-[24px]">
        <AvatarImage src={avatarSrc} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    );
  };

  return (
    <div className="flex justify-center">
      <ul className="nav-links px-5 py-2 transition-all shadow-sm hover:shadow-lg flex gap-8 fixed bottom-10">
        <li className="nav-link">
          <Link to="/">
            <House />
          </Link>
        </li>
        <li className="nav-link">
          <Link to="/chats">
            <MessageCircle />
          </Link>
        </li>
        <li className="nav-link">
          <Link to="/explore">
            <Telescope />
          </Link>
        </li>
        {isAuthenticated ? (
          <li className="nav-link">
            <Link to="/account">{renderAvatar()}</Link>
          </li>
        ) : (
          <li className="nav-link">
            <Link to="/account">
              <UserRound />
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
