"use client"
import React, { useEffect, useState } from 'react'
import SummaryCard from './dashboardCommon/summaryCard'
import { dashboardApi } from '@/lib/api'

export default function ExpenseSummary() {
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response: any = await dashboardApi.getSummary();
                if (response.success) {
                    setSummary(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch summary:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (loading) {
        return <div className="grid grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>)}
        </div>
    }

    const summaryData = [
        {
            title: 'Total Income',
            amount: `$${summary?.totalIncome?.toFixed(2) || '0.00'}`,
            linkHref: '/dashboard/income',
            linkText: 'View Income Details'
        },
        {
            title: 'Total Expenses',
            amount: `$${summary?.totalExpenses?.toFixed(2) || '0.00'}`,
            linkHref: '/dashboard/expense-history',
            linkText: 'View Expense Details'
        },
        {
            title: 'Total Savings',
            amount: `$${summary?.totalSavings?.toFixed(2) || '0.00'}`,
            linkHref: '/dashboard/savings',
            linkText: 'View Savings Details'
        },
        {
            title: 'This Month',
            amount: `$${summary?.thisMonthExpenses?.toFixed(2) || '0.00'}`,
            linkHref: '/dashboard/analytics',
            linkText: 'View Monthly Details'
        }
    ]

    return (
        <div>
            <div className="grid grid-cols-4 gap-4">
                {summaryData.map((card, index) => (
                    <SummaryCard
                        key={index}
                        title={card.title}
                        amount={card.amount}
                        linkHref={card.linkHref}
                        linkText={card.linkText}
                    />
                ))}
            </div>
        </div>
    )
}
