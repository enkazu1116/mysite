import { bindings, defineConfig } from "cf/config";

/**
 * D1 の migrations_dir は cloudflare.config.ts に載らない。
 * 適用時はルートで `pnpm db:migrate`（wrangler + backend/migrations）を使う。
 */
export default defineConfig({
	worker: {
		name: "mysite",
		compatibilityDate: "2026-10-29",
		compatibilityFlags: [
			"nodejs_compat",
		],
		entrypoint: "./src/index.ts",
		observability: {
			enabled: true,
			traces: {
				enabled: true,
			},
		},
		assets: {
			notFoundHandling: "single-page-application",
			runWorkerFirst: [
				"/api/*",
				"/health",
			],
		},
		env: {
			DB: bindings.d1({
				name: "mysite",
			}),
			ASSETS: bindings.assets(),
		},
	},
});
