'use client'

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/layout/MoodToogle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AddExpense } from "@/components/layout/addpopup"

export default function DashboardLayout({ admin, user }: {
  children: React.ReactNode;
  admin: React.ReactNode;
  user: React.ReactNode
}) {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 w-full flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 bg-white dark:bg-black/75 backdrop-blur-sm z-10">
          <div className="flex h-16 shrink-0 items-center  gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {/* <BreadcrumbItem>
                  <BreadcrumbPage>Expense History</BreadcrumbPage>
                </BreadcrumbItem> */}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex gap-3 items-center">
            <Button variant="outline" onClick={() => setIsExpenseModalOpen(true)}>
              Add Expense
            </Button>
            <AddExpense open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen} />
            <ModeToggle />
          </div>

        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* {children} */}
          {admin}
          {user}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
