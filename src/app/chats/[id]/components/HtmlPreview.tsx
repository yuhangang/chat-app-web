import { FileCode } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const HtmlPreview = ({ htmlString }: { htmlString: string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>(400);

  useEffect(() => {
    const updateIframeHeight = () => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const contentHeight =
          iframeRef.current.contentWindow.document.documentElement
            ?.scrollHeight;
        setHeight(Math.min(contentHeight, 400)); // Cap at 400px max
      }
    };

    // Set up resize observer for dynamic height updates
    if (iframeRef.current) {
      const resizeObserver = new ResizeObserver(updateIframeHeight);
      resizeObserver.observe(iframeRef.current);

      // Clean up observer
      return () => resizeObserver.disconnect();
    }
  }, [htmlString]);

  // Basic HTML wrapper to ensure proper rendering
  const wrappedHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              margin: 0; 
              padding: 16px;
              font-family: system-ui, -apple-system, sans-serif;
            }
            img { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>${htmlString}</body>
      </html>
    `;

  return (
    <div className="mb-2 mt-2">
      <div className="flex items-center gap-2 p-2 bg-black/5 rounded-t-lg">
        <FileCode className="w-5 h-5" />
        <span className="text-sm font-medium">HTML Preview</span>
      </div>

      <div className="relative">
        <iframe
          ref={iframeRef}
          srcDoc={wrappedHtml}
          className="w-full border border-black/10 rounded-b-lg bg-white"
          style={{ height: `${height}px` }}
          sandbox="allow-same-origin"
          title="HTML Preview"
        />
      </div>
    </div>
  );
};

export default HtmlPreview;
