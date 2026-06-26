"use client"

import { ChartBarBig } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Badge } from "./ui/badge"
import { Status } from "./ui/status"

export const description = "A donut chart with text"

export function ChartPieDonutText({
  maleCount = 0,
  femaleCount = 0,
  total = maleCount + femaleCount,
  sectionName = "NONE",
}: {
  maleCount: number
  femaleCount: number
  total?: number
  sectionName: string
}) {
  const chartData = [
    { gender: "male", total: maleCount, fill: "var(--color-male)" },
    { gender: "female", total: femaleCount, fill: "var(--color-female)" },
  ]

  const chartConfig = {
    total: {
      label: "Students",
    },
    male: {
      label: "Male",
      color: "var(--chart-2)",
    },
    female: {
      label: "Female",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col">
      <CardHeader className="pl-0">
        <CardTitle className="flex w-full items-center justify-center gap-4 px-0 text-2xl font-bold">
          <span className="relative rounded-r-full bg-primary px-6 py-2">
            <ChartBarBig />
          </span>
          <span className="flex w-full justify-start text-2xl font-bold">
            Total Students
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-60"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="total"
              nameKey="gender"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Students
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          <Badge variant="outline">
            <Status className="bg-chart-1" />
            Male — {maleCount}
          </Badge>
          <Badge variant="outline">
            <Status className="bg-chart-5" />
            Female — {femaleCount}
          </Badge>
        </div>
        <div className="leading-none text-muted-foreground">
          Total Students of section{" "}
          <span className="font-bold underline underline-offset-4">
            {sectionName}
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
