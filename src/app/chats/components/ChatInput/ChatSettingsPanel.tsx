import { X } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { MODEL_OPTIONS } from "./ChatInput";

export function ChatSettingsPanel({
  toggleSettings,
  setSelectedModel,
  selectedModel,
  temperature,
  setTemperature,
}: {
  toggleSettings: () => void;
  setSelectedModel: React.Dispatch<
    React.SetStateAction<{ id: string; name: string }>
  >;
  selectedModel: { id: string; name: string };
  temperature: number;
  setTemperature: React.Dispatch<React.SetStateAction<number>>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [panelPosition, setPanelPosition] = useState({});

  // Update isMobile on mount and on resize
  useLayoutEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Calculate position using useLayoutEffect to get accurate measurements
  useLayoutEffect(() => {
    // Get the reference to the chat settings button
    const buttonElement = document.getElementById("chat-settings");
    if (!buttonElement || !panelRef.current) return;

    // Get button and panel measurements
    const buttonRect = buttonElement.getBoundingClientRect();
    const panelWidth = 360; // Fixed panel width

    // Get viewport dimensions
    const windowHeight = window.innerHeight;

    if (isMobile) {
      // For mobile, use modal-style positioning
      setPanelPosition({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxHeight: "80vh",
        width: "90%",
        borderRadius: "16px",
      });
      return;
    }

    // For desktop: Position as dropdown below the button
    // Calculate right alignment relative to the button

    // Calculate whether panel should go up or down based on available space
    const spaceBelow = windowHeight - buttonRect.bottom - 10; // 10px buffer
    const panelHeight = Math.min(400, spaceBelow); // Limit panel height

    if (spaceBelow >= 200) {
      const rightOffset = buttonRect.right + 12; // 10px buffer
      // Position below the button if there's enough space
      setPanelPosition({
        position: "fixed",
        top: `${buttonRect.bottom + 5}px`, // 5px gap
        right: `${rightOffset}px`, // Align right edge with button right edge
        maxHeight: `${panelHeight}px`,
        width: `${panelWidth}px`,
      });
    } else {
      // Position above the button if there's not enough space below
      const spaceAbove = buttonRect.top - 10;
      const panelHeightAbove = Math.min(400, spaceAbove);
      const rightOffset = buttonRect.left; // 10px buffer

      setPanelPosition({
        position: "fixed",
        bottom: `${windowHeight - buttonRect.top + 5}px`, // 5px gap
        left: `${rightOffset}px`, // Align right edge with button right edge
        maxHeight: `${panelHeightAbove}px`,
        width: `${panelWidth}px`,
      });
    }
  }, [isMobile]);

  // Dismiss panel when clicking outside
  useLayoutEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !document
          .getElementById("chat-settings")
          ?.contains(event.target as Node)
      ) {
        toggleSettings();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [toggleSettings]);

  return (
    <div
      id="chat-settings-panel"
      ref={panelRef}
      className="fixed bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700 z-50 overflow-auto"
      style={panelPosition}
    >
      {/* Header */}
      <div className="sticky top-0 flex justify-between items-center p-3 border-b border-gray-700 bg-gray-800 z-10">
        <h3 className="text-sm font-medium">Settings</h3>
        <button
          type="button"
          onClick={toggleSettings}
          className="text-gray-400 hover:text-gray-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Model Selection */}
      <div className="p-3">
        <h4 className="text-xs font-medium text-gray-400 mb-2">Model</h4>
        <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
          {MODEL_OPTIONS.map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => setSelectedModel(model)}
              className={`text-sm py-2 px-3 rounded-md transition-colors ${
                selectedModel.id === model.id
                  ? "bg-blue-900/30 text-blue-400 font-medium"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>

      {/* Temperature Slider */}
      <div className="p-3 border-t border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-medium text-gray-400">Temperature</h4>
          <span className="text-xs font-medium text-gray-300 min-w-7 text-right">
            {temperature.toFixed(1)}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-gray-400">0.0</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="flex-1 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-xs text-gray-400">1.0</span>
        </div>

        <div className="flex justify-between text-xs text-gray-500 px-1 mt-2">
          <span>More precise</span>
          <span>More creative</span>
        </div>
      </div>
    </div>
  );
}
