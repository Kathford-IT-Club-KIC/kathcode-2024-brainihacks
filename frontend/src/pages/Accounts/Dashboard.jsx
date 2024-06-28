// src/components/Dashboard.js
import React from "react";
import { LogoutButton } from "../components/Accounts/LogoutButton";

function Dashboard({ userProfile }) {
  console.log(userProfile)
  if (!userProfile) {
    return <div>Loading...</div>; // Or any loading indicator you prefer
  }

  return (
    <div>
      <img
        src={
          userProfile.user.pfp
            ? `http://127.0.0.1:8000${userProfile.user.pfp}`
            : "http://127.0.0.1:8000/media/user_avatar/default.jpg"
        }
        alt={userProfile.user.username}
      />
      <h1>
        Welcome, {userProfile.user.first_name} {userProfile.user.last_name}!
      </h1>
      <p>@{userProfile.user.username}</p>
      <p>
        {userProfile.user.is_guide
          ? "Guide"
          : userProfile.user.is_event_manager
          ? "Event Manager"
          : "Tourist"}
      </p>
      <LogoutButton />
    </div>
  );
}

export default Dashboard;
