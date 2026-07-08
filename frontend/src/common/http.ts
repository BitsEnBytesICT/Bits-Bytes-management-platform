const EXCLUDED_ROUTES = ["/api/login", "/api/refresh-token"]

let refreshPromise: Promise<boolean> | null = null

async function performRefresh(): Promise<boolean> {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/refresh-token`, {
            method: "POST",
            credentials: "include",
        })
        return response.status === 200
    } catch {
        return false
    }
}

async function refreshToken(): Promise<boolean> {
    if (!refreshPromise) {
        refreshPromise = performRefresh().finally(() => {
            refreshPromise = null
        })
    }
    return refreshPromise
}

async function performRequest<a>(route: string, method: string, body?: a): Promise<Response> {
    return await fetch(`${import.meta.env.VITE_BACKEND_URL}${route}`, {
        method: method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
    })
}

async function fetchWithAuth<a>(route: string, method: string, body?: a, retried: boolean = false): Promise<Response> {
    const response = await performRequest(route, method, body)

    if (response.status === 401 && !EXCLUDED_ROUTES.includes(route) && !retried) {
        const refreshed = await refreshToken()

        if (refreshed) {
            return fetchWithAuth(route, method, body, true)
        }
    }

    return response
}

export default async function http<a>(route: string, method: string, body?: a): Promise<Response> {
    return fetchWithAuth(route, method, body)
}