import { Button } from "@/components/ui/button";
import { cookieService } from "@/lib/cookies";
import { ChatRoom } from "@/types";
import { Menu, MessageSquare, Plus, Trash2, X } from "lucide-react";
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
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-30 rounded-full bg-background shadow-md 
          hover:bg-accent hover:text-accent-foreground
          transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
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
        fixed lg:static w-72 h-full transform transition-all duration-300
        bg-card border-r border-border/40 shadow-lg lg:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border/40">
          <Link href="/chats?new">
            <Button
              className="w-full gap-2 bg-primary hover:bg-primary/90"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-2">
          <div className="space-y-1">
            {chatRooms.map((room, i) => (
              <ChatRoomItem
                key={i}
                room={room}
                deleteChatRoom={deleteChatRoom}
              />
            ))}
          </div>
        </div>

        <div className="p-4 pb-8 lg:pb-16 mt-auto">
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
      <div
        className="group relative flex items-center gap-3 p-2.5 
        rounded-lg hover:bg-muted/80 active:bg-muted
        transition-all duration-200 cursor-pointer"
      >
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full 
          bg-primary/10 text-primary
          flex items-center justify-center"
        >
          <MessageSquare className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {room.name || "Unnamed Chat"}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 
            transition-opacity duration-200 h-8 w-8
            text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteChatRoom(room.id);
          }}
          aria-label="Delete chat room"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Link>
  );
}
