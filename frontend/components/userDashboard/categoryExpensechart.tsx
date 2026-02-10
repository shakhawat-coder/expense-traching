"use client"

import React, { useEffect, useState, useCallback } from "react"
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
import { dashboardApi } from "@/lib/api"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const description = "A pie chart showing expenses by category"

export function CategoryExpenseChart() {
    const [chartData, setChartData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState<string>((currentDate.getMonth() + 1).toString());
    const [selectedYear, setSelectedYear] = useState<string>(currentDate.getFullYear().toString());

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res: any = await dashboardApi.getCategoryWiseExpense({
                month: selectedMonth,
                year: selectedYear
            });
            if (res.success) {
                setChartData(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch category expense data", error);
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

    const chartConfig = {
        amount: {
            label: "Amount",
        },
        // Dynamically add categories if needed, but for now we rely on the data key
    } satisfies ChartConfig

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

    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="items-center pb-0">
                <div className="flex justify-between items-center w-full mb-4">
                    <CardTitle>Expense by Category</CardTitle>
                    <div className="flex gap-2">
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
                </div>
                <CardDescription>
                    {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {loading ? (
                    <div className="flex items-center justify-center h-full">Loading...</div>
                ) : chartData.length > 0 ? (
                    <ChartContainer
                        config={chartConfig}
                        className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[300px]"
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
                                        chartConfig[value]?.label || value
                                    }
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                ) : (
                    <div className="flex items-center justify-center h-full py-10 text-muted-foreground">
                        No expense data for this period.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
