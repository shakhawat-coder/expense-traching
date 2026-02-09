"use client";

import React from 'react';
import { AddCategoryDialog } from '@/components/adminDashboard/add-category-dialog';
import { DataTable } from '@/components/ui/data-table';
import { getColumns } from '@/components/adminDashboard/category-columns';
import { useCategories } from '@/hooks/use-categories';

export function CategoryClient() {
    const { categories, loading, mounted, refresh } = useCategories();
    const columns = getColumns(refresh);

    if (!mounted) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
                        <p className="text-muted-foreground">Manage your income and expense categories.</p>
                    </div>
                </div>
                <div className="flex justify-center py-10">Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
                    <p className="text-muted-foreground">Manage your income and expense categories.</p>
                </div>
                <AddCategoryDialog onCategoryAdded={refresh} />
            </div>

            {loading ? (
                <div className="flex justify-center py-10">Loading categories...</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={categories}
                    searchKey="name"
                />
            )}
        </div>
    );
}
