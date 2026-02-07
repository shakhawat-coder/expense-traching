const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type FetchOptions = RequestInit & {
    params?: Record<string, string>;
};

/**
 * Custom fetch wrapper for Next.js with sensible defaults
 */
export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, headers, ...rest } = options;

    // Build URL with query parameters
    let url = `${BASE_URL}${endpoint}`;
    if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
    }

    const defaultHeaders: HeadersInit = {
        "Content-Type": "application/json",
    };

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
    getAll: () => apiFetch("/income"),
    create: (payload: any) =>
        apiFetch("/income", { method: "POST", body: JSON.stringify(payload) }),
};

/**
 * Expense specific API calls
 */
export const expenseApi = {
    getAll: () => apiFetch("/expenses"),
    create: (payload: any) =>
        apiFetch("/expenses", { method: "POST", body: JSON.stringify(payload) }),
};
