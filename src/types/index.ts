// src/types/index.ts
export interface User {
  id: number;
  created_at: string;
  username: string;
  chatRooms: ChatRoom[];
}

export interface ChatRoom {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  user_id: number;
  chat_messages: Message[];
}

export interface Message {
  id: number;
  created_at: string;
  body: string;
  chat_room_id: number;
  is_user: boolean;
  attachments: ChatAttachment[];
}

export interface ChatAttachment {
  id: number;
  created_at: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  message_id: number;
}

// Optional: Create a type for API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
