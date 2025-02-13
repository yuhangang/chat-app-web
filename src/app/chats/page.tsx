"use client";
import { Input } from "@/components/ui/input";
import { Loader2, SendIcon, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { useChatRoomsContext } from "./hooks/useChatRoomsContext";
import { useNewChat } from "./hooks/useNewChat";
import ChatInput from "./components/ChatInput";

export default function ChatsPage() {
  const suggestions = [
    { text: "Help me write a blog post about AI", icon: "✍️" },
    { text: "Explain quantum computing to a beginner", icon: "🔬" },
  ];

  const {
    newMessage,
    isSending,
    selectedFile,
    sendMessage,
    setNewMessage,
    setSelectedFile,
  } = useNewChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessage(newMessage);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold mb-2">Start a New Chat</h1>
        <p className="text-gray-600">
          Ask anything or choose a suggestion below
        </p>
      </div>

      <ChatInput
        newMessage={newMessage}
        isSending={isSending}
        selectedFile={selectedFile}
        setNewMessage={setNewMessage}
        handleSubmit={handleSubmit}
        setSelectedFile={setSelectedFile}
      />

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

      {isSending && (
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
