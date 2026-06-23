import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo01, Logo02, Logo03, Logo04 } from "@/components/static/logos"
import Navbar from "./navbar"
import Link from "next/link"

const Hero = () => {
  const buttons = {
    primary: { label: "Create Account Now!", link: "/sign-up" },
    secondary: { label: "Learn More", link: "/" },
  }

  return (
    <div>
      <Navbar />

      <div className="mx-auto flex h-screen max-w-5xl flex-col items-center justify-center px-6 py-12 text-center">
        <h2 className="text-4xl leading-[1.4] font-medium tracking-tighter text-balance sm:text-5xl md:text-6xl lg:text-7xl">
          Beautifully Designed{" "}
          <span className="inline-block rounded-md bg-primary px-1.5 py-0.5 leading-[1.1] tracking-tight text-primary-foreground sm:rounded-lg sm:px-3.5">
            Premium
          </span>{" "}
          Shadcn Blocks
        </h2>
        <p className="mt-6 text-center text-xl tracking-[-0.01em] text-balance text-muted-foreground sm:text-2xl sm:leading-normal md:text-3xl">
          A collection of beautifully designed components that you can use to
          build your next project.
        </p>
        <div className="mx-auto mt-10 flex w-full max-w-xs flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href={buttons.primary.link}>
            <Button className="w-full sm:w-auto" size="lg">
              {buttons.primary.label}
              <ArrowUpRight />
            </Button>
          </Link>
          <Link href={buttons.secondary.link}>
            <Button className="w-full sm:w-auto" size="lg" variant="outline">
              {buttons.secondary.label}
            </Button>
          </Link>
        </div>

        <div className="mt-24 flex flex-col items-center gap-4">
          <p className="text-sm font-medium text-muted-foreground uppercase">
            Trusted by engineers at
          </p>
          <div className="mx-auto mt-4 grid max-w-5xl grid-cols-2 place-items-center gap-6 text-foreground/70 sm:grid-cols-3 sm:gap-x-10 sm:gap-y-12 md:grid-cols-4">
            <Logo01 className="h-7 sm:h-8" />
            <Logo02 className="h-7 sm:h-8" />
            <Logo03 className="h-7 sm:h-8" />
            <Logo04 className="h-7 sm:h-8" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
