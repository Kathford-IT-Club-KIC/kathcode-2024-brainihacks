import React from "react";
import Navbar from "../components/Navbar";
import { Toaster } from 'sonner'
export default function Layout({ children }) {
  return (
    <>
      <div className="grid place-items-center h-100 w-100 mx-10 my-5">
        <div className="flex items-center justify-center max-w-[900px] min-w-[320px]">{children}</div>
      </div>
      <Toaster />
      <Navbar/>
    </>
  );
}
