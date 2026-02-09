"use client";

import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { categoryApi } from "@/lib/api";

interface DeleteCategoryDialogProps {
    categoryId: string;
    categoryName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCategoryDeleted?: () => void;
}

export function DeleteCategoryDialog({
    categoryId,
    categoryName,
    open,
    onOpenChange,
    onCategoryDeleted
}: DeleteCategoryDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response: any = await categoryApi.delete(categoryId);
            if (response.success) {
                onOpenChange(false);
                if (onCategoryDeleted) onCategoryDeleted();
            }
        } catch (err: any) {
            alert(err.message || "Failed to delete category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the category <span className="font-semibold">{categoryName}</span>. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={loading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
