import React from 'react'
import SummaryCard from '../userDashboard/dashboardCommon/summaryCard'
const summaryData = [
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
    },
    {
        title: 'Goals Achieved',
        amount: '3',
        linkHref: '/goals-achieved',
        linkText: 'View Goals Achieved'
    }
]
export default function SavingsSummery() {
    return (
        <div>
            <div className="grid grid-cols-3 gap-4">
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
