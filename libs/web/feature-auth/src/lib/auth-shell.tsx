import type { PropsWithChildren } from 'react';

export function AuthShell({
  title,
  subtitle,
  children,
}: PropsWithChildren<{ title: string; subtitle: string }>) {
  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

