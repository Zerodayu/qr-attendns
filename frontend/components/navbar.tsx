import { ArrowUpRight, Menu, Wheat, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { NavMenu } from "./nav-menu"

const links = [
  { href: "/", label: "Home" },
  { href: "#components", label: "Components" },
  { href: "#blog", label: "Blog" },
  { href: "#about", label: "About" },
]

const buttons = {
  primary: "Get Started",
  secondary: "Login",
}

const Navbar = () => {
  return (
    <div className="fixed top-0 h-16 w-full border-b bg-background px-6">
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link className="flex items-center gap-3" href="/">
            <Wheat />
            <span className="text-xl font-bold">Bloxxee</span>
          </Link>
        </div>

        {/* Desktop navigation menu */}
        <div className="hidden md:flex">
          <NavMenu />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button>
              {buttons.primary}
              <ArrowUpRight />
            </Button>
            <Button className="hidden sm:inline-flex" variant="secondary">
              {buttons.secondary}
            </Button>
          </div>

          {/* Mobile navigation menu */}
          <Popover>
            <PopoverTrigger className="group md:hidden">
              <Menu className="group-data-[state=open]:hidden" />
              <X className="hidden group-data-[state=open]:block" />
            </PopoverTrigger>
            <PopoverContent
              className="h-[calc(100svh-4rem)] w-screen animate-none! rounded-none border-none bg-background"
              sideOffset={20}
            >
              <div className="flex flex-col gap-4 p-6">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-3xl p-3 text-xl font-medium transition-all hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
