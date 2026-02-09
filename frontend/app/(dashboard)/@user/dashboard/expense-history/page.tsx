import TransactionHistory from '@/components/userDashboard/transactionHistory'
import React from 'react'

export default function ExpenseHistoryPage() {
    return (
        <div className="p-4 sm:p-6 space-y-6">
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Expense History</h2>
                <p className="text-muted-foreground text-sm sm:text-base">View and filter your complete expense records.</p>
            </div>
            <TransactionHistory isDashboard={false} onlyExpenses={true} />
        </div>
    )
}
