"use client";

import { useState, useEffect, useCallback } from "react";
import { categoryApi } from "@/lib/api";

export function useCategories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const fetchCategories = useCallback(async () => {
        if (typeof window === "undefined") return;

        try {
            setLoading(true);
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
    }, []);

    useEffect(() => {
        if (mounted) {
            fetchCategories();
        }
    }, [mounted, fetchCategories]);

    return {
        categories,
        loading,
        mounted,
        refresh: fetchCategories
    };
}
