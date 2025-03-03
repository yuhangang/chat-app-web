"use client";
import React from "react";
import { ChatHeader } from "./components/ChatHeader";
import ChatInput from "./components/ChatInput/ChatInput";
import { NewChatProvider, useNewChat } from "./hooks/useNewChat";

export default function ChatsPage() {
  const suggestions = [
    { text: "Help me write a blog post about AI", icon: "✍️" },
    { text: "Explain quantum computing to a beginner", icon: "🔬" },
  ];

  return (
    <div>
      <ChatHeader showBorder={false} />

      <div className="max-w-2xl mx-auto mt-20 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold mb-2">Start a New Chat</h1>
          <p className="text-gray-600">
            Ask anything or choose a suggestion below
          </p>
        </div>

        <NewChatProvider>
          <ChatInput chatInputType="newChat" />
          <ChatSuggestions suggestions={suggestions.map((s) => s.text)} />
        </NewChatProvider>
      </div>
    </div>
  );
}

function ChatSuggestions({ suggestions }: { suggestions: string[] }) {
  const { sendMessage } = useNewChat();

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };
  return (
    <div className="mt-8 space-y-2">
      {suggestions.map((suggestion, i) => (
        <button
          key={i}
          className="w-full p-4 flex items-center gap-3 text-left 
          bg-muted hover:bg-muted/80 active:bg-muted/60
          rounded-lg shadow-sm border border-border/50
          transition-all duration-200
          group"
          onClick={() => handleSuggestionClick(suggestion)}
        >
          <span className="text-xl text-muted-foreground group-hover:text-foreground transition-colors">
            ✍️
          </span>
          <span className="text-muted-foreground group-hover:text-foreground transition-colors">
            {suggestion}
          </span>
        </button>
      ))}
    </div>
  );
}
