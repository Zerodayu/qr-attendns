import { AppSidebar } from "@/components/app-sidebar"
import { ClassCode } from "@/components/class-code"
import MiniCal from "@/components/mini-cal"
import { ChartPieDonutText } from "@/components/pie-chart"
import {
  RelativeTime,
  RelativeTimeZoneDate,
  RelativeTimeZoneDisplay,
} from "@/components/static/time"
import { Badge, badgeVariants, type BadgeVariant } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BadgeInfo,
  CalendarCheck,
  CircleCheck,
  ClipboardClock,
  Ticket,
  UsersRound,
} from "lucide-react"

export default function Page() {
  const cardDatas = {
    totalStudents: {
      label: "Total Students",
      totalCount: 26,
      icon: "icon",
      desc: "Total Students for {section}",
      footer: "niceeee",
    },

    totalPresent: {
      label: "Present Today",
      totalCount: 24,
      icon: ":)",
      desc: "Total Present for todays attendance",
      footer: "niceeee",
    },

    totalAbsent: {
      label: "Any Absents?",
      totalCount: 2,
      icon: ":(",
      desc: "Why is there abesents today?",
      footer: "niceeee",
    },

    genders: {
      label: "Total Students",
      totalCount: 26,
      male: 16,
      female: 10,
      icon: "icon",
      desc: "Total Students for {section}",
      footer: "niceeee",
    },
  }

  const users: User[] = [
    {
      id: "1",
      name: "Alice Johnson",
      gender: "Female",
      timein: true,
      timeout: true,
    },
    {
      id: "2",
      name: "Bruno Silva",
      gender: "Male",
      timein: false,
      timeout: true,
    },
    {
      id: "3",
      name: "Clara Mendes",
      gender: "Female",
      timein: true,
      timeout: false,
    },
  ]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Build Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex w-full flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid gap-4 md:grid-cols-1">
            <section className="flex flex-col gap-4 lg:flex-row">
              <div className="flex w-full flex-col items-center justify-center gap-4 rounded-4xl bg-card p-4 py-6 shadow-md ring-1 ring-foreground/10">
                <RelativeTime
                  timeFormatOptions={{ hour: "2-digit", minute: "2-digit" }}
                  dateFormatOptions={{ weekday: "short" }}
                >
                  <span className="flex text-4xl font-bold text-foreground">
                    <RelativeTimeZoneDisplay />
                    <Separator orientation="vertical" className="mx-4" />{" "}
                    <RelativeTimeZoneDate />
                  </span>
                </RelativeTime>
                <MiniCal />
              </div>

              <div className="flex w-full flex-col items-center justify-center gap-4 rounded-4xl bg-card py-6 shadow-md ring-1 ring-foreground/10">
                <div className="flex w-full items-center justify-center gap-4">
                  <span className="relative rounded-r-full bg-primary px-6 py-2">
                    <CalendarCheck />
                  </span>
                  <span className="flex w-full justify-start text-2xl font-bold">
                    Total Attendance Today
                  </span>
                </div>
                <div className="flex w-full items-center justify-center gap-4 px-6">
                  <div className="flex justify-start">
                    <span className="text-4xl font-bold text-primary">16</span>
                    <span className="font-semibold">/22</span>
                  </div>
                  <Progress value={75} className="w-full" />
                </div>
                <span className="w-full px-4 text-start text-muted-foreground italic">
                  — Present Students in Total
                </span>
              </div>

              <div className="flex w-full flex-col items-center justify-center gap-4 rounded-4xl bg-card py-6 shadow-md ring-1 ring-foreground/10">
                <div className="flex w-full items-center justify-center gap-4">
                  <span className="relative rounded-r-full bg-primary px-6 py-2">
                    <Ticket />
                  </span>
                  <span className="flex w-full justify-start text-2xl font-bold">
                    Class Code
                  </span>
                </div>
                <div className="flex w-full flex-col items-center justify-center gap-4 px-4">
                  <ClassCode defaultValue="ClassCode" />
                  <span className="w-full px-4 text-start text-muted-foreground italic">
                    — Use this to invite Parents on your class
                  </span>
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-[1fr_1.5fr]">
              <div className="grid grid-cols-1 gap-4">
                <ChartPieDonutText
                  sectionName="Testing"
                  maleCount={12}
                  femaleCount={14}
                />
                <CardSection
                  label={cardDatas.totalStudents.label}
                  title={cardDatas.totalStudents.totalCount}
                  labelIcon={<BadgeInfo />}
                  icon={<UsersRound />}
                  desc={cardDatas.totalStudents.desc}
                  footer={cardDatas.totalStudents.footer}
                />
              </div>
              <div className="col-span-1.5 grid">
                <TableSection users={users} />
              </div>
            </section>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

const CardSection = ({
  label,
  title,
  labelIcon,
  icon,
  desc,
  footer,
}: {
  label: string
  title: number
  labelIcon: React.ReactNode
  icon: React.ReactNode
  desc: string
  footer: string
}) => {
  return (
    <Card className="@container/card justify-between border-muted-foreground">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="grid grid-cols-1 items-center justify-center gap-2 py-12 text-center text-2xl font-semibold text-primary tabular-nums outline-2 @[250px]/card:text-4xl">
          <span className="flex items-center justify-center gap-2 self-center">
            {icon}
            {title}
          </span>
        </CardTitle>
        <CardAction className="text-muted-foreground">{labelIcon}</CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">{desc}</div>
        <div className="text-muted-foreground">{footer}</div>
      </CardFooter>
    </Card>
  )
}

type User = {
  id: string
  name: string
  gender: string
  timein?: boolean
  timeout?: boolean
}
type userProps = { users: User[] }
const TableSection = ({ users }: userProps) => {
  return (
    <Card>
      <CardHeader className="pl-0">
        <CardTitle className="flex w-full items-center justify-center gap-4 px-0 text-2xl font-bold">
          <span className="relative rounded-r-full bg-primary px-6 py-2">
            <ClipboardClock />
          </span>
          <span className="flex w-full justify-start text-2xl font-bold">
            Quick Attendance View
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="w-full" isHoverable={false} variant="striped">
          <TableCaption className="sr-only">
            Table with row over disabled (isHoverable=false).
          </TableCaption>
          <TableHeader>
            <TableRow className="font-bold">
              <TableHead className="underline underline-offset-4">
                Name
              </TableHead>
              <TableHead className="text-center underline underline-offset-4">
                Gender
              </TableHead>
              <TableHead className="text-center underline underline-offset-4">
                Timed-in
              </TableHead>
              <TableHead className="text-center underline underline-offset-4">
                Timed-out
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="pr-8 font-semibold">
                  {user.name}
                </TableCell>
                <TableCell
                  className={`text-center ${user.gender === "Male" ? "text-chart-1" : "text-chart-5"}`}
                >
                  {user.gender}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    size="lg"
                    variant={user.timein ? "success" : "outline"}
                  >
                    {user.timein ? (
                      <>
                        <CircleCheck />
                        Timed-in
                      </>
                    ) : (
                      "—"
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    size="lg"
                    variant={user.timeout ? "success" : "outline"}
                  >
                    {user.timeout ? (
                      <>
                        <CircleCheck />
                        Timed-out
                      </>
                    ) : (
                      "—"
                    )}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
