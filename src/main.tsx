import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/providers/AuthProvider";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: "#FFFFFF",
                color: "#2A2A28",
                border: "1px solid #E8E4DB",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                fontSize: "13px",
                padding: "10px 14px",
              },
              success: { iconTheme: { primary: "#B45309", secondary: "#FFFFFF" } },
              error: { iconTheme: { primary: "#A32D2D", secondary: "#FFFFFF" } },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
