import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ArrowUpRight, Menu, X } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/static/logo"
import { NavMenu } from "./nav-menu"
import { project } from "@/utils/project"

const links = [
  { href: "/", label: "Home" },
  { href: "#components", label: "Components" },
  { href: "#blog", label: "Blog" },
  { href: "#about", label: "About" },
]

const buttons = {
  primary: { label: "Register Now", link: "/sign-up" },
  secondary: { label: "Login", link: "/sign-in" },
}
const Navbar = () => {
  return (
    <div className="fixed top-0 h-16 w-full border-b bg-background px-6">
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link className="flex items-center gap-3" href="/">
            <Logo padding="6" />
            <span className="text-xl font-bold">{project.name}</span>
          </Link>
        </div>

        {/* Desktop navigation menu */}
        <div className="hidden md:flex">
          <NavMenu />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Link href="/sign-up">
              <Button>
                {buttons.primary.label}
                <ArrowUpRight />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button className="hidden sm:inline-flex" variant="secondary">
                {buttons.secondary.label}
              </Button>
            </Link>
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
