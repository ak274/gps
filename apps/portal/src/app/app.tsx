import { AuthProvider } from '@gps/web-auth';
import { AppQueryProvider, createQueryClient } from '@gps/web-query';
import { AppRouterDevtools } from '@gps/web-router';
import { RouterProvider } from '@tanstack/react-router';
import { useState } from 'react';
import { router } from './router';

export function App() {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <AppQueryProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <AppRouterDevtools router={router} />
      </AuthProvider>
    </AppQueryProvider>
  );
}

export default App;
