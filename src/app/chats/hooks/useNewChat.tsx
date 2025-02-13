import { cookieService } from "@/lib/cookies";
import { ChatRoom, Message } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useChatRoomsContext } from "./useChatRoomsContext";

export const useNewChat = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const router = useRouter();
  const { addChatRoom } = useChatRoomsContext();

  const sendMessage = async (message: string) => {
    setIsSending(true);

    try {
      const jwt = cookieService.get("accessToken");

      const formData = new FormData();

      formData.append("prompt", message);
      if (selectedFile) {
        formData.append("attachment", selectedFile);
      }

      let res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/chats`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data: ChatRoom = await res.json();
        addChatRoom(data);

        // redirect to the chat room
        router.push(`/chats/${data.id}`);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return {
    newMessage,
    isSending,
    selectedFile,
    setNewMessage,
    sendMessage,
    setSelectedFile,
  };
};
