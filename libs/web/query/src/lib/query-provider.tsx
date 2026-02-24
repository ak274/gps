import {
  QueryClientProvider,
  type QueryClient,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type PropsWithChildren } from 'react';

export type AppQueryProviderProps = PropsWithChildren<{
  client: QueryClient;
}>;

export function AppQueryProvider({ client, children }: AppQueryProviderProps) {
  return (
    <QueryClientProvider client={client}>
      {children}
      {import.meta.env.DEV ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}

