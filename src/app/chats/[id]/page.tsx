"use client";

import { RequestError } from "@/types";
import { use, useEffect, useRef } from "react";
import { ChatContent, ChatRoomLayout } from "../components/ChatRoomContent";
import useChat, { ChatProvider, ChatRoomInfo } from "./hooks/useChat";

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

  if (!id) {
    return <LoadingState />;
  }

  return (
    <ChatProvider id={id}>
      <ChatRoomPageBody />
    </ChatProvider>
  );
}

function ChatRoomPageBody() {
  const messagesStartRef = useRef<HTMLDivElement>(null);
  const {
    chatRoom,
    messages,

    fetchChatroom: fetchChatroom,
  } = useChat();

  const scrollToBottom = () => {
    messagesStartRef.current?.scrollIntoView();
  };

  useEffect(() => {
    fetchChatroom();
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

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
    />
  );
}
