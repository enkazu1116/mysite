import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { etagCache } from "../etagCache";

describe("etagCache", () => {
    test("returns an ETag and serves 304 for a matching conditional request", async () => {
        const app = new Hono()
            .use("*", etagCache)
            .get("/api/items", (c) => c.json({ items: ["one"] }));

        const initial = await app.request("http://localhost/api/items");
        const etag = initial.headers.get("ETag");

        expect(initial.status).toBe(200);
        expect(etag).toMatch(/^"[a-f0-9]{64}"$/);
        expect(initial.headers.get("Cache-Control")).toContain("max-age=60");

        const conditional = await app.request("http://localhost/api/items", {
            headers: { "If-None-Match": etag! },
        });
        expect(conditional.status).toBe(304);
        expect(await conditional.text()).toBe("");
    });

    test("does not cache auth responses", async () => {
        const app = new Hono()
            .use("*", etagCache)
            .get("/api/auth/me", (c) => c.json({ authenticated: false }));

        const response = await app.request("http://localhost/api/auth/me");
        expect(response.headers.get("ETag")).toBeNull();
    });
});
