import { cookies } from "next/headers"
export const dynamic = "force-dynamic";
import TransactionHistory from "@/components/userDashboard/transactionHistory";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`

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
            <div>
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold mb-4 mt-10">All Transactions</h3>
                </div>
                <TransactionHistory />
            </div>
        </>
    )
}


