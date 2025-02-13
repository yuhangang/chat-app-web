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
  previewPosition = "above",
  previewMaxHeight = "12rem",
}: {
  isSending: boolean;
  newMessage: string;
  selectedFile: File | null;
  handleSubmit: (e: React.FormEvent, attachment?: File) => void;
  setNewMessage: (message: string) => void;
  setSelectedFile: (file: File | null) => void;
  previewPosition?: "above" | "below";
  previewMaxHeight?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    const newHeight = Math.min(textarea.scrollHeight, 5 * 24); // 24px per line, max 5 lines
    textarea.style.height = `${newHeight}px`;
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    adjustTextareaHeight(e.target);
  };

  const FilePreview = () => (
    <div className="w-full bg-gray-50 rounded-lg border">
      <div className="relative p-2">
        <button
          onClick={removeAttachment}
          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border hover:bg-gray-50 z-10"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3">
          {previewUrl ? (
            <div className="h-12 w-12 bg-gray-100 rounded flex-shrink-0">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-full w-full object-cover rounded"
              />
            </div>
          ) : (
            <div className="h-12 w-12 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center text-sm font-medium">
              {selectedFile?.name.split(".").pop()?.toUpperCase()}
            </div>
          )}
          <span className="text-sm truncate flex-1">{selectedFile?.name}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 border-t">
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
        {selectedFile && previewPosition === "above" && <FilePreview />}

        <div className="flex gap-2">
          <div
            className="flex-1 relative"
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleTextareaChange}
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[48px] transition-opacity duration-200 ${
                isSending ? "opacity-50 cursor-not-allowed" : ""
              }`}
              placeholder="Type your message..."
              disabled={isSending}
              rows={1}
            />
            {isDragging && (
              <div className="absolute -inset-2 border-2 border-dashed border-blue-500 bg-blue-50/80 rounded-xl flex items-center justify-center">
                <div className="text-blue-500 text-lg font-medium">
                  Drop file here
                </div>
              </div>
            )}
          </div>

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
            className={`w-12 h-12 flex items-center justify-center rounded-lg border hover:bg-gray-50 transition-all duration-200 ${
              isSending ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSending}
          >
            <Paperclip className="w-5 h-5 text-gray-500" />
          </button>
          <button
            type="submit"
            className={`w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 ${
              isSending ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSending}
          >
            <Send className={`w-5 h-5 ${isSending ? "animate-pulse" : ""}`} />
          </button>
        </div>

        {selectedFile && previewPosition === "below" && <FilePreview />}
      </form>
    </div>
  );
}
