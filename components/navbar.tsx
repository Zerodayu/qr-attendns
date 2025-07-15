import {
  SparklesIcon,
  UploadIcon,
  ScanQrCode
} from "lucide-react"

import AppToggle from "@/components/app-toggle"
import { Button } from "@/components/ui/button"

type NavbarProps = {
  toggleValue: "off" | "on";
  setToggleValue: (value: "off" | "on") => void;
};

export default function Navbar({ toggleValue, setToggleValue }: NavbarProps) {
  return (
    <header className="fixed w-full backdrop-blur-sm bg-black/50 top-0 z-50 border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          <span className="flex items-center gap-2 font-mono font-semibold">
            <ScanQrCode className="size-8" />
            <h1 className="hidden sm:inline">Qr Attendns</h1>
          </span>
        </div>
        {/* Middle area */}
        <AppToggle value={toggleValue} onValueChange={setToggleValue} />
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-sm max-sm:aspect-square max-sm:p-0"
          >
            <UploadIcon
              className="opacity-60 sm:-ms-1"
              size={16}
              aria-hidden="true"
            />
            <span className="max-sm:sr-only">Export</span>
          </Button>
          <Button size="sm" className="text-sm max-sm:aspect-square max-sm:p-0">
            <SparklesIcon
              className="opacity-60 sm:-ms-1"
              size={16}
              aria-hidden="true"
            />
            <span className="max-sm:sr-only">Upgrade</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
