/* eslint-disable react-hooks/rules-of-hooks */
import useChat from "@/app/chats/[id]/hooks/useChat";
import { useNewChat } from "@/app/chats/hooks/useNewChat";

export interface ChatAdapterHook {
  isSending: boolean;
  newMessage: string;
  selectedFile: File | null;
  setNewMessage: (message: string) => void;
  setSelectedFile: (file: File | null) => void;
  sendMessage: (message?: string) => void;
}

export function useChatAdapter(hookType: "chat" | "newChat"): ChatAdapterHook {
  if (hookType === "chat") {
    const chatHook = useChat();
    return {
      isSending: chatHook.isSending,
      newMessage: chatHook.newMessage,
      selectedFile: chatHook.selectedFile,
      setNewMessage: chatHook.setNewMessage,
      setSelectedFile: chatHook.setSelectedFile,
      sendMessage: chatHook.sendMessage,
    };
  } else {
    const newChatHook = useNewChat();
    return {
      isSending: newChatHook.isSending,
      newMessage: newChatHook.newMessage,
      selectedFile: newChatHook.selectedFile,
      setNewMessage: newChatHook.setNewMessage,
      setSelectedFile: newChatHook.setSelectedFile,
      sendMessage: newChatHook.sendMessage,
    };
  }
}
