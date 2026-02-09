'use client'
export const dynamic = "force-dynamic";

import React from 'react'
import { userApi } from '@/lib/api'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'

export default function Users() {
    const [mounted, setMounted] = React.useState(false);
    const [users, setUsers] = React.useState<any | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response: any = await userApi.getAll();
                if (response.success) {
                    setUsers(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch admin summary:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            {!mounted ? (
                <div>Loading...</div>
            ) : loading ? (
                <div>Loading users...</div>
            ) : (
                <DataTable columns={columns} data={users || []} searchKey="email" />
            )}
        </div>
    )
}