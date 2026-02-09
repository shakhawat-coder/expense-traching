"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { categoryApi } from "@/lib/api";
import { CategoryColumn } from "./category-columns";

interface EditCategoryDialogProps {
    category: CategoryColumn;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCategoryUpdated?: () => void;
}

export function EditCategoryDialog({
    category,
    open,
    onOpenChange,
    onCategoryUpdated
}: EditCategoryDialogProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [name, setName] = useState(category.name);
    const [type, setType] = useState(category.type);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response: any = await categoryApi.update(category.id, {
                name,
                type,
            });
            if (response.success) {
                onOpenChange(false);
                if (onCategoryUpdated) onCategoryUpdated();
            }
        } catch (err: any) {
            setError(err.message || "Failed to update category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-name">Name</Label>
                        <Input
                            id="edit-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Food, Salary, Rent"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-type">Type</Label>
                        <Select value={type} onValueChange={(val: any) => setType(val)} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="INCOME">Income</SelectItem>
                                <SelectItem value="EXPENSE">Expense</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update Category"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
