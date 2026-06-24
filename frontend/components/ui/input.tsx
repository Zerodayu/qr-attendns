"use client"

import { FieldInput } from "@ark-ui/react/field"
import type React from "react"
import { tv, type VariantProps } from "tailwind-variants"
import { cn } from "@/lib/utils"

export const inputVariants = tv({
  base: [
    "peer",
    "w-full min-w-0",
    "px-3 py-1",
    "bg-input/50",
    "text-base md:text-sm",
    "rounded-3xl border border-transparent",
    "placeholder:text-muted-foreground",
    "file:inline-flex file:h-7 file:items-center file:border-0 file:bg-transparent",
    "file:font-medium file:text-foreground file:text-sm",
    "transition-[color,box-shadow,background-color]",
    "outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "motion-reduce:transition-none!",
  ],
  variants: {
    size: {
      sm: ["h-7"],
      md: ["h-9"],
      lg: ["h-10"],
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export interface InputProps
  extends
    Omit<React.ComponentProps<typeof FieldInput>, "size">,
    VariantProps<typeof inputVariants> {}

export const Input = (props: InputProps) => {
  const { size = "md", type = "text", className, ...rest } = props

  return (
    <FieldInput
      className={cn(inputVariants({ size }), className)}
      data-size={size}
      data-slot="input"
      type={type}
      {...rest}
    />
  )
}
