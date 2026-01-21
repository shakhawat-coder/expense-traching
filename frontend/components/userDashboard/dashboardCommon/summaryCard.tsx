import React from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from 'next/link'

interface SummaryCardProps {
    title: string
    amount: string
    linkHref: string
    linkText: string
}

export default function SummaryCard({ title, amount, linkHref, linkText }: SummaryCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{amount}</p>
                <Link href={linkHref} className="text-blue-600 hover:underline">
                    {linkText}
                </Link>
            </CardContent>
        </Card>
    )
}
