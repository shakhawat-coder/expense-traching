"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { EditCategoryDialog } from "./edit-category-dialog"
import { DeleteCategoryDialog } from "./delete-category-dialog"

export type CategoryColumn = {
    id: string
    name: string
    type: "INCOME" | "EXPENSE"
    createdAt: string
}

export const CategoryActions = ({
    category,
    onUpdate
}: {
    category: CategoryColumn,
    onUpdate: () => void
}) => {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    return (
        <div className="flex justify-end gap-2">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-cyan-600"
                onClick={() => setIsEditOpen(true)}
            >
                <Pencil className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => setIsDeleteOpen(true)}
            >
                <Trash2 className="h-4 w-4" />
            </Button>

            <EditCategoryDialog
                category={category}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                onCategoryUpdated={onUpdate}
            />

            <DeleteCategoryDialog
                categoryId={category.id}
                categoryName={category.name}
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onCategoryDeleted={onUpdate}
            />
        </div>
    )
}

// Note: Columns export is now a function to allow passing refresh callback
export const getColumns = (onUpdate: () => void): ColumnDef<CategoryColumn>[] => [
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
        cell: ({ row }) => (
            <CategoryActions category={row.original} onUpdate={onUpdate} />
        )
    }
]
