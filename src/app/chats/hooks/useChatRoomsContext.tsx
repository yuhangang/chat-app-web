import authFetch from "@/lib/fetch/fetch";
import { ChatRoom } from "@/types";
import { useRouter, usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const useChatRooms = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchChatRooms = useCallback(async () => {
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/chats`
      );
      if (res.ok) {
        const data = await res.json();
        setChatRooms(data);
      }
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addChatRoom = useCallback((chatRoom: ChatRoom) => {
    setChatRooms((prev) => [chatRoom, ...prev]);
  }, []);

  const deleteChatRoom = useCallback(
    async (id: number) => {
      try {
        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/chats/${id}`,
          {
            method: "DELETE",
          }
        );
        if (res.ok) {
          await setChatRooms((prev) => prev.filter((room) => room.id !== id));

          // TODO: Fix this
          if (pathname === `/chats/${id}`) {
            router.replace("/chats");
            router.refresh();
          }

          // redirect to /chats/new if the current chat room is deleted

          return true;
        }
        return false;
      } catch (error) {
        console.error("Failed to delete chat room:", error);
        return false;
      }
    },
    [pathname, router]
  );

  return {
    chatRooms,
    isLoading,
    fetchChatRooms,
    addChatRoom,
    deleteChatRoom,
  };
};

interface ChatRoomsContextType {
  chatRooms: ChatRoom[];
  isLoading: boolean;
  fetchChatRooms: () => Promise<void>;
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
  const { chatRooms, isLoading, fetchChatRooms, addChatRoom, deleteChatRoom } =
    useChatRooms();

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
        addChatRoom,
        deleteChatRoom,
      }}
    >
      {children}
    </ChatRoomsContext.Provider>
  );
}
