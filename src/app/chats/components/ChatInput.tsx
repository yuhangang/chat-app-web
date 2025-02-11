import React, { useRef, useState } from "react";
import { Send, Paperclip, X } from "lucide-react";

const ALLOWED_FILE_TYPES = {
  "text/plain": ".txt",
  "text/csv": ".csv",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "text/html": ".html",
  "application/pdf": ".pdf",
  "application/json": ".json",
};

export default function ChatInput({
  isSending,
  newMessage,
  selectedFile,
  handleSubmit,
  setNewMessage,
  setSelectedFile,
}: {
  isSending: boolean;
  newMessage: string;
  selectedFile: File | null;
  handleSubmit: (e: React.FormEvent, attachment?: File) => void;
  setNewMessage: (message: string) => void;
  setSelectedFile: (file: File | null) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleFile(file);
  };

  const handleFile = (file: File) => {
    // Check if file size exceeds 10MB
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 5MB. Please select a smaller file.");
      return;
    }

    // Check if file type is allowed
    const fileType = file.type;
    if (!Object.keys(ALLOWED_FILE_TYPES).includes(fileType)) {
      alert("File type not supported. Please select a valid file.");
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (fileType.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;
    handleFile(file);
  };

  const removeAttachment = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e, selectedFile || undefined);
    removeAttachment();
  };

  return (
    <div
      className="p-4 border-t relative"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-2 border-2 border-dashed border-blue-500 bg-blue-50 rounded-lg flex items-center justify-center">
          <div className="text-blue-500 text-sm">Drop file here</div>
        </div>
      )}

      {selectedFile && (
        <div className="absolute bottom-full right-4 mb-2">
          <div className="relative inline-flex items-center bg-white rounded-lg shadow-sm border p-1">
            <button
              onClick={removeAttachment}
              className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-sm border hover:bg-gray-50"
              type="button"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="flex items-center gap-2">
              {previewUrl ? (
                <div className="bg-gray-100 rounded flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-48 h-48  object-cover rounded"
                  />
                </div>
              ) : (
                <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs">
                  {selectedFile.name.split(".").pop()?.toUpperCase()}
                </div>
              )}
              <span className="text-xs truncate max-w-[140px]">
                {selectedFile.name}
              </span>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className={`flex-1 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isSending ? "bg-gray-100 text-gray-500" : ""
          }`}
          placeholder="Type your message..."
          disabled={isSending}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={Object.values(ALLOWED_FILE_TYPES).join(",")}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-lg border hover:bg-gray-50 transition-colors"
          disabled={isSending}
        >
          <Paperclip className="w-5 h-5 text-gray-500" />
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
          disabled={!newMessage.trim() && !selectedFile}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
