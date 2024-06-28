import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Toaster } from "sonner";

export default function Layout({ children }) {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isVisible =
        prevScrollPos > currentScrollPos || currentScrollPos < 10;
      setIsNavbarVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <>
      <div className="grid place-items-center h-100 w-100 mx-10 my-5">
        <div className="flex items-center justify-center max-w-[900px] min-w-[320px]">
          {children}
        </div>
      </div>
      <Toaster />
      {isNavbarVisible && <Navbar />}
    </>
  );
}
