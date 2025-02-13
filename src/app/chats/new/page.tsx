"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRef } from "react";
import ChatInput from "../components/ChatInput";
import { useNewChat } from "../hooks/useNewChat";

export default function ChatRoomPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    newMessage,
    isSending,
    selectedFile,
    sendMessage,
    setNewMessage,
    setSelectedFile,
  } = useNewChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessage(newMessage);
  };

  return (
    <Card className="max-w-4xl mx-auto h-[90vh] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-semibold">New Chat Room</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
        <div className="text-center text-gray-500 mt-4 flex-1">
          No messages yet. Start the conversation!
        </div>

        <ChatInput
          newMessage={newMessage}
          isSending={isSending}
          selectedFile={selectedFile}
          setNewMessage={setNewMessage}
          handleSubmit={handleSubmit}
          setSelectedFile={setSelectedFile}
        />
      </CardContent>
    </Card>
  );
}
