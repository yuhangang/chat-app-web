import { Paperclip, Send, Settings } from "lucide-react";
import React, { useRef, useState } from "react";
import { ChatSettingsPanel } from "./ChatSettingsPanel";
import DragFileOverlay from "./DragFileOverlay";
import FilePreview from "./FilePreview";

// TODO: handle models config from the backend
export const MODEL_OPTIONS = [
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
  {
    id: "gemini-2.0-flash-thinking-exp-01-21",
    name: "Gemini 2.0 Flash Thinking Exp 01-21",
  },
];

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
}: {
  isSending: boolean;
  newMessage: string;
  selectedFile: File | null;
  handleSubmit: (
    e: React.FormEvent,
    options?: { attachment?: File; model?: string; temperature?: number }
  ) => void;
  setNewMessage: (message: string) => void;
  setSelectedFile: (file: File | null) => void;
  previewPosition?: "above" | "below";
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // New state for model selection and temperature
  const [showSettings, setShowSettings] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0]);
  const [temperature, setTemperature] = useState(0.7);

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

  const handlePaste = (e: React.ClipboardEvent) => {
    // Check if there are items in the clipboard
    const items = e.clipboardData?.items;
    if (!items) return;

    // Loop through clipboard items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Check if the item is a file
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault(); // Prevent the default paste behavior
          handleFile(file);
          return;
        }
      }
    }

    // If no file is found, let the normal paste behavior happen
  };

  const removeAttachment = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e, {
      attachment: selectedFile || undefined,
      model: selectedModel.id,
      temperature: temperature,
    });
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

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className="mx-auto max-w-4xl w-full relative">
      {/* Settings Panel Overlay */}
      {showSettings && (
        <ChatSettingsPanel
          toggleSettings={toggleSettings}
          setSelectedModel={setSelectedModel}
          selectedModel={selectedModel}
          temperature={temperature}
          setTemperature={setTemperature}
        />
      )}

      <form
        onSubmit={handleFormSubmit}
        className="w-full rounded-xl md:rounded-2xl shadow-sm transition-all duration-200 border-none"
      >
        {selectedFile && previewPosition === "above" && (
          <FilePreview
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            removeAttachment={removeAttachment}
          />
        )}

        <div className="flex flex-col items-end gap-1 md:gap-2 p-1.5 md:p-2 bg-muted rounded-xl md:rounded-2xl border-none">
          <DragFileOverlay
            handleFile={handleFile}
            className="w-full relative rounded-xl md:rounded-2xl border-none"
          >
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleTextareaChange}
              className={`w-full px-3 md:px-4 py-2 md:py-3 bg-transparent resize-none min-h-[40px] md:min-h-[48px] border-none 2 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 ${
                isSending ? "opacity-50 cursor-not-allowed" : ""
              }`}
              placeholder="Type your message..."
              disabled={isSending}
              onPaste={handlePaste}
              onKeyDown={handleKeyDown}
              rows={1}
            />
          </DragFileOverlay>

          <div className="flex w-full justify-between items-center">
            <div
              className="flex items-center gap-2 text-gray-300 hover:text-gray-400 hover:bg-muted-foreground rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                toggleSettings();
              }}
            >
              <button
                id="chat-settings"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSettings();
                }}
                className={`p-2 md:p-2 rounded-lg md:rounded-xl hover:bg-gray-100 transition-all duration-200 ${
                  isSending ? "opacity-50 cursor-not-allowed" : ""
                } ${showSettings ? "bg-gray-100" : ""}`}
                disabled={isSending}
              >
                <Settings className="w-5 h-5 text-gray-500" />
              </button>

              <div className="hidden md:flex items-center text-xs rounded-md px-2 py-1">
                <span>{selectedModel.name}</span>
                <span className="mx-2">•</span>
                <span>Temp: {temperature.toFixed(1)}</span>
              </div>
              <div className="md:hidden flex items-center text-xs rounded-md px-2 py-1">
                <span className="truncate max-w-[80px]">
                  {selectedModel.name.split(" ")[0]}
                </span>
                <span className="mx-1">•</span>
                <span>T: {temperature.toFixed(1)}</span>
              </div>
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
                <Send
                  className={`w-5 h-5 ${isSending ? "animate-pulse" : ""}`}
                />
              </button>
            </div>
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
    </div>
  );
}
