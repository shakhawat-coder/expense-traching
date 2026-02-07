"use client"

import * as React from "react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { expenseApi, incomeApi, categoryApi } from "@/lib/api"



export type History = {
    id: string
    amount: number
    type: "income" | "expense"
    category: string
    description: string
    date: string
}

export const columns: ColumnDef<History>[] = [
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            const type = row.getValue("type") as string
            return (
                <div className={`capitalize font-medium ${type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {type}
                </div>
            )
        },
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("category")}</div>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("description")}</div>
        ),
    },
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("date")}</div>,
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))
            const type = row.original.type

            // Format the amount as a dollar amount
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)

            return (
                <div className={`text-right font-medium ${type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {type === "income" ? "+" : "-"}{formatted}
                </div>
            )
        },
    },
    {
        accessorKey: "actions",
        header: () => <div className="text-right">Actions</div>,
        enableHiding: false,
        cell: ({ row }) => {
            const payment = row.original

            return (
                <div className="text-right flex justify-end gap-3">
                    <Button variant="ghost" className="gap-2 text-cyan-500 focus:text-destructive">
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" className="gap-2 text-destructive focus:text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        },
    }

]

export default function ExpenseHistory() {
    const [transactions, setTransactions] = React.useState<History[]>([])
    const [loading, setLoading] = React.useState(true)
    const [sorting, setSorting] = React.useState<SortingState>([{ id: "date", desc: true }])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    React.useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [expenseRes, incomeRes, categoryRes]: any = await Promise.all([
                    expenseApi.getAll(),
                    incomeApi.getAll(),
                    categoryApi.getAll()
                ]);

                // Create a category lookup map for quick access
                const categoryMap: Record<string, string> = {};
                if (categoryRes.success) {
                    categoryRes.data.forEach((cat: any) => {
                        categoryMap[cat.id] = cat.name;
                    });
                }

                const formattedExpenses = expenseRes.success ? expenseRes.data.map((item: any) => ({
                    id: item.id,
                    type: "expense" as const,
                    amount: Number(item.amount),
                    // Use nested category name or fallback to lookup map
                    category: item.category?.name || categoryMap[item.categoryId] || "Uncategorized",
                    description: item.description || "",
                    date: new Date(item.date).toISOString().split('T')[0],
                })) : [];

                const formattedIncomes = incomeRes.success ? incomeRes.data.map((item: any) => ({
                    id: item.id,
                    type: "income" as const,
                    amount: Number(item.amount),
                    // Use nested category name or fallback to lookup map
                    category: item.category?.name || categoryMap[item.categoryId] || "Uncategorized",
                    description: item.description || "",
                    date: new Date(item.date).toISOString().split('T')[0],
                })) : [];

                // Combine and sort by date
                const combined = [...formattedExpenses, ...formattedIncomes].sort((a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                setTransactions(combined);
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);


    const table = useReactTable({
        data: transactions,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    if (loading) return <div className="py-10 text-center">Loading transactions...</div>

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search by category..."
                    value={(table.getColumn("category")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("category")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
