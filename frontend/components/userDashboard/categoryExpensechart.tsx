"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

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

export const description = "A pie chart showing expenses by category"

const chartData = [
    { category: "food", amount: 275, fill: "var(--color-food)" },
    { category: "rent", amount: 800, fill: "var(--color-rent)" },
    { category: "utilities", amount: 150, fill: "var(--color-utilities)" },
    { category: "transport", amount: 120, fill: "var(--color-transport)" },
    { category: "other", amount: 90, fill: "var(--color-other)" },
]

const chartConfig = {
    amount: {
        label: "Amount",
    },
    food: {
        label: "Food",
        color: "var(--chart-1)",
    },
    rent: {
        label: "Rent",
        color: "var(--chart-2)",
    },
    utilities: {
        label: "Utilities",
        color: "var(--chart-3)",
    },
    transport: {
        label: "Transport",
        color: "var(--chart-5)",
    },
    other: {
        label: "Other",
        color: "var(--chart-4)",
    },
} satisfies ChartConfig

export function CategoryExpenseChart() {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="items-center pb-0">
                <CardTitle>Expense by Category</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-62"
                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="amount" hideLabel />}
                        />
                        <Pie data={chartData} dataKey="amount" nameKey="category">
                            <LabelList
                                dataKey="category"
                                className="fill-background"
                                stroke="none"
                                fontSize={12}
                                formatter={(value: keyof typeof chartConfig) =>
                                    chartConfig[value]?.label
                                }
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
