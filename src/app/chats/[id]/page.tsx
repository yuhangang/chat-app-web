"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";
import { use } from "react";
import ChatInput from "../components/ChatInput";
import MessageBubble from "./components/MessageBubble";
import useChat, { ChatRoomInfo } from "./hooks/useChat";
import { ChatRoom, Message, RequestError } from "@/types";
import { ChatContent, ChatRoomLayout } from "../components/ChatRoomContent";

// Loading state component
function LoadingState() {
  return <ChatRoomLayout title="Loading..."></ChatRoomLayout>;
}

// Error state component
function ErrorState({ message }: { message: string }) {
  return (
    <ChatRoomLayout title="Error">
      <div className="p-4">
        <p>{message}</p>
      </div>
    </ChatRoomLayout>
  );
}

export default function ChatRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const messagesStartRef = useRef<HTMLDivElement>(null);
  const {
    chatRoom,
    messages,
    isSending,
    newMessage,
    selectedFile,
    setNewMessage,
    sendMessage,
    setSelectedFile,
    fetchChatrooms: fetchChatroom,
  } = useChat(id);

  const scrollToBottom = () => {
    messagesStartRef.current?.scrollIntoView();
  };

  useEffect(() => {
    fetchChatroom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessage(e);
  };

  // Handle different states
  if (chatRoom === null) {
    return <LoadingState />;
  }

  if ("message" in chatRoom) {
    const error = chatRoom as RequestError;
    return <ErrorState message={error.message} />;
  }

  const chatRoomInfo = chatRoom as ChatRoomInfo;
  return (
    <ChatContent
      title={chatRoomInfo.name}
      messages={messages}
      messagesStartRef={messagesStartRef}
      isSending={isSending}
      handleSubmit={handleSubmit}
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      selectedFile={selectedFile}
      setSelectedFile={setSelectedFile}
    />
  );
}
