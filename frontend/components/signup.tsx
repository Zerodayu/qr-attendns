"use client"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useSessionStore } from "@/stores/session"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { FacebookLogo, GoogleLogo } from "./logos"
import { SelectDropdown } from "./select-dropdown"

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
})

const Signup = () => {
  const router = useRouter()
  const signIn = useSessionStore((s) => s.signIn)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setPending(true)
    setError(null)
    await signIn(data)
    const session = useSessionStore.getState().session
    if (session) {
      router.push("/dashboard")
    } else {
      setError(useSessionStore.getState().error ?? "Sign in failed")
    }
    setPending(false)
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex h-full w-full">
        <div className="relative hidden w-full max-w-3xl grow border-l bg-muted lg:block">
          <Image
            fill
            alt="Login"
            className="absolute inset-0 size-full object-cover"
            src="/ascii-art.png"
          />
        </div>
        <div className="outline-offset-0.5 relative m-auto flex w-full max-w-sm flex-col items-center p-8 outline-0 outline-border/40 sm:outline-2 dark:outline-border/80">
          <div className="absolute inset-x-0 top-0 w-[calc(100%+4rem)] -translate-x-8 border-t max-sm:hidden" />
          <div className="absolute inset-x-0 bottom-0 w-[calc(100%+4rem)] -translate-x-8 border-b max-sm:hidden" />
          <div className="absolute inset-y-0 left-0 h-[calc(100%+4rem)] -translate-y-8 border-s max-sm:hidden" />
          <div className="absolute inset-y-0 right-0 h-[calc(100%+4rem)] -translate-y-8 border-e max-sm:hidden" />

          <div className="absolute inset-x-0 -top-1 w-[calc(100%+3rem)] -translate-x-6 border-t max-sm:hidden" />
          <div className="absolute inset-x-0 -bottom-1 w-[calc(100%+3rem)] -translate-x-6 border-b max-sm:hidden" />
          <div className="absolute inset-y-0 -left-1 h-[calc(100%+3rem)] -translate-y-6 border-s max-sm:hidden" />
          <div className="absolute inset-y-0 -right-1 h-[calc(100%+3rem)] -translate-y-6 border-e max-sm:hidden" />

          <Logo />
          <p className="mt-4 text-xl font-medium">
            Create an Account to QR Attendnz
          </p>

          {error && (
            <p className="mb-2 w-full text-center text-sm text-destructive">
              {error}
            </p>
          )}

          <form
            className="w-full space-y-4 pt-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Field>
              <FieldLabel>Role</FieldLabel>
              <SelectDropdown />
            </Field>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                    placeholder="example@email.com"
                    type="email"
                    {...field}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                    placeholder="Password"
                    type="password"
                    {...field}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Button className="mt-4 w-full" disabled={pending} type="submit">
              {pending ? "Signing in..." : "Continue with Email"}
            </Button>
          </form>

          <div className="my-7 flex w-full items-center justify-center overflow-hidden">
            <Separator />
            <span className="px-2 text-sm">OR</span>
            <Separator />
          </div>

          <div className="grid w-full grid-cols-2 gap-2">
            <Button className="w-full gap-3" disabled={pending}>
              <GoogleLogo />
              with Google
            </Button>

            <Button className="w-full gap-3" disabled={pending}>
              <FacebookLogo />
              with Facebook
            </Button>
          </div>

          <div className="mt-5 space-y-5">
            <p className="text-center text-sm">
              Already have an account?
              <Link
                className="ml-1 text-muted-foreground underline"
                href="/sign-in"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
