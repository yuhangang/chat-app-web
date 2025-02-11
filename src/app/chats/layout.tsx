"use client";

import { Button } from "@/components/ui/button";
import { cookieService } from "@/lib/cookies";
import { ChatRoom } from "@/types";
import { Link, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ChatNavBar, MobileNav } from "./components/ChatNavBar";
import { ChatRoomsProvider } from "./hooks/useChatRoomsContext";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatRoomsProvider>
        <div className="h-screen flex">
          {/* Mobile overlay */}
          {isOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
          )}

          <MobileNav isOpen={isOpen} setIsOpen={setIsOpen} />

          {/* Sidebar */}
          <div
            className={`
                        fixed top-0 left-0 z-30 h-full w-64 bg-gray-800 shadow-lg transform 
                        lg:relative lg:translate-x-0 lg:shadow-none
                        transition-transform duration-300 ease-in-out
                        ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    `}
          >
            <ChatNavBar isOpen={isOpen} />
          </div>

          {/* Main content */}
          <div className="flex-1">{children}</div>
        </div>
      </ChatRoomsProvider>
    </>
  );
}
