import { QueryClient } from '@tanstack/react-query';

export type CreateQueryClientOptions = {
  staleTimeMs?: number;
};

export function createQueryClient(options: CreateQueryClientOptions = {}) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: options.staleTimeMs ?? 30_000,
        retry: 0,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

