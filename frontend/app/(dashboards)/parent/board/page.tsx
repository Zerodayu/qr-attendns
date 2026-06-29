"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import UserAvatar from "boring-avatars"
import {
  BadgeCheckIcon,
  BellIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LogOutIcon,
  SparklesIcon,
} from "lucide-react"
import Link from "next/link"

const user = {
  name: "testUser",
  email: "testuser@email.com",
  avatar: "avatar",
}

const studentLists = [
  {
    id: "1",
    name: "Alex Johnson",
  },
  {
    id: "2",
    name: "Sarah Chen",
  },
]

const navsLink = [
  {
    label: "Home",
    icon: "icon",
    url: "#home",
  },
  {
    label: "Settings",
    icon: "icon",
    url: "#settings",
  },
]

export default function ParentBoard() {
  return (
    <section className="flex h-screen w-full flex-col items-center gap-4 p-4">
      <Navs navs={navsLink} />

      <section className="h-screen w-full border-2">
        {" "}
        blank for now{" "}
        <UserAvatar
          name={user.name}
          size="100%"
          variant="marble"
          className="object-fill"
        />
      </section>
    </section>
  )
}

const Navs = ({
  className,
  navs = [],
}: {
  className?: string
  navs: { label: string; icon: React.ReactNode; url: string }[]
}) => {
  return (
    <div className="fixed top-auto bottom-4 flex w-full flex-col items-center justify-between gap-2 px-4 transition-all duration-500 sm:w-lg">
      <SelectStudent
        students={studentLists}
        label="Choose a student"
        onValueChange={(student) => console.log("Selected:", student)}
      />
      <nav
        className={`${className} flex w-full items-center justify-evenly gap-6 rounded-t-xl rounded-b-4xl bg-accent/70 p-4 backdrop-blur-md`}
      >
        {navs.map((nav) => (
          <Link key={nav.label} href={nav.url}>
            {nav.label}
          </Link>
        ))}
        <Separator orientation="vertical" />
        <UserButton username={user.name} email={user.email} />
      </nav>
    </div>
  )
}

const UserButton = ({
  username,
  email,
  avatar,
}: {
  username: string
  email: string
  avatar?: string
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <div className="flex cursor-pointer items-center gap-2 rounded-full bg-secondary/50 p-2 hover:bg-secondary/70 aria-expanded:bg-secondary/70">
            <Avatar className="p-0">
              <AvatarImage src={avatar} alt={username} />
              <AvatarFallback className="p-0 [&_svg]:size-full">
                <UserAvatar
                  name={username}
                  size="100%"
                  variant="marble"
                  className="object-fill"
                />
              </AvatarFallback>
            </Avatar>
            <div className="hidden flex-1 text-left text-sm leading-tight md:grid">
              <span className="truncate font-medium">{username}</span>
              <span className="truncate text-xs">{email}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </div>
        }
      />
      <DropdownMenuContent
        className="w-fit transition-all duration-500"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left">
              <Avatar>
                <AvatarImage src={avatar} alt={username} />
                <AvatarFallback className="p-0 [&_svg]:size-full">
                  <UserAvatar
                    name={username}
                    size="100%"
                    variant="marble"
                    className="object-fill"
                  />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{username}</span>
                <span className="truncate text-xs">{email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <SparklesIcon />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheckIcon />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCardIcon />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BellIcon />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const SelectStudent = ({
  students,
  defaultValue,
  onValueChange,
  label = "Select a student",
}: {
  students: { id: string; name: string; avatar?: string; initials?: string }[]
  defaultValue?: {
    id: string
    name: string
    avatar?: string
    initials?: string
  }
  onValueChange?: (
    value: {
      id: string
      name: string
      avatar?: string
      initials?: string
    } | null
  ) => void
  label?: string
}) => {
  return (
    <Field className="w-full">
      <Select
        defaultValue={defaultValue ?? students[0]}
        items={students.map((s) => ({ label: s.name, value: s }))}
        onValueChange={onValueChange}
      >
        <SelectTrigger className="text-md rounded-b-xl bg-accent/70 py-6 font-semibold backdrop-blur-md">
          <SelectValue>
            {(item: (typeof students)[number]) => (
              <span className="flex items-center gap-2">
                <UserAvatar name={item.name} variant="beam" />
                <span>{item?.name}</span>
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {students.map((student) => (
              <SelectItem key={student.id} value={student}>
                <span className="flex items-center gap-2">
                  <UserAvatar name={student.name} variant="beam" size="6" />
                  <span>{student.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
