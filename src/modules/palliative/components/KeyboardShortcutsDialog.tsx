import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Keyboard } from "lucide-react";

interface ShortcutItem {
  key: string;
  description: string;
}

const shortcuts: ShortcutItem[] = [
  { key: "→", description: "Next tab" },
  { key: "←", description: "Previous tab" },
  { key: "⌘/Ctrl + S", description: "Save changes" },
  { key: "Esc", description: "Close dialog/Cancel" },
  { key: "?", description: "Show keyboard shortcuts" }
];

export const KeyboardShortcutsDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          title="Keyboard Shortcuts"
        >
          <Keyboard className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          {shortcuts.map(({ key, description }) => (
            <div
              key={key}
              className="flex items-center justify-between px-4 py-2 rounded-lg bg-gray-50"
            >
              <span className="text-sm text-gray-600">{description}</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                {key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};