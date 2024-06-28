// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Account from "./pages/Accounts/Account";
import Home from "./pages/Home";
import Layout from "./pages/layout/Layout";
import Inbox from "./pages/Inbox";
import NotFound from "./pages/NotFound";
import EventsList from "./pages/Events/EventsList";
import EventDetails from "./pages/Events/EventDetails";
import EventManagersList from "./pages/Users/EventManagerList";
import AgencyList from "./pages/Users/AgencyList";
import GuideList from "./pages/Users/GuideList";
import Explore from "./pages/Explore";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/chats" element={<Inbox />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/guides" element={<GuideList />} />
        <Route path="/agencies" element={<AgencyList />} />
        <Route path="/event-managers" element={<EventManagersList />} />
        <Route path="/event/:id" element={<EventDetails />} />
      </Routes>
    </Layout>
  );
}

export default App;
