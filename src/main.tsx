import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: "var(--color-card)",
                  color: "var(--color-ink)",
                  border: "1px solid var(--color-line)",
                  borderRadius: "10px",
                  boxShadow: "var(--shadow-paper-hover)",
                  fontSize: "13px",
                  padding: "10px 14px",
                },
                success: {
                  iconTheme: {
                    primary: "var(--color-accent)",
                    secondary: "var(--color-card)",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "var(--color-prio-high-ink)",
                    secondary: "var(--color-card)",
                  },
                },
              }}
            />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
