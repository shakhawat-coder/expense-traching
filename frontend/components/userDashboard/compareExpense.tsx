"use client"

import React, { useEffect, useState, useMemo, useCallback } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { expenseApi, incomeApi, type Expense, type Income } from "@/lib/api"

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
    // 1. Initialize state for expenses and incomes
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [incomes, setIncomes] = useState<Income[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // 2. Fetch data inside useEffect
    const fetchData = useCallback(async () => {
        try {
            const [expRes, incRes] = await Promise.all([
                expenseApi.getAll(),
                incomeApi.getAll(),
            ])

            if (expRes.success) setExpenses(expRes.data)
            if (incRes.success) setIncomes(incRes.data)

            console.log("Fetched expenses:", expRes.data)
            console.log("Fetched incomes:", incRes.data)
        } catch (error) {
            console.error("Error fetching comparison data:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
        const handleRefresh = () => fetchData();
        window.addEventListener('refresh-data', handleRefresh);
        return () => {
            window.removeEventListener('refresh-data', handleRefresh);
        };
    }, [fetchData])

    // 3. Process the raw data into monthly aggregates for the chart
    const { chartData, dateRangeLabel } = useMemo(() => {
        const today = new Date()
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1)
            return {
                name: d.toLocaleString("default", { month: "long" }),
                year: d.getFullYear(),
                key: `${d.toLocaleString("default", { month: "long" })} ${d.getFullYear()}`
            }
        })

        const dataMap: Record<string, { month: string; income: number; expense: number }> = {}

        last6Months.forEach((m) => {
            dataMap[m.key] = { month: m.name, income: 0, expense: 0 }
        })

        const getKey = (dateStr: string) => {
            const date = new Date(dateStr)
            return `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`
        }

        incomes.forEach((inc) => {
            const key = getKey(inc.date)
            if (dataMap[key]) {
                dataMap[key].income += Number(inc.amount)
            }
        })

        expenses.forEach((exp) => {
            const key = getKey(exp.date)
            if (dataMap[key]) {
                dataMap[key].expense += Number(exp.amount)
            }
        })

        const start = last6Months[0]
        const end = last6Months[last6Months.length - 1]

        return {
            chartData: last6Months.map(m => dataMap[m.key]),
            dateRangeLabel: `${start.name} ${start.year} - ${end.name} ${end.year}`
        }
    }, [expenses, incomes])

    if (isLoading) {
        return <div className="h-[300px] flex items-center justify-center">Loading comparison data...</div>
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Monthly Account Summary</CardTitle>
                <CardDescription>{dateRangeLabel}</CardDescription>
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