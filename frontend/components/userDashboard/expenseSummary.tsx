import React from 'react'
import SummaryCard from './dashboardCommon/summaryCard'
const summaryData = [
    {
        title: 'Total Income',
        amount: '$12,345.67',
        linkHref: '/income-details',
        linkText: 'View Income Details'
    },
    {
        title: 'Total Expenses',
        amount: '$8,234.50',
        linkHref: '/expense-details',
        linkText: 'View Expense Details'
    },
    {
        title: 'Total Savings',
        amount: '$4,111.17',
        linkHref: '/savings-details',
        linkText: 'View Savings Details'
    },
    {
        title: 'This Month',
        amount: '$2,456.89',
        linkHref: '/monthly-details',
        linkText: 'View Monthly Details'
    }
]
export default function ExpenseSummary() {
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
