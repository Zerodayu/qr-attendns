import { AppSidebar } from "@/components/app-sidebar"
import MiniCal from "@/components/mini-cal"
import { ChartPieDonutText } from "@/components/pie-chart"
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  BadgeInfo,
  ThumbsDown,
  ThumbsUp,
  UserCheck,
  UsersRound,
  UserX,
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
          <div className="flex w-full items-center justify-center">
            <MiniCal />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <ChartPieDonutText />
            <CardSection
              label={cardDatas.totalStudents.label}
              title={cardDatas.totalStudents.totalCount}
              labelIcon={<BadgeInfo />}
              icon={<UsersRound />}
              desc={cardDatas.totalStudents.desc}
              footer={cardDatas.totalStudents.footer}
            />

            <CardSection
              label={cardDatas.totalPresent.label}
              title={cardDatas.totalPresent.totalCount}
              labelIcon={<ThumbsUp />}
              icon={<UserCheck />}
              desc={cardDatas.totalPresent.desc}
              footer={cardDatas.totalPresent.footer}
            />

            <CardSection
              label={cardDatas.totalAbsent.label}
              title={cardDatas.totalAbsent.totalCount}
              labelIcon={<ThumbsDown />}
              icon={<UserX />}
              desc={cardDatas.totalAbsent.desc}
              footer={cardDatas.totalAbsent.footer}
            />
          </div>
          <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
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
