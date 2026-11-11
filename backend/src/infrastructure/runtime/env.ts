type BunEnvironment = Record<string, string | undefined>;

/**
 * Resolves runtime configuration without coupling application code to a host.
 * Cloudflare Workers bindings always win; Bun.env is only a local fallback.
 */
export function env<T extends object>(workerBindings: T): T;
export function env(): BunEnvironment;
export function env<T extends object>(workerBindings?: T): T | BunEnvironment {
    if (workerBindings !== undefined) return workerBindings;

    const bun = (globalThis as typeof globalThis & { Bun?: { env: BunEnvironment } }).Bun;
    if (bun) return bun.env;

    throw new Error("Cloudflare Workers の env バインディング、または Bun.env が必要です。");
}
