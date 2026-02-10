"use client";

import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { expenseApi, incomeApi, Category } from '@/lib/api'
import { Pencil, Loader2, DollarSign, Calendar, Tag, FileText } from 'lucide-react'
import { useRouter } from "next/navigation"

interface EditTransactionDialogProps {
    transaction: {
        id: string;
        amount: number;
        type: "income" | "expense";
        categoryId: string;
        description: string;
        date: string;
    };
    categories: Category[];
    onUpdate: () => void;
    trigger?: React.ReactNode;
}

export function EditTransactionDialog({ transaction, categories, onUpdate, trigger }: EditTransactionDialogProps) {
    const router = useRouter();
    const [amount, setAmount] = useState(transaction.amount.toString());
    const [categoryId, setCategoryId] = useState(transaction.categoryId);
    const [description, setDescription] = useState(transaction.description);
    const [date, setDate] = useState(transaction.date);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    // Update state when transaction changes (e.g. when opening for a different row)
    useEffect(() => {
        setAmount(transaction.amount.toString());
        setCategoryId(transaction.categoryId);
        setDescription(transaction.description);
        setDate(transaction.date);
    }, [transaction]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                amount: parseFloat(amount),
                categoryId,
                description,
                date: new Date(date),
            };

            let response: any;
            if (transaction.type === "expense") {
                response = await expenseApi.update(transaction.id, payload);
            } else {
                response = await incomeApi.update(transaction.id, payload);
            }

            if (response.success) {
                // Dispatch event to refresh all data components
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event('refresh-data'));
                }
                router.refresh()
                onUpdate();
                setOpen(false);
                if (typeof window !== 'undefined') {
                    alert(`${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} updated successfully!`);
                }
            }
        } catch (error: any) {
            alert(error.message || `Failed to update ${transaction.type}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" className="gap-2 text-cyan-500 hover:text-cyan-600">
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit {transaction.type}</DialogTitle>
                    <DialogDescription>
                        Update the details of your {transaction.type} here.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="pl-9"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                            <Select value={categoryId} onValueChange={setCategoryId} >
                                <SelectTrigger className="pl-9 w-full">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories
                                        .filter(cat => cat.type === (transaction.type === "income" ? "INCOME" : "EXPENSE"))
                                        .map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="pl-9"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
