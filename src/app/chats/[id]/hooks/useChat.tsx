import { getErrorType, RequestError, RequestErrors } from "@/lib/error";
import authFetch from "@/lib/fetch/fetch";
import { ChatRoom, Message } from "@/types";
import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  ReactNode,
} from "react";

export type ChatRoomInfo = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  user_id: number;
};

interface ChatContextType {
  chatRoom: ChatRoomInfo | RequestError | null;
  messages: Message[];
  newMessage: string;
  isSending: boolean;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  setNewMessage: (message: string) => void;
  sendMessage: () => Promise<void>;
  fetchChatroom: () => Promise<void>;
}

interface ChatProviderProps {
  id: string;
  children: ReactNode;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ id, children }: ChatProviderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [chatRoom, setChatRoom] = useState<ChatRoomInfo | RequestError | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = async () => {
    setIsSending(true);
    try {
      const formData = new FormData();

      formData.append("prompt", newMessage);
      if (selectedFile) {
        formData.append("attachment", selectedFile);
      }

      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/chats/${id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.ok) {
        const data: Message[] = await res.json();

        setMessages((prev) => [...prev, ...data]);
        setNewMessage("");
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const fetchChatroom = useCallback(async () => {
    const res = await authFetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/chats/${id}`
    );
    if (res.ok) {
      try {
        const data: ChatRoom = await res.json();
        setChatRoom(data);
        if (data.chat_messages) {
          setMessages(data.chat_messages);
        }
      } catch {
        // handle unexpected error
        setChatRoom(RequestErrors.unknown_error);
      }
    } else {
      // determine if it's network error
      setChatRoom(getErrorType(res.status, res.statusText));
    }
  }, [id]);

  const value = {
    chatRoom,
    messages,
    newMessage,
    isSending,
    selectedFile,
    setSelectedFile,
    setNewMessage,
    sendMessage,
    fetchChatroom,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export default useChat;
