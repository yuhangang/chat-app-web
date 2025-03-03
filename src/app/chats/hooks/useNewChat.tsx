import React, { createContext, useContext, useState, ReactNode } from "react";
import authFetch from "@/lib/fetch/fetch";
import { ChatRoom } from "@/types";
import { useRouter } from "next/navigation";
import { useChatRoomsContext } from "./useChatRoomsContext";

// Define the context type
interface NewChatContextType {
  newMessage: string;
  isSending: boolean;
  selectedFile: File | null;
  setNewMessage: (message: string) => void;
  sendMessage: (message?: string) => Promise<void>;
  setSelectedFile: (file: File | null) => void;
}

// Create the context
const NewChatContext = createContext<NewChatContextType | undefined>(undefined);

// Provider component
export const NewChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const router = useRouter();
  const { addChatRoom } = useChatRoomsContext();

  const sendMessage = async (message?: string) => {
    setIsSending(true);

    try {
      const formData = new FormData();

      formData.append("prompt", message ?? newMessage);
      if (selectedFile) {
        formData.append("attachment", selectedFile);
      }

      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/chats`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.ok) {
        const data: ChatRoom = await res.json();
        addChatRoom(data);

        // redirect to the chat room
        router.push(`/chats/${data.id}`);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const value = {
    newMessage,
    isSending,
    selectedFile,
    setNewMessage,
    sendMessage,
    setSelectedFile,
  };

  return (
    <NewChatContext.Provider value={value}>{children}</NewChatContext.Provider>
  );
};

// Custom hook to use the context
export const useNewChat = (): NewChatContextType => {
  const context = useContext(NewChatContext);
  if (context === undefined) {
    throw new Error("useNewChat must be used within a NewChatProvider");
  }
  return context;
};
