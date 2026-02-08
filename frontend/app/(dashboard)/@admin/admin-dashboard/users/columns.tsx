"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { userApi } from "@/lib/api"

export type User = {
    id: string
    name: string
    email: string
    role: "ADMIN" | "USER"
    isSuspended: boolean
    createdAt: string
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        accessorKey: "isSuspended",
        header: "Status",
        cell: ({ row }) => {
            const user = row.original

            const handleToggleSuspend = async () => {
                try {
                    await userApi.update(user.id, { isSuspended: !user.isSuspended })
                    window.location.reload()
                } catch (error) {
                    console.error("Failed to update user status", error)
                }
            }

            return (
                <div className="flex items-center gap-2">
                    <Switch
                        checked={!user.isSuspended}
                        onCheckedChange={handleToggleSuspend}
                    />
                    <span className={`font-medium ${user.isSuspended ? "text-red-500" : "text-green-500"}`}>
                        {user.isSuspended ? "Suspended" : "Active"}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            return new Date(row.getValue("createdAt")).toLocaleDateString()
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original

            const handleDelete = async () => {
                if (confirm("Are you sure you want to delete this user?")) {
                    try {
                        await userApi.delete(user.id)
                        window.location.reload()
                    } catch (error) {
                        console.error("Failed to delete user", error)
                    }
                }
            }

            return (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={handleDelete}
                    title="Delete User"
                >
                    <Trash className="h-4 w-4" />
                </Button>
            )
        },
    },
]
