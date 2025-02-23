import { Message } from "@/types";
import MessageBubble from "../[id]/components/MessageBubble";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatInput from "./ChatInput";
import { MenuIcon, Home, Settings, LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { ChatHeader } from "./ChatHeader";

// Chat content component
export function ChatContent({
  title,
  messages,
  messagesStartRef,
  isSending,
  handleSubmit,
  newMessage,
  setNewMessage,
  selectedFile,
  setSelectedFile,
}: {
  title: string;
  messages: Message[];
  messagesStartRef: React.RefObject<HTMLDivElement | null> | null;
  isSending: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}) {
  return (
    <div className="h-screen flex flex-col">
      <ChatHeader title={title} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full px-4">
            <div className="flex-1 flex flex-col-reverse">
              <div ref={messagesStartRef} className="pb-16" />
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
          </div>
        </div>

        <div className="border-t bg-background">
          <div className="max-w-4xl mx-auto w-full px-4 py-3">
            <ChatInput
              isSending={isSending}
              handleSubmit={handleSubmit}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
// Base layout component for all states
export function ChatRoomLayout({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode | null;
}) {
  return (
    <div className="h-screen flex flex-col">
      <ChatHeader title={title} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full px-4">
            <div className="flex-1 flex flex-col-reverse">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
