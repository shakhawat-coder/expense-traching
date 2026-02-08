import { cookies } from "next/headers"
import Link from 'next/link'
import ExpenseHistory from '@/components/userDashboard/expenseHistory'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

async function getUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) return null

    try {
        const response = await fetch(`${BASE_URL}/auth/me`, {
            headers: { Cookie: `token=${token}` }
        })
        const data = await response.json()
        return data.success ? data.data : null
    } catch (error) {
        return null
    }
}

export default async function Dashboard() {
    const user = await getUser()

    return (
        <>
            {/* ===========recent transaction table=========== */}
            <div>
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold mb-4 mt-10">Recent Transactions</h3>
                    <Link href="/dashboard/expense-history" className="text-blue-600 hover:underline">View All</Link>
                </div>
                <ExpenseHistory />
            </div>
        </>
    )
}


