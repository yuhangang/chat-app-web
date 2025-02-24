import formatTimestamp from "@/lib/strings/dateFormatter";
import { ChatAttachment, Message } from "@/types";
import { File, FileCode, FileJson, FileText } from "lucide-react";
import HtmlPreview from "./HtmlPreview";
import MarkdownViewer from "./MarkdownViewer";
import Image from "next/image";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case "text/plain":
      return <FileText className="w-5 h-5" />;
    case "text/csv":
      return <FileText className="w-5 h-5" />;
    case "text/html":
      return <FileCode className="w-5 h-5" />;
    case "application/json":
      return <FileJson className="w-5 h-5" />;
    case "application/pdf":
      return <FileText className="w-5 h-5" />;
    default:
      return <File className="w-5 h-5" />;
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const AttachmentPreview = ({ attachment }: { attachment: ChatAttachment }) => {
  const isImage = attachment.file_type.startsWith("image/");

  if (isImage) {
    return (
      <div className="mb-2">
        <a href={attachment.file_path} target="_blank">
          <Image
            src={attachment.file_path}
            alt={attachment.file_name}
            className="w-40 h-40 rounded-lg object-cover aspect-[1]"
          />
        </a>
      </div>
    );
  }

  return (
    <a
      href={attachment.file_path}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 p-2 rounded-lg bg-black/5 hover:bg-black/10 transition-colors mb-2"
    >
      {getFileIcon(attachment.file_type)}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">
          {attachment.file_name}
        </div>
        <div className="text-xs opacity-70">
          {formatFileSize(attachment.file_size)}
        </div>
      </div>
    </a>
  );
};

const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  return (
    <div
      className={`flex w-full ${isOwn ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`
          ${
            isOwn
              ? "bg-primary text-white ml-auto min-w-[60%]"
              : "bg-secondary mr-auto    w-100"
          }
       rounded-lg p-4 break-words
        `}
      >
        {message.attachments?.map((attachment) => (
          <AttachmentPreview key={attachment.id} attachment={attachment} />
        ))}
        {message.body && (
          <p className="text-sm">
            <MarkdownViewer markdown={message.body} />
            {message.body.startsWith("<!DOCTYPE html>") ? (
              <HtmlPreview htmlString={message.body} />
            ) : (
              ""
            )}
          </p>
        )}
        <span className="text-xs opacity-70 mt-1 block text-right pt-4">
          {formatTimestamp(message.created_at)}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
