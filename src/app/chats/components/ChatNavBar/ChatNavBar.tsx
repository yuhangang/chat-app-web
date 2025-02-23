import ThemeToggle from "@/components/theme/themeToggle";
import { Button } from "@/components/ui/button";
import { Menu, Plus } from "lucide-react";
import Link from "next/link";
import ChatNavBarRoomsList from "./ChatNavBarRoomsList/ChatNavBarRoomsList";

export function MobileNav({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="lg:hidden">
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-30 rounded-full bg-background shadow-md 
          hover:bg-accent hover:text-accent-foreground
          transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  );
}

export function ChatNavBar({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      className={`
        fixed lg:static w-72 h-full transform transition-all duration-300
        bg-card border-r border-border/40 shadow-lg lg:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border/40">
          <Link href="/chats?new">
            <Button
              className="w-full gap-2 bg-primary hover:bg-primary/90"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </Link>
        </div>

        <ChatNavBarRoomsList />

        <div className="p-4 pb-8 lg:pb-16 mt-auto">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
