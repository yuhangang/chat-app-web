"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { use, useEffect, useRef } from "react";
import ChatInput from "../components/ChatInput";
import MessageBubble from "./components/MessageBubble";
import useChat, { ChatRoomInfo } from "./hooks/useChat";
import { ChatRoom, RequestError } from "@/types";

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
    messagesStartRef.current?.scrollIntoView({ behavior: "smooth" });
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

  if (chatRoom === null) {
    return (
      <Card className="max-w-4xl mx-auto h-[90vh] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold">Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  } else if ("message" in chatRoom) {
    const error: RequestError = chatRoom;

    return (
      <Card className="max-w-4xl mx-auto h-[90vh] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{chatRoom.message}</p>
        </CardContent>
      </Card>
    );
  } else {
    const chatRoomInfo: ChatRoomInfo = chatRoom;

    return (
      <Card className="max-w-4xl mx-auto h-[90vh] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold">
            {chatRoom?.name ?? ""}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse">
            <div ref={messagesStartRef} />
            {messages
              .slice()
              .reverse()
              .map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.is_user}
                />
              ))}
          </div>
          <ChatInput
            isSending={isSending}
            handleSubmit={handleSubmit}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        </CardContent>
      </Card>
    );
  }
}
