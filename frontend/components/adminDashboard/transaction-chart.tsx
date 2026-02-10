"use client"

import React, { useEffect, useState, useCallback, useMemo } from "react"
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
import { dashboardApi } from "@/lib/api"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const description = "An interactive bar chart showing daily transactions"

const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
];

const currentYearNum = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => (currentYearNum - i).toString());

const chartConfig = {
    transactions: {
        label: "Transactions",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function TransactionChart() {
    const [chartData, setChartData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState<string>((currentDate.getMonth() + 1).toString());
    const [selectedYear, setSelectedYear] = useState<string>(currentDate.getFullYear().toString());

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res: any = await dashboardApi.getAdminTransactionsTrend({
                month: selectedMonth,
                year: selectedYear
            });
            if (res.success) {
                setChartData(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch transaction trend data", error);
        } finally {
            setLoading(false);
        }
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        fetchData();

        // Listen for global refresh events
        const handleRefresh = () => fetchData();
        window.addEventListener('refresh-data', handleRefresh);

        return () => {
            window.removeEventListener('refresh-data', handleRefresh);
        };
    }, [fetchData]);

    const totalTransactions = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.transactions, 0)
    }, [chartData])

    return (
        <Card className="py-0">
            <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
                    <CardTitle>Daily Transactions Trend</CardTitle>
                    <CardDescription>
                        Showing daily transaction counts for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2 px-6 py-4">
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((month) => (
                                <SelectItem key={month.value} value={month.value}>
                                    {month.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                {loading ? (
                    <div className="flex items-center justify-center h-[250px] w-full">Loading...</div>
                ) : chartData.length > 0 ? (
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
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
                                        day: "numeric",
                                    })
                                }}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        className="w-[150px]"
                                        nameKey="transactions"
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })
                                        }}
                                    />
                                }
                            />
                            <Bar dataKey="transactions" fill="var(--color-transactions)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                ) : (
                    <div className="flex items-center justify-center h-[250px] w-full text-muted-foreground">
                        No transaction data for this period.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
