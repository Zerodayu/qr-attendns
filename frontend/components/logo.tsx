import { Clover } from "lucide-react"

interface LogoProps {
  size?: number
  padding?: string
}

export const Logo = ({ size = 32, padding = "p-4" }: LogoProps) => {
  return (
    <span className={`rounded-full bg-foreground text-background ${padding}`}>
      <Clover absoluteStrokeWidth strokeWidth={2.5} size={size} />
    </span>
  )
}
