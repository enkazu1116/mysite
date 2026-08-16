import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// 通常の `pnpm dev` のみ MSW。E2E（VITE_E2E=1）は実 Backend に繋ぐ。
if (import.meta.env.DEV && import.meta.env.VITE_E2E !== "1") {
  const { worker } = await import("./mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element #root not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
