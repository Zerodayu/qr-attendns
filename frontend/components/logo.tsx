import { Clover } from "lucide-react"

export const Logo = () => {
  return (
    <span className="rounded-full bg-foreground p-4 text-background">
      <Clover absoluteStrokeWidth={true} strokeWidth={2.5} size={32} />
    </span>
  )
}
