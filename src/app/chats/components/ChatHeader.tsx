import { LogIn, MenuIcon } from "lucide-react";
import Link from "next/link";

// Navigation component
export function ChatHeader({
  title,
  showBorder = true,
}: {
  title?: string;
  showBorder?: boolean;
}) {
  return (
    <nav
      className={`bg-background p-4 flex items-center justify-between ${
        showBorder ? "border-b" : ""
      }`}
    >
      <div className="flex-1 flex justify-center">
        <span className="font-bold text-lg">{title}</span>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/login">
          <LogIn className="h-5 w-5 cursor-pointer hover:opacity-80" />
        </Link>
      </div>
    </nav>
  );
}
