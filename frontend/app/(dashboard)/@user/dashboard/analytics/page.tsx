import { CategoryExpenseChart } from '@/components/userDashboard/categoryExpensechart'
import { CompareExpense } from '@/components/userDashboard/compareExpense'
import MonthlyExpense from '@/components/userDashboard/expense-chart'
import React from 'react'

export default function Analytics() {
    return (
        <>
            <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
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
