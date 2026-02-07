"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

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

interface ChartDataItem {
    date: string
    income: number
    expense: number
}

interface MonthlyExpenseClientProps {
    data: ChartDataItem[]
}

export function MonthlyExpenseClient({ data }: MonthlyExpenseClientProps) {
    const [timeRange, setTimeRange] = React.useState("90d")

    const filteredData = React.useMemo(() => {
        if (!data || data.length === 0) return [];

        const referenceDate = new Date();
        let daysToSubtract = 90
        if (timeRange === "30d") {
            daysToSubtract = 30
        } else if (timeRange === "7d") {
            daysToSubtract = 7
        }

        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)

        return data.filter((item) => {
            const date = new Date(item.date)
            return date >= startDate
        })
    }, [data, timeRange])

    return (
        <Card className="pt-0 border-none shadow-none">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row px-0">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Income vs Expense - Realtime</CardTitle>
                    <CardDescription>
                        Visualizing your financial flow based on real transactions
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="hidden w-40 rounded-lg sm:ml-auto sm:flex"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-0 pt-4 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-72 w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor={chartConfig.income.color}
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={chartConfig.income.color}
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor={chartConfig.expense.color}
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={chartConfig.expense.color}
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="expense"
                            type="natural"
                            fill="url(#fillExpense)"
                            stroke={chartConfig.expense.color}
                            stackId="a"
                        />
                        <Area
                            dataKey="income"
                            type="natural"
                            fill="url(#fillIncome)"
                            stroke={chartConfig.income.color}
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
