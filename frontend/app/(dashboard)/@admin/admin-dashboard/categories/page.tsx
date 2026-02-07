"use client";

import React, { useEffect, useState } from 'react'
import { AddCategoryDialog } from '@/components/adminDashboard/add-category-dialog'
import { categoryApi } from '@/lib/api'
import { DataTable } from '@/components/ui/data-table'
import { columns } from '@/components/adminDashboard/category-columns'

export default function CategoryPage() {
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchCategories = async () => {
        try {
            const response: any = await categoryApi.getAll();
            if (response.success) {
                // Format date for the table
                const formattedData = response.data.map((cat: any) => ({
                    ...cat,
                    createdAt: new Date(cat.createdAt).toLocaleDateString()
                }));
                setCategories(formattedData);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, [])

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
                    <p className="text-muted-foreground">Manage your income and expense categories.</p>
                </div>
                <AddCategoryDialog onCategoryAdded={fetchCategories} />
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
    )
}
