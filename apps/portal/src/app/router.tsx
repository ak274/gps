import { Link, Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { Button } from '@gps/web-ui';

function RootLayout() {
  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="border-b bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="text-sm font-semibold tracking-wide">GPS Portal</div>
          <nav className="flex items-center gap-3 text-sm">
            <Link to="/" className="text-slate-700 hover:text-slate-950">
              Home
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

function HomePage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold tracking-tight">Portal</h1>
      <p className="text-slate-700">
        TanStack Router + React Query + Tailwind v4 scaffolding is wired. Next: auth flows and feature libs.
      </p>
      <div className="flex items-center gap-2">
        <Button>Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
      </div>
    </div>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const routeTree = rootRoute.addChildren([indexRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
