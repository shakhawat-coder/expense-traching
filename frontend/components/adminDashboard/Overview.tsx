'use client'
import React from 'react'
import SummaryCard from '../userDashboard/dashboardCommon/summaryCard'
import { dashboardApi } from '@/lib/api'

interface AdminSummary {
    totalUsers: number;
    totalTransactions: number;
    todaysTransactions: number;
    todaysJoinUser: number;
}

export default function Overview() {
    const [summary, setSummary] = React.useState<AdminSummary | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response: any = await dashboardApi.getAdminSummary();
                if (response.success) {
                    setSummary(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch admin summary:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // You might want to replace this with a skeleton loader later
    }

    if (!summary) {
        return <div>Failed to load summary.</div>;
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
                title="Total Users"
                amount={summary.totalUsers.toString()}
                linkHref="#"
            />
            <SummaryCard
                title="Total Transactions"
                amount={summary.totalTransactions.toString()}
                linkHref="#"
            />
            <SummaryCard
                title="Today's Transactions"
                amount={summary.todaysTransactions.toString()}
                linkHref="#"
            />
            <SummaryCard
                title="Today's Joined Users"
                amount={summary.todaysJoinUser.toString()}
                linkHref="#"
            />
        </div>
    )
}