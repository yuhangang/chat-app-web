"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Link, Loader2, Menu, SendIcon, Sparkles, X } from "lucide-react";
import { cookieService } from "@/lib/cookies";
import { ChatRoom } from "@/types";
import { Button } from "@/components/ui/button";
import { useChatRoomsContext } from "./hooks/useChatRoomsContext";

export default function ChatsPage() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createChatRoom } = useChatRoomsContext();

  const suggestions = [
    { text: "Help me write a blog post about AI", icon: "✍️" },
    { text: "Explain quantum computing to a beginner", icon: "🔬" },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsLoading(true);
    createChatRoom(message);
    setTimeout(() => setIsLoading(false), 8000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setIsLoading(true);

    createChatRoom(suggestion);
    setTimeout(() => setIsLoading(false), 8000);
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold mb-2">Start a New Chat</h1>
        <p className="text-gray-600">
          Ask anything or choose a suggestion below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a message..."
          className="w-full p-4 pr-12 rounded-lg shadow-md border focus:ring-2 focus:ring-blue-500 transition-all"
          disabled={isLoading}
        />
        <button
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full
            ${message.trim() ? "bg-blue-500 text-white" : "text-gray-400"}
            transition-all hover:bg-blue-600 disabled:opacity-50`}
          disabled={!message.trim() || isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <SendIcon className="h-5 w-5" />
          )}
        </button>
      </form>

      <div className="mt-8 space-y-2">
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            className="w-full p-4 flex items-center gap-3 text-left 
              bg-white hover:bg-gray-50 rounded-lg shadow-sm border
              transition-all duration-200 hover:shadow-md"
            onClick={() => handleSuggestionClick(suggestion.text)}
          >
            <span className="text-xl">{suggestion.icon}</span>
            <span className="text-gray-700">{suggestion.text}</span>
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white p-6 rounded-xl shadow-xl flex items-center gap-4 animate-in fade-in duration-300">
            <Sparkles className="h-5 w-5 text-blue-500 animate-pulse" />
            <p className="text-sm font-medium">Creating your chat room...</p>
          </div>
        </div>
      )}
    </div>
  );
}
