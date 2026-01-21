"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
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

export const description = "A multiple bar chart"

const chartData = [

    { month: "June", income: 214, expense: 140 },
    { month: "May", income: 209, expense: 130 },
    { month: "April", income: 73, expense: 190 },
    { month: "March", income: 237, expense: 120 },
    { month: "February", income: 305, expense: 200 },
    { month: "January", income: 186, expense: 80 },
]

const chartConfig = {
    income: {
        label: "Income",
        color: "#07f15d",
    },
    expense: {
        label: "Expense",
        color: "#ef4444",
    },
} satisfies ChartConfig

export function CompareExpense() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Bar Chart - Multiple</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                        <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
