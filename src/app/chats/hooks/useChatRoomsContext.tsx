import {
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
} from "react";
import { ChatRoom } from "@/types";
import { cookieService } from "@/lib/cookies";
import { useRouter } from "next/navigation";

const useChatRooms = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchChatRooms = useCallback(async () => {
    try {
      const jwt = cookieService.get("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/chats`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        setChatRooms(data);
      }
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
    }
  }, []);

  const createChatRoom = useCallback(
    async (prompt: string) => {
      setIsLoading(true);
      try {
        const jwt = cookieService.get("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/chats?prompt=${prompt}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        if (res.ok) {
          let chatRoom = await res.json();

          // Append the new chat room to the existing list
          addChatRoom(chatRoom);

          // redirect to the new chat room
          router.push(`/chats/${chatRoom.id}`);

          return true;
        }
        return false;
      } catch (error) {
        console.error("Failed to create chat room:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchChatRooms]
  );

  const addChatRoom = useCallback((chatRoom: ChatRoom) => {
    setChatRooms((prev) => [chatRoom, ...prev]);
  }, []);

  const deleteChatRoom = useCallback(
    async (id: number) => {
      try {
        const jwt = cookieService.get("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/chats/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );
        if (res.ok) {
          await setChatRooms((prev) => prev.filter((room) => room.id !== id));
          return true;
        }
        return false;
      } catch (error) {
        console.error("Failed to delete chat room:", error);
        return false;
      }
    },
    [fetchChatRooms]
  );

  return {
    chatRooms,
    isLoading,
    fetchChatRooms,
    createChatRoom,
    addChatRoom,
    deleteChatRoom,
  };
};

interface ChatRoomsContextType {
  chatRooms: ChatRoom[];
  isLoading: boolean;
  fetchChatRooms: () => Promise<void>;
  createChatRoom: (prompt: string) => Promise<boolean>;
  addChatRoom: (chatRoom: ChatRoom) => void;
  deleteChatRoom: (id: number) => Promise<boolean>;
}

const ChatRoomsContext = createContext<ChatRoomsContextType | undefined>(
  undefined
);

// Custom hook to use chat rooms context
export function useChatRoomsContext() {
  const context = useContext(ChatRoomsContext);
  if (context === undefined) {
    throw new Error(
      "useChatRoomsContext must be used within a ChatRoomsProvider"
    );
  }
  return context;
}

export function ChatRoomsProvider({ children }: { children: React.ReactNode }) {
  const {
    chatRooms,
    isLoading,
    fetchChatRooms,
    createChatRoom,
    addChatRoom,
    deleteChatRoom,
  } = useChatRooms();

  // Fetch chat rooms on mount
  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  return (
    <ChatRoomsContext.Provider
      value={{
        chatRooms,
        isLoading,
        fetchChatRooms,
        createChatRoom,
        addChatRoom,
        deleteChatRoom,
      }}
    >
      {children}
    </ChatRoomsContext.Provider>
  );
}
