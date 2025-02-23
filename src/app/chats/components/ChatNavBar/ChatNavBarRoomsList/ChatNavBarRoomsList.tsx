import React from "react";
import { Button } from "@/components/ui/button";
import { ChatRoom } from "@/types";
import { MessageSquare, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useChatRoomsContext } from "../../../hooks/useChatRoomsContext";
import groupRoomsByDate, { GroupedRooms } from "./lib/ChatNavBarRoomsSorter";

const ChatNavBarRoomsList = () => {
  const { chatRooms, fetchChatRooms, deleteChatRoom } = useChatRoomsContext();

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const [groupedRooms, setGroupedRooms] = React.useState<GroupedRooms>({
    today: [],
    last7days: [],
    last30days: [],
    older: [],
  });

  useEffect(() => {
    setGroupedRooms(groupRoomsByDate(chatRooms));
  }, [chatRooms]);

  return (
    <div className="flex-1 overflow-y-auto py-2 px-2 space-y-4">
      {groupedRooms.today.length > 0 && (
        <RoomGroup
          title="Today"
          rooms={groupedRooms.today}
          deleteChatRoom={deleteChatRoom}
        />
      )}

      {groupedRooms.last7days.length > 0 && (
        <RoomGroup
          title="Last 7 Days"
          rooms={groupedRooms.last7days}
          deleteChatRoom={deleteChatRoom}
        />
      )}

      {groupedRooms.last30days.length > 0 && (
        <RoomGroup
          title="Last 30 Days"
          rooms={groupedRooms.last30days}
          deleteChatRoom={deleteChatRoom}
        />
      )}

      {groupedRooms.older.length > 0 && (
        <RoomGroup
          title="Older"
          rooms={groupedRooms.older}
          deleteChatRoom={deleteChatRoom}
        />
      )}
    </div>
  );
};

const RoomGroup = ({
  title,
  rooms,
  deleteChatRoom,
}: {
  title: string;
  rooms: ChatRoom[];
  deleteChatRoom: (id: number) => Promise<boolean>;
}) => {
  return (
    <div className="space-y-1">
      <h3 className="px-2 text-sm font-medium text-muted-foreground mb-2">
        {title}
      </h3>
      {rooms.map((room) => (
        <ChatRoomItem
          key={room.id}
          room={room}
          deleteChatRoom={deleteChatRoom}
        />
      ))}
    </div>
  );
};

const ChatRoomItem = ({
  room,
  deleteChatRoom,
}: {
  room: ChatRoom;
  deleteChatRoom: (id: number) => Promise<boolean>;
}) => {
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
          <p className="text-xs text-muted-foreground truncate">
            {new Date(room.updated_at).toLocaleDateString()}
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
};

export default ChatNavBarRoomsList;
