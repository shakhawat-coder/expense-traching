import { DashboardContent } from "@/components/layout/dashboard-content"

export default function DashboardLayout({ admin, user }: {
  children: React.ReactNode;
  admin: React.ReactNode;
  user: React.ReactNode
}) {
  return (
    <DashboardContent admin={admin} user={user} />
  )
}
