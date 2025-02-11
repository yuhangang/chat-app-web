import { Button } from "@/components/ui/button";
import { cookieService } from "@/lib/cookies";
import { ChatRoom } from "@/types";
import { Menu, MessageSquare, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useChatRoomsContext } from "../hooks/useChatRoomsContext";
import Link from "next/link";
import ThemeToggle from "@/components/theme/themeToggle";

export function MobileNav({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="lg:hidden">
      {/* Hamburger menu button - fixed position */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-30 rounded-full bg-white shadow-md hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6" />
      </Button>
    </div>
  );
}

export function ChatNavBar({ isOpen }: { isOpen: boolean }) {
  const { chatRooms, fetchChatRooms, deleteChatRoom } = useChatRoomsContext();

  useEffect(() => {
    fetchChatRooms();
  }, []);

  return (
    <div
      className={`
        fixed lg:static w-64 h-full z-30 transform transition-transform
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      <div>
        <div className="px-4 pt-4">
          <Link href="/chats/new">
            <div className="w-full bg-blue-500 text-white p-2 rounded mb-4 block text-center">
              New Chat
            </div>
          </Link>
        </div>
        <div className="space-y-2 flex flex-col overflow-y-auto h-[calc(100vh-200px)]">
          {chatRooms.map((room, i: number) => {
            console.log("Room:", room);
            return (
              <ChatRoomItem
                key={i}
                room={room}
                deleteChatRoom={deleteChatRoom}
              />
            );
          })}
        </div>
        <div className="fixed bottom-16 left-4">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

function ChatRoomItem({
  room,
  deleteChatRoom,
}: {
  room: ChatRoom;
  deleteChatRoom: (id: number) => Promise<boolean>;
}) {
  return (
    <Link href={`/chats/${room.id}`}>
      <div className="group relative flex items-center rounded hover:bg-gray-200 p-2 cursor-pointer">
        {/* Chat Icon - Made smaller */}
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
          <MessageSquare size={14} />
        </div>

        {/* Chat Name - Simplified */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 truncate">
            {room.name || "Unnamed Chat"}
          </p>
        </div>

        {/* Delete Button */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteChatRoom(room.id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete chat room"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </Link>
  );
}
