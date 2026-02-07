'use client'

import { useEffect, useState } from "react"
import { categoryApi, incomeApi, expenseApi } from "@/lib/api"
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


interface Category {
    id: string;
    name: string;
    type: "INCOME" | "EXPENSE";
}

interface AddExpenseProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AddExpense({ open, onOpenChange }: AddExpenseProps) {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        type: "income",
        amount: "",
        categoryId: "",
        description: "",
        date: new Date().toISOString().split('T')[0],
    })

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response: any = await categoryApi.getAll();
                if (response.success) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        if (open) {
            fetchCategories();
        }
    }, [open]);

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
            categoryId: "", // Reset category when switching type
        }))
    }

    const handleCategoryChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            categoryId: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const payload = {
                amount: parseFloat(formData.amount),
                description: formData.description,
                date: new Date(formData.date).toISOString(),
                categoryId: formData.categoryId,
            }

            let response: any;
            if (formData.type === "income") {
                response = await incomeApi.create(payload);
            } else {
                response = await expenseApi.create(payload);
            }

            if (response.success) {
                // toast.success("Transaction added successfully")
                setFormData({
                    type: "income",
                    amount: "",
                    categoryId: "",
                    description: "",
                    date: new Date().toISOString().split('T')[0],
                })
                onOpenChange(false)
            }
        } catch (error: any) {
            console.error("Submission error:", error);

        } finally {
            setLoading(false)
        }
    }

    const filteredCategories = categories.filter(
        (cat) => cat.type === formData.type.toUpperCase()
    )

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
                                    className={`flex-1 ${formData.type === "income" ? "bg-green-600 text-white hover:bg-green-700" : ""}`}
                                >
                                    Income
                                </Button>
                                <Button
                                    type="button"
                                    variant={formData.type === "expense" ? "default" : "outline"}
                                    onClick={() => handleTypeChange("expense")}
                                    className={`flex-1 ${formData.type === "expense" ? "bg-red-600 text-white hover:bg-red-700" : ""}`}
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
                            <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
                                <SelectTrigger className="col-span-3 w-full">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredCategories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
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
