import type { AnyRouter } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export function AppRouterDevtools({ router }: { router?: AnyRouter }) {
  if (!import.meta.env.DEV) return null;
  if (import.meta.env.MODE === 'test') return null;

  return <TanStackRouterDevtools router={router} position="bottom-right" />;
}
