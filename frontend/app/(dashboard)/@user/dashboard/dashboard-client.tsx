"use client"
import Link from 'next/link'
import React from 'react'
import ExpenseSummary from '@/components/userDashboard/expenseSummary'
import ExpenseHistory from '@/components/userDashboard/expenseHistory'
import MonthlyExpense from '@/components/userDashboard/expense-chart'
import { CompareExpense } from '@/components/userDashboard/compareExpense'
import { CategoryExpenseChart } from '@/components/userDashboard/categoryExpensechart'

interface DashboardClientProps {
    user: {
        name: string
    } | null
}

export default function DashboardClient({ user }: DashboardClientProps) {
    return (
        <>
            <div className='text-center mb-12'>
                <h2 className="text-3xl font-bold">Welcome Back <span className="text-blue-700">{user?.name || 'Guest'}</span>!</h2>
                <p className="mt-2 text-gray-600">Here's a summary of your dashboard.</p>
            </div>

            <ExpenseSummary />

            {/* ===========recent transaction table=========== */}
            <div>
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold mb-4 mt-10">Recent Transactions</h3>
                    <Link href="/dashboard/expense-history" className="text-blue-600 hover:underline">View All</Link>
                </div>
                <ExpenseHistory />
            </div>

            {/* ==============chart section=========== */}
            <div className="my-10">
                <h3 className="text-xl font-semibold mb-4">Income & Expense Overview</h3>
                <MonthlyExpense />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-xl font-semibold mb-4">Income vs Expense</h3>
                    <CompareExpense />
                </div>
                <div className='h-full'>
                    <h3 className="text-xl font-semibold mb-4">Categorywise Monthly Expense</h3>
                    <CategoryExpenseChart />
                </div>
            </div>
        </>
    )
}
