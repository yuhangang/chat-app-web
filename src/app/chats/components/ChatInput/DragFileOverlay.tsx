import { useRef, useState, useEffect } from "react";

export default function DragFileOverlay({
  handleFile,
  ...props
}: { handleFile: (file: File) => void } & React.HTMLProps<HTMLDivElement>) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounterRef = useRef(0);
  const originalContainerRef = useRef<HTMLDivElement>(null);
  const [overlayPosition, setOverlayPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (originalContainerRef.current && isDragging) {
      const rect = originalContainerRef.current.getBoundingClientRect();
      setOverlayPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  }, [isDragging]);

  // Global event handlers for the full screen
  useEffect(() => {
    const handleGlobalDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current++;
      setIsDragging(true);
    };

    const handleGlobalDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current--;
      if (dragCounterRef.current === 0) {
        setIsDragging(false);
      }
    };

    const handleGlobalDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current = 0;
      setIsDragging(false);

      if (e.dataTransfer) {
        const file = e.dataTransfer.files[0];
        if (file) {
          handleFile(file);
        }
      }
    };

    // Add global event listeners
    window.addEventListener("dragenter", handleGlobalDragEnter);
    window.addEventListener("dragleave", handleGlobalDragLeave);
    window.addEventListener("dragover", handleGlobalDragOver);
    window.addEventListener("drop", handleGlobalDrop);

    return () => {
      // Clean up event listeners
      window.removeEventListener("dragenter", handleGlobalDragEnter);
      window.removeEventListener("dragleave", handleGlobalDragLeave);
      window.removeEventListener("dragover", handleGlobalDragOver);
      window.removeEventListener("drop", handleGlobalDrop);
    };
  }, [handleFile]);

  return (
    <>
      <div {...props} ref={originalContainerRef}>
        {props.children}
      </div>

      {isDragging && (
        <>
          {/* Full screen overlay */}
          <div className="fixed inset-0 bg-blue-50/30 z-40 ml-80" />

          {/* Original-sized overlay */}
          <div
            className="fixed z-50 border-2 border-dashed border-blue-500 bg-blue-50/80 rounded-xl flex items-center justify-center"
            style={{
              top: `${overlayPosition.top}px`,
              left: `${overlayPosition.left}px`,
              width: `${overlayPosition.width}px`,
              height: `${overlayPosition.height}px`,
            }}
          >
            <div className="text-blue-500 text-sm md:text-lg font-medium">
              Drop file here
            </div>
          </div>
        </>
      )}
    </>
  );
}
