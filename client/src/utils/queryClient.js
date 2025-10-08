// queryClient.js - React Query setup
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global defaults for all queries - optimized for your use case
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime in v5)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors except 408 (timeout), 429 (rate limit)
        if (error?.status >= 400 && error?.status < 500 && 
            error?.status !== 408 && error?.status !== 429) {
          return false;
        }
        // Retry up to 2 times for other errors (faster failure detection)
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Max 10s delay
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: true, // Refetch when component mounts
      refetchOnReconnect: true, // Refetch when internet reconnects
      networkMode: 'online', // Only run queries when online
    },
    mutations: {
      retry: 1, // Retry mutations once
      networkMode: 'online',
    },
  },
});