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
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardLayout({admin,user}: {
  children: React.ReactNode;
  admin:React.ReactNode;
  user:React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
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
            </BreadcrumbList>
          </Breadcrumb>
          </div>
          <ModeToggle />
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
