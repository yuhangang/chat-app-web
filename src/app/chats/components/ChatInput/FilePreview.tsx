import { X } from "lucide-react";
import Image from "next/image";

export default function FilePreview({
  selectedFile,
  previewUrl,
  removeAttachment,
}: {
  selectedFile: File;
  previewUrl: string | null;
  removeAttachment: () => void;
}) {
  return (
    <>
      <div className="mb-2">
        <div className="relative p-2 md:p-3 bg-muted rounded-lg md:rounded-xl border">
          <button
            onClick={removeAttachment}
            className="absolute -top-2 -right-2 p-1 md:p-1.5 bg-gray-700 rounded-full shadow-md hover:bg-gray-500 transition-colors duration-200"
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
              <div className="h-12 w-12 md:h-14 md:w-14 bg-gray-500 rounded-lg flex-shrink-0 flex items-center justify-center text-xs md:text-sm font-medium">
                {selectedFile?.name.split(".").pop()?.toUpperCase()}
              </div>
            )}
            <span className="text-xs md:text-sm truncate flex-1">
              {selectedFile?.name}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
