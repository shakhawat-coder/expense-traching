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
import { useRouter } from "next/navigation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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
import { expenseApi, incomeApi, categoryApi, Category } from "@/lib/api"
import { EditTransactionDialog } from "./edit-transaction-dialog"

export type History = {
    id: string
    amount: number
    type: "income" | "expense"
    category: string
    categoryId: string
    description: string
    date: string
}

interface TransactionHistoryProps {
    isDashboard?: boolean;
    onlyExpenses?: boolean;
}

export default function TransactionHistory({ isDashboard = false, onlyExpenses = false }: TransactionHistoryProps) {
    const router = useRouter()
    const [transactions, setTransactions] = React.useState<History[]>([])
    const [categories, setCategories] = React.useState<Category[]>([])
    const [loading, setLoading] = React.useState(true)
    const [sorting, setSorting] = React.useState<SortingState>([{ id: "date", desc: true }])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        type: !onlyExpenses // Hide type column if only showing expenses
    })
    const [rowSelection, setRowSelection] = React.useState({})

    // Default to current month and year
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = React.useState<string>((currentDate.getMonth() + 1).toString());
    const [selectedYear, setSelectedYear] = React.useState<string>(currentDate.getFullYear().toString());

    const fetchAllData = React.useCallback(async () => {
        setLoading(true);
        try {
            const params = isDashboard
                ? { limit: 10 }
                : { month: selectedMonth, year: selectedYear };

            const requests = [
                expenseApi.getAll(params),
                categoryApi.getAll()
            ];

            if (!onlyExpenses) {
                requests.push(incomeApi.getAll(params));
            }

            const results: any = await Promise.all(requests);
            const expenseRes = results[0];
            const categoryRes = results[1];
            const incomeRes = !onlyExpenses ? results[2] : { success: true, data: [] };

            const catList: Category[] = categoryRes.success ? categoryRes.data : [];
            setCategories(catList);

            const categoryMap: Record<string, string> = {};
            catList.forEach((cat: any) => {
                categoryMap[cat.id] = cat.name;
            });

            const formattedExpenses = expenseRes.success ? expenseRes.data.map((item: any) => ({
                id: item.id,
                type: "expense" as const,
                amount: Number(item.amount),
                category: item.category?.name || categoryMap[item.categoryId] || "Uncategorized",
                categoryId: item.categoryId,
                description: item.description || "",
                date: new Date(item.date).toISOString().split('T')[0],
            })) : [];

            const formattedIncomes = incomeRes.success ? incomeRes.data.map((item: any) => ({
                id: item.id,
                type: "income" as const,
                amount: Number(item.amount),
                category: item.category?.name || categoryMap[item.categoryId] || "Uncategorized",
                categoryId: item.categoryId,
                description: item.description || "",
                date: new Date(item.date).toISOString().split('T')[0],
            })) : [];

            // Combine and sort by date
            const combined = [...formattedExpenses, ...formattedIncomes].sort((a: History, b: History) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            setTransactions(combined);
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedMonth, selectedYear, isDashboard, onlyExpenses]);

    React.useEffect(() => {
        fetchAllData();

        // Listen for global refresh events
        const handleRefresh = () => fetchAllData();
        window.addEventListener('refresh-data', handleRefresh);

        return () => {
            window.removeEventListener('refresh-data', handleRefresh);
        };
    }, [fetchAllData]);

    const handleDelete = async (id: string, type: "income" | "expense") => {
        if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

        try {
            let res: any;
            if (type === "expense") {
                res = await expenseApi.delete(id);
            } else {
                res = await incomeApi.delete(id);
            }

            if (res.success) {
                alert(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
                // Dispatch event to refresh all data components
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event('refresh-data'));
                }
                router.refresh()
                fetchAllData();
            }
        } catch (error: any) {
            alert(error.message || `Failed to delete ${type}`);
        }
    };

    const columns: ColumnDef<History>[] = [
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
                const transaction = row.original;
                return (
                    <div className="text-right flex justify-end gap-3">
                        <EditTransactionDialog
                            transaction={transaction}
                            categories={categories}
                            onUpdate={fetchAllData}
                        />
                        <Button
                            variant="ghost"
                            className="gap-2 text-destructive hover:text-red-600"
                            onClick={() => handleDelete(transaction.id, transaction.type)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
        }
    ]

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

    if (loading) return <div className="py-10 text-center">Loading {onlyExpenses ? "expenses" : "transactions"}...</div>

    const months = [
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
        { value: "4", label: "April" },
        { value: "5", label: "May" },
        { value: "6", label: "June" },
        { value: "7", label: "July" },
        { value: "8", label: "August" },
        { value: "9", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ];

    const currentYearNum = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => (currentYearNum - i).toString());


    return (
        <div className="w-full">
            <div className="flex  items-start sm:items-center py-4 gap-4">
                <Input
                    placeholder="Search by category..."
                    value={(table.getColumn("category")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("category")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />

                {!isDashboard && (
                    <div className="flex flex-nowrap gap-2 w-auto">
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <SelectValue placeholder="Select Month" />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map((month) => (
                                    <SelectItem key={month.value} value={month.value}>
                                        {month.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-full sm:w-[120px]">
                                <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

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
            <div className="overflow-x-auto rounded-md border">
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
