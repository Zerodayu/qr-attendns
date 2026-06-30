"use client";

import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
} from "@/components/static/mini-calendar";

const MiniCal = () => (
  <div className="flex w-full items-center gap-4">
    <MiniCalendar className="pointer-events-none flex w-full flex-1 items-center gap-4 px-4">
      <MiniCalendarDays className="flex w-full flex-1 items-center justify-center">
        {(date) => <MiniCalendarDay date={date} key={date.toISOString()} />}
      </MiniCalendarDays>
    </MiniCalendar>
  </div>
);

export default MiniCal;
