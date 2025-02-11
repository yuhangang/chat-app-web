import { cookieService } from "@/lib/cookies";
import { ChatRoom, Message } from "@/types";
import { useCallback, useState } from "react";

type ChatRoomInfo = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  user_id: number;
};

const useChat = (id: string) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [chatRoom, setChatRoom] = useState<ChatRoomInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSending(true);
    try {
      let res;
      const jwt = cookieService.get("token");

      const formData = new FormData();

      formData.append("prompt", newMessage);
      if (selectedFile) {
        formData.append("attachment", selectedFile);
      }

      res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/chats/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      });

      if (res.ok) {
        setNewMessage("");
        setSelectedFile(null);

        const data: Message[] = await res.json();

        setMessages((prev) => [...prev, ...data]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const fetchChatroom = useCallback(async () => {
    const jwt = cookieService.get("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/chats/${id}`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
    if (res.ok) {
      const data: ChatRoom = await res.json();
      setChatRoom(data);
      console.log("Chat messages:", data.chat_messages);
      if (data.chat_messages) {
        setMessages(data.chat_messages);
      }
    }

    return () => {
      // Cleanup
    };
  }, [id]);

  return {
    chatRoom,
    messages,
    newMessage,
    isSending,
    selectedFile,
    setSelectedFile,
    setNewMessage,
    sendMessage,
    fetchChatrooms: fetchChatroom,
  };
};

export default useChat;
