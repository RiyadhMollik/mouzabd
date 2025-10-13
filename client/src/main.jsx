import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router/router.jsx";
import { RouterProvider } from "react-router-dom";
import AuthProvider from "./provider/AuthProvider.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import disableDevTools from "./utils/disableDevTools.js";
// import { queryClient } from './utils/queryClient.js';

// Disable DevTools - Now enabled for testing
// if (import.meta.env.MODE === 'production') {
  disableDevTools();
// }

// Initialize QueryClient

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global defaults for all queries - optimized for your use case
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime in v5)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors except 408 (timeout), 429 (rate limit)
        if (
          error?.status >= 400 &&
          error?.status < 500 &&
          error?.status !== 408 &&
          error?.status !== 429
        ) {
          return false;
        }
        // Retry up to 2 times for other errors (faster failure detection)
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Max 10s delay
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: true, // Refetch when component mounts
      refetchOnReconnect: true, // Refetch when internet reconnects
      networkMode: "online", // Only run queries when online
    },
    mutations: {
      retry: 1, // Retry mutations once
      networkMode: "online",
    },
  },
});
const GOOGLE_CLIENT_ID = "185874875197-ap6gf3b6p03tjns8h1riq34moi8g58j8.apps.googleusercontent.com";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
      <RouterProvider router={router} />
</AuthProvider>
</GoogleOAuthProvider>
      {/* Development tools - only shows in development */}
    </QueryClientProvider>
  </StrictMode>
);
