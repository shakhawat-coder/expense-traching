"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

export type CategoryColumn = {
    id: string
    name: string
    type: "INCOME" | "EXPENSE"
    createdAt: string
}

export const columns: ColumnDef<CategoryColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.original.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                {row.original.type}
            </span>
        )
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const category = row.original

            return (
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-cyan-600">
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    }
]
