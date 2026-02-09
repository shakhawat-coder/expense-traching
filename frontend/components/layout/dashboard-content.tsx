"use client";

import { useState } from "react"
import { ModeToggle } from "@/components/layout/MoodToogle"
import { useAuth } from "@/providers/auth-provider"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { AddExpense } from "@/components/layout/addpopup"
import { AppSidebar } from "@/components/app-sidebar"

export function DashboardContent({ admin, user }: {
    admin: React.ReactNode;
    user: React.ReactNode;
}) {
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
    const { user: authUser } = useAuth();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="sticky top-0 w-full flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 md:px-6 bg-white dark:bg-black/75 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4 hidden sm:block"
                        />
                        <Breadcrumb className="hidden md:block">
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex gap-2 sm:gap-3 items-center">
                        {authUser?.role === "USER" && (
                            <>
                                <Button variant="outline" size="sm" className="h-8 sm:h-9" onClick={() => setIsExpenseModalOpen(true)}>
                                    Add Expense
                                </Button>
                                <AddExpense open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen} />
                            </>
                        )}
                        <ModeToggle />
                    </div>

                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {admin}
                    {user}
                </div>
            </SidebarInset>
        </SidebarProvider >
    )
}
