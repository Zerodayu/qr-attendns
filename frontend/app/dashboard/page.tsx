import { AppSidebar } from "@/components/app-sidebar"
import { ClassCode } from "@/components/class-code"
import MiniCal from "@/components/mini-cal"
import { ChartPieDonutText } from "@/components/pie-chart"
import {
  RelativeTime,
  RelativeTimeZoneDate,
  RelativeTimeZoneDisplay,
} from "@/components/static/time"
import { Badge } from "@/components/ui/badge"
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
  CardContent,
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
  CalendarCheck,
  CircleCheck,
  LucideIcon,
  PenLine,
  Ticket,
} from "lucide-react"

export default function Page() {
  const males = 16
  const females = 10
  const totalStudents = males + females

  const classData = {
    classCode: "sectionCodes",
    section: "Grade 1: Magic",
    students: { males, females },
    totalStudents,
    presents: totalStudents - 6,
  }

  const studentList = [
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
            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <CardSection className="flex flex-col items-center justify-center">
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
              </CardSection>

              <CardSection
                title="Total Attendance Today"
                LabelIcon={CalendarCheck}
              >
                <div className="flex w-full items-center justify-center gap-4 px-6">
                  <div className="flex justify-start">
                    <span className="text-4xl font-bold text-primary">
                      {classData.presents}
                    </span>
                    <span className="mt-1 font-semibold">
                      /{classData.totalStudents}
                    </span>
                  </div>
                  <Progress
                    value={classData.presents}
                    max={classData.totalStudents}
                    className="w-full"
                  />
                </div>
                <CardFooter className="pt-4">
                  <span className="w-full px-4 text-start text-muted-foreground italic">
                    — Present Students in Total
                  </span>
                </CardFooter>
              </CardSection>

              <CardSection title="Class Code" LabelIcon={Ticket}>
                <ClassCode defaultValue={classData.classCode} />
                <CardFooter className="pt-4">
                  <span className="w-full text-start text-muted-foreground italic">
                    — Use this to invite Parents on your class
                  </span>
                </CardFooter>
              </CardSection>
            </section>

            <section className="grid gap-4 md:grid-cols-[1fr_1.5fr]">
              <div className="grid grid-cols-1 gap-4">
                <ChartPieDonutText
                  sectionName={classData.section}
                  maleCount={classData.students.males}
                  femaleCount={classData.students.females}
                />
                <CardSection title="Extra">
                  <p>content heree</p>
                </CardSection>
              </div>
              <div className="col-span-1.5 grid">
                <CardSection title="Quick Attendance View" LabelIcon={PenLine}>
                  {" "}
                  <TableSection users={studentList} />
                </CardSection>
              </div>
            </section>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

const CardSection = ({
  title,
  LabelIcon,
  children,
  className,
}: {
  title?: string
  LabelIcon?: LucideIcon
  children: React.ReactNode
  className?: string
}) => {
  return (
    <Card className="flex-1">
      <CardHeader className="pl-0">
        <CardTitle className="flex w-full items-center justify-center gap-4 px-0 text-2xl font-bold">
          <span
            className={`relative rounded-r-full bg-primary ${LabelIcon ? "px-6 py-2" : "px-0 py-0"}`}
          >
            {LabelIcon && <LabelIcon />}
          </span>
          <span className="flex w-full justify-start text-2xl font-bold">
            {title}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className={className}>{children}</CardContent>
    </Card>
  )
}

const TableSection = ({
  users,
}: {
  users: {
    id: string
    name: string
    gender: string
    timein?: boolean
    timeout?: boolean
  }[]
}) => {
  return (
    <Table className="w-full" isHoverable={false} variant="striped">
      <TableCaption className="sr-only">
        Table with row over disabled (isHoverable=false).
      </TableCaption>
      <TableHeader>
        <TableRow className="font-bold">
          <TableHead className="underline underline-offset-4">Name</TableHead>
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
            <TableCell className="pr-8 font-semibold">{user.name}</TableCell>
            <TableCell
              className={`text-center ${user.gender === "Male" ? "text-chart-1" : "text-chart-5"}`}
            >
              {user.gender}
            </TableCell>
            <TableCell className="text-center">
              <Badge size="lg" variant={user.timein ? "success" : "outline"}>
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
              <Badge size="lg" variant={user.timeout ? "success" : "outline"}>
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
  )
}
