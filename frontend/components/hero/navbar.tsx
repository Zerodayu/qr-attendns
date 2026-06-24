import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ArrowUpRight, LogIn, LogInIcon, Menu, X } from "lucide-react"
import Link from "next/link"
import { NavMenu } from "./nav-menu"
import { project } from "@/utils/project"
import Image from "next/image"
import { Separator } from "../ui/separator"

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
    <div className="fixed top-0 h-16 w-full border-b bg-background/50 px-6 backdrop-blur-md">
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link className="flex items-center gap-3" href="/">
            <Image
              src={project.icon.src}
              height={project.icon.heigth}
              width={project.icon.width}
              alt={project.icon.alt}
            />
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
              <Button className="hidden sm:inline-flex">
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
              className="h-fit w-fit animate-none! items-end overflow-hidden border-none bg-background/50 backdrop-blur-md transition-all duration-300"
              sideOffset={20}
            >
              <div className="flex w-full flex-col items-end gap-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    // className="flex w-full rounded-3xl p-3 text-end text-xl font-medium transition-all hover:bg-secondary/50"
                  >
                    <Button variant="link" className="text-xl text-foreground">
                      {link.label}
                    </Button>
                  </Link>
                ))}
                <Separator />
                <Link href="/sign-in" className="w-full">
                  <Button className="w-full font-bold" size="lg">
                    {buttons.secondary.label}
                    <LogIn />
                  </Button>
                </Link>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
