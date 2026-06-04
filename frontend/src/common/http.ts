export default async function http<a>(route: string, method: string, body?: a) {
    return await fetch(`http://localhost:3000${route}`, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
    });
}
