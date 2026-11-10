import type { MiddlewareHandler } from "hono";

const cacheControl = "public, max-age=60, s-maxage=300, stale-while-revalidate=600";

async function sha256(value: string): Promise<string> {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** Adds validators only to successful, public JSON GET responses. */
export const etagCache: MiddlewareHandler = async (c, next) => {
    if (c.req.method !== "GET" || !c.req.path.startsWith("/api/") || c.req.path.startsWith("/api/auth")) {
        await next();
        return;
    }

    await next();
    const response = c.res;
    const contentType = response.headers.get("Content-Type") ?? "";
    if (response.status !== 200 || !contentType.includes("application/json") || response.headers.has("ETag")) {
        return;
    }

    const etag = `"${await sha256(await response.clone().text())}"`;
    response.headers.set("ETag", etag);
    response.headers.set("Cache-Control", cacheControl);

    const requestedEtags = c.req.header("If-None-Match");
    if (requestedEtags === "*" || requestedEtags?.split(",").map((value) => value.trim()).includes(etag)) {
        c.res = new Response(null, { status: 304, headers: response.headers });
    }
};
