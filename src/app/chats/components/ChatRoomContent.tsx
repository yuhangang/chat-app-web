import { Message } from "@/types";
import MessageBubble from "../[id]/components/MessageBubble";
import { ChatHeader } from "./ChatHeader";
import ChatInput from "./ChatInput/ChatInput";

// Chat content component
export function ChatContent({
  title,
  messages,
  messagesStartRef,
}: {
  title: string;
  messages: Message[];
  messagesStartRef: React.RefObject<HTMLDivElement | null> | null;
}) {
  return (
    <div className="h-screen flex flex-col">
      <ChatHeader title={title} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full px-4 py-8">
            <div className="flex-1 flex flex-col-reverse">
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
          </div>
        </div>

        <div className="border-t bg-background">
          <div className="max-w-4xl mx-auto w-full px-4 py-3">
            <ChatInput chatInputType="chat" />
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
