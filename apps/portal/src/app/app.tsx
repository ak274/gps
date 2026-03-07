import { AuthProvider } from '@gps/auth';
import { AppQueryProvider, createQueryClient } from '@gps/web-query';
import { AppRouterDevtools } from '@gps/web-router';
import { RouterProvider } from '@tanstack/react-router';
import { useState } from 'react';
import { authPolicy } from './auth-policy';
import { router } from './router';

export function App() {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <AppQueryProvider client={queryClient}>
      <AuthProvider policy={authPolicy}>
        <RouterProvider router={router} />
        <AppRouterDevtools router={router} />
      </AuthProvider>
    </AppQueryProvider>
  );
}

export default App;
