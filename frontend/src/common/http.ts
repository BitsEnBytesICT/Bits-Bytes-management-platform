export default async function http<a>(route: string, method: string, body?: a) {
    return await fetch(`${import.meta.env.VITE_BACKEND_URL}${route}`, {
        method: method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
    });
}
