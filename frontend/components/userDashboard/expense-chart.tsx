import { cookies } from "next/headers"
import { MonthlyExpenseClient } from "./monthly-expense-chart"

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`

async function getChartData() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) return []

    try {
        const [incomeRes, expenseRes] = await Promise.all([
            fetch(`${BASE_URL}/income`, {
                headers: { Cookie: `token=${token}` }
            }).then(res => res.json()),
            fetch(`${BASE_URL}/expenses`, {
                headers: { Cookie: `token=${token}` }
            }).then(res => res.json())
        ])

        const incomes = incomeRes.success ? incomeRes.data : []
        const expenses = expenseRes.success ? expenseRes.data : []

        const dataMap: Record<string, { date: string, income: number, expense: number }> = {}

        incomes.forEach((inc: any) => {
            const date = inc.date.split('T')[0]
            if (!dataMap[date]) dataMap[date] = { date, income: 0, expense: 0 }
            dataMap[date].income += Number(inc.amount)
        })

        expenses.forEach((exp: any) => {
            const date = exp.date.split('T')[0]
            if (!dataMap[date]) dataMap[date] = { date, income: 0, expense: 0 }
            dataMap[date].expense += Number(exp.amount)
        })

        return Object.values(dataMap).sort((a, b) => a.date.localeCompare(b.date))
    } catch (error) {
        console.error("Error fetching chart data:", error)
        return []
    }
}

export default async function MonthlyExpense() {
    const data = await getChartData()

    return <MonthlyExpenseClient data={data} />
}

