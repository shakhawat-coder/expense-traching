import {
    LayoutDashboard,
    Receipt,
    PiggyBank,
    BarChart3,
    Wallet,
    Settings,
    Users,
    Layers,
    User as UserIcon,
} from "lucide-react";

export const USER_SIDEBAR_DATA = {
    navMain: [
        {
            title: "Overview",
            items: [
                {
                    title: "Dashboard",
                    url: "/dashboard",
                    icon: LayoutDashboard,
                },
                {
                    title: "Transactions",
                    url: "/dashboard/transactions",
                    icon: Receipt,
                },
                {
                    title: "Savings",
                    url: "/dashboard/savings",
                    icon: PiggyBank,
                },
            ],
        },
        {
            title: "Reports",
            items: [
                {
                    title: "Analytics",
                    url: "/dashboard/analytics",
                    icon: BarChart3,
                },
                {
                    title: "Expense History",
                    url: "/dashboard/expense-history",
                    icon: Wallet,
                },
            ],
        },
        {
            title: "System",
            items: [
                {
                    title: "Profile",
                    url: "/dashboard/profile",
                    icon: UserIcon,
                },
            ],
        },
    ],
};

export const ADMIN_SIDEBAR_DATA = {
    navMain: [
        {
            title: "Admin",
            items: [
                {
                    title: "Admin Dashboard",
                    url: "/admin-dashboard",
                    icon: LayoutDashboard,
                },
                {
                    title: "Manage Users",
                    url: "/admin-dashboard/users",
                    icon: Users,
                },
                {
                    title: "Categories",
                    url: "/admin-dashboard/categories",
                    icon: Layers,
                },
            ],
        },
        {
            title: "System",
            items: [
                {
                    title: "Settings",
                    url: "/admin-dashboard/settings",
                    icon: Settings,
                },
            ],
        },
    ],
};
