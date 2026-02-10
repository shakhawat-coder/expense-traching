export const dynamic = "force-dynamic";
import Overview from '@/components/adminDashboard/Overview'
import { TransactionChart } from '@/components/adminDashboard/transaction-chart';
import React from 'react'

export default function AdminDashboard() {
  return (
    <div>
      <Overview />
      <div className='mt-10'>
        <TransactionChart />
      </div>
    </div>
  )
}
