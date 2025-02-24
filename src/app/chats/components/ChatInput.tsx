import { Paperclip, Send, X } from "lucide-react";
import React, { useRef, useState } from "react";
import Image from "next/image";

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
  previewPosition = "above",
}: // previewMaxHeight = "12rem",
{
  isSending: boolean;
  newMessage: string;
  selectedFile: File | null;
  handleSubmit: (e: React.FormEvent, attachment?: File) => void;
  setNewMessage: (message: string) => void;
  setSelectedFile: (file: File | null) => void;
  previewPosition?: "above" | "below";
  // previewMaxHeight?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // File handling functions remain the same
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFile(file);
  };

  const handleFile = (file: File) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 5MB. Please select a smaller file.");
      return;
    }

    if (!Object.keys(ALLOWED_FILE_TYPES).includes(file.type)) {
      alert("File type not supported. Please select a valid file.");
      return;
    }

    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;
    handleFile(file);
  };

  const removeAttachment = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e, selectedFile || undefined);
    removeAttachment();
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, 5 * 24);
    textarea.style.height = `${newHeight}px`;
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    adjustTextareaHeight(e.target);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="mx-auto max-w-4xl w-full rounded-xl md:rounded-2xl shadow-sm transition-all duration-200 focus-within:shadow-lg"
    >
      {selectedFile && previewPosition === "above" && (
        <FilePreview
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          removeAttachment={removeAttachment}
        />
      )}

      <div className="flex items-end gap-1 md:gap-2 p-1.5 md:p-2 bg-muted rounded-xl md:rounded-2xl border">
        <div
          className="flex-1 min-w-0"
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <textarea
            ref={textareaRef}
            value={newMessage}
            onChange={handleTextareaChange}
            className={`w-full px-3 md:px-4 py-2 md:py-3 bg-transparent rounded-lg md:rounded-xl resize-none min-h-[40px] md:min-h-[48px] focus:outline-none transition-opacity duration-200 ${
              isSending ? "opacity-50 cursor-not-allowed" : ""
            }`}
            placeholder="Type your message..."
            disabled={isSending}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          {isDragging && (
            <div className="absolute inset-0 border-2 border-dashed border-blue-500 bg-blue-50/80 rounded-xl flex items-center justify-center">
              <div className="text-blue-500 text-sm md:text-lg font-medium">
                Drop file here
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-1 md:gap-2 p-0.5 md:p-1 shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-2 md:p-3 rounded-lg md:rounded-xl hover:bg-gray-100 transition-all duration-200 ${
              isSending ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSending}
          >
            <Paperclip className="w-5 h-5 text-gray-500" />
          </button>
          <button
            type="submit"
            className={`p-2 md:p-3 bg-blue-500 text-white rounded-lg md:rounded-xl hover:bg-blue-600 transition-all duration-200 ${
              isSending ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSending}
          >
            <Send className={`w-5 h-5 ${isSending ? "animate-pulse" : ""}`} />
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={Object.values(ALLOWED_FILE_TYPES).join(",")}
          className="hidden"
        />
      </div>

      {selectedFile && previewPosition === "below" && (
        <FilePreview
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          removeAttachment={removeAttachment}
        />
      )}
    </form>
  );
}

function FilePreview({
  selectedFile,
  previewUrl,
  removeAttachment,
}: {
  selectedFile: File;
  previewUrl: string | null;
  removeAttachment: () => void;
}) {
  return (
    <div className="mb-2">
      <div className="relative p-2 md:p-3 bg-gray-50 rounded-lg md:rounded-xl border">
        <button
          onClick={removeAttachment}
          className="absolute -top-2 -right-2 p-1 md:p-1.5 bg-white rounded-full shadow-md border hover:bg-gray-50 transition-colors duration-200"
          type="button"
        >
          <X className="w-3 h-3 md:w-4 md:h-4" />
        </button>
        <div className="flex items-center gap-3">
          {previewUrl ? (
            <div className="h-12 w-12 md:h-14 md:w-14 bg-black rounded-lg flex-shrink-0 overflow-hidden">
              <Image
                src={previewUrl}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-12 w-12 md:h-14 md:w-14 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-xs md:text-sm font-medium">
              {selectedFile?.name.split(".").pop()?.toUpperCase()}
            </div>
          )}
          <span className="text-xs md:text-sm truncate flex-1">
            {selectedFile?.name}
          </span>
        </div>
      </div>
    </div>
  );
}
