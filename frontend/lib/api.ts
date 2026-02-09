const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

type FetchOptions = RequestInit & {
    params?: Record<string, string>;
};

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    image?: string;
}

export interface Income {
    id: string;
    amount: number;
    categoryId: string;
    category?: Category;
    description?: string;
    date: string;
    userId: string;
}

export interface Expense {
    id: string;
    amount: number;
    categoryId: string;
    category?: Category;
    description?: string;
    date: string;
    userId: string;
}

/**
 * Custom fetch wrapper for Next.js with sensible defaults
 */
export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
    const { params, headers, ...rest } = options;

    // Build URL with query parameters
    let url = `${BASE_URL}${endpoint}`;
    if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
    }

    const defaultHeaders: Record<string, string> = {
        "Content-Type": "application/json",
    };


    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            defaultHeaders["Authorization"] = `Bearer ${token}`;
        }
    }

    const config: RequestInit = {
        headers: {
            ...defaultHeaders,
            ...headers,
        },
        // Required for sending/receiving cookies (JWT token)
        credentials: "include",
        ...rest,
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            const error: any = new Error(data.message || `API error: ${response.status}`);
            error.status = response.status;
            throw error;
        }

        return data;
    } catch (error: any) {
        if (error.status !== 401) {
            console.error(`API Fetch Error [${endpoint}]:`, error.message);
        }
        throw error;
    }


}

/**
 * Auth specific API calls
 */
export const authApi = {
    signIn: (payload: any) =>
        apiFetch("/auth/signin", { method: "POST", body: JSON.stringify(payload) }),

    signUp: (payload: any) =>
        apiFetch("/auth/signup", { method: "POST", body: JSON.stringify(payload) }),

    signOut: () =>
        apiFetch("/auth/signout", { method: "POST" }),

    verifyEmail: (payload: { email: string; otp: string }) =>
        apiFetch("/auth/verify-email", { method: "POST", body: JSON.stringify(payload) }),

    getMe: () =>
        apiFetch("/auth/me", { method: "GET" }),
    changePassword: (payload: any) =>
        apiFetch("/auth/change-password", { method: "POST", body: JSON.stringify(payload) }),
};
/**
 * User specific API calls
 */
export const userApi = {
    getAll: () => apiFetch("/users"),
    getById: (id: string) => apiFetch(`/users/${id}`),
    update: (id: string, payload: any) => apiFetch(`/users/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    delete: (id: string) => apiFetch(`/users/${id}`, { method: "DELETE" }),
};

/**
 * Dashboard specific API calls
 */
export const dashboardApi = {
    getSummary: () => apiFetch("/dashboard/summary"),
    getAdminSummary: () => apiFetch("/dashboard/admin-summary"),
    getCategoryWiseExpense: (params?: any) => apiFetch("/dashboard/category-expense", { params }),
};

/**
 * Category specific API calls
 */
export const categoryApi = {
    getAll: () => apiFetch("/categories"),
    getById: (id: string) => apiFetch(`/categories/${id}`),
    create: (payload: any) =>
        apiFetch("/categories", { method: "POST", body: JSON.stringify(payload) }),
    update: (id: string, payload: any) =>
        apiFetch(`/categories/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    delete: (id: string) =>
        apiFetch(`/categories/${id}`, { method: "DELETE" }),
};

/**
 * Income specific API calls
 */
export const incomeApi = {
    getAll: (params?: any) => apiFetch<Income[]>("/income", { params }),
    create: (payload: any) =>
        apiFetch<Income>("/income", { method: "POST", body: JSON.stringify(payload) }),
};

/**
 * Expense specific API calls
 */
export const expenseApi = {
    getAll: (params?: any) => apiFetch<Expense[]>("/expenses", { params }),
    create: (payload: any) =>
        apiFetch<Expense>("/expenses", { method: "POST", body: JSON.stringify(payload) }),
};
