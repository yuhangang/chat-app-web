import { Message } from "@/types";
import MessageBubble from "../[id]/components/MessageBubble";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatInput from "./ChatInput";

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
    <>
      <ChatRoomLayout title={title}>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse">
          <div ref={messagesStartRef} className="pb-16 lg:pb-24" />
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
        <div className="px-4 py-3 md:p-6 lg:ml-72 border-t absolute z-10 inset-x-0 bottom-0 bg-background">
          <ChatInput
            isSending={isSending}
            handleSubmit={handleSubmit}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        </div>
      </ChatRoomLayout>
    </>
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
    <Card className="h-[100vh] flex flex-col p-0">
      <CardHeader className="border-b px-4 py-4">
        <div className="mx-auto w-full text-center">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full px-4">
          <CardContent className="p-0">{children}</CardContent>
        </div>
      </div>
    </Card>
  );
}
