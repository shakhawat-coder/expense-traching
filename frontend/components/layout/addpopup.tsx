'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"

interface AddExpenseProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const INCOME_CATEGORIES = [
    "Salary",
    "Freelance",
    "Investment",
    "Bonus",
    "Gift",
    "Refund",
    "Other Income",
]

const EXPENSE_CATEGORIES = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Education",
    "Travel",
    "Other",
]

export function AddExpense({ open, onOpenChange }: AddExpenseProps) {
    const [formData, setFormData] = useState({
        type: "income",
        amount: "",
        category: "",
        description: "",
        date: "",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleTypeChange = (type: string) => {
        setFormData(prev => ({
            ...prev,
            type: type,
            category: "", // Reset category when switching type
        }))
    }

    const handleCategoryChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            category: value,
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Add your transaction submission logic here
        console.log("Transaction submitted:", formData)
        setFormData({ type: "expense", amount: "", category: "", description: "", date: "" })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Transaction</DialogTitle>
                    <DialogDescription>
                        Enter the details of your transaction below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <fieldset className="border border-gray-300 rounded-md p-3">
                            <legend className="text-sm font-medium px-2">Transaction Type</legend>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={formData.type === "income" ? "default" : "outline"}
                                    onClick={() => handleTypeChange("income")}
                                    className="flex-1 bg-green-600 text-white hover:bg-green-700"
                                >
                                    Income
                                </Button>
                                <Button
                                    type="button"
                                    variant={formData.type === "expense" ? "default" : "outline"}
                                    onClick={() => handleTypeChange("expense")}
                                    className="flex-1 bg-red-600 text-white hover:bg-red-700"
                                >
                                    Expense
                                </Button>
                            </div>
                        </fieldset>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                placeholder="0.00"
                                className="col-span-3"
                                value={formData.amount}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                                Category
                            </Label>
                            <Select value={formData.category} onValueChange={handleCategoryChange}>
                                <SelectTrigger className="col-span-3 w-full">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(formData.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                name="description"
                                placeholder="Enter description"
                                className="col-span-3"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">
                                Date
                            </Label>
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                className="col-span-3"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add Transaction</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
