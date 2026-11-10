import { describe, expect, test } from "bun:test";
import { env } from "../env";

describe("env", () => {
    test("uses the Cloudflare Workers bindings when supplied", () => {
        const bindings = { BOOKS_API: "worker-secret", DB: {} };
        expect(env(bindings)).toBe(bindings);
    });

    test("uses Bun.env when no Worker bindings are supplied", () => {
        expect(env()).toBe(Bun.env);
    });
});
