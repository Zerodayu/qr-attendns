"use client"

import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
} from "@/components/static/mini-calendar"
import { RelativeTime, RelativeTimeZoneDisplay } from "./static/time"
import { Separator } from "./ui/separator"
import { Calendar } from "lucide-react"

const MiniCal = () => {
  return (
    <div className="flex items-center gap-4">
      <MiniCalendar className="pointer-events-none gap-4 px-4">
        <Calendar />
        <RelativeTime
          timeFormatOptions={{ hour: "2-digit", minute: "2-digit" }}
        >
          <RelativeTimeZoneDisplay className="text-2xl font-bold" />
        </RelativeTime>
        <Separator orientation="vertical" />
        <MiniCalendarDays>
          {(date) => <MiniCalendarDay date={date} key={date.toISOString()} />}
        </MiniCalendarDays>
      </MiniCalendar>
    </div>
  )
}

export default MiniCal
