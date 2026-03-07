import { useAuth } from '@gps/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardContent, Field, FieldContent, FieldError, FieldLabel, Input } from '@gps/web-ui';
import { Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { AuthShell } from './auth-shell';
import { loginSchema } from './forms';

export function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      tenantCode: '',
    },
  });
  const formError = form.formState.errors.root?.message ?? auth.lastError?.message ?? null;

  const onSubmit = form.handleSubmit(async (values) => {
    auth.clearError();
    try {
      await auth.login({
        email: values.email,
        password: values.password,
        tenantCode: values.tenantCode || undefined,
      });
      await navigate({ to: '/' });
    } catch {
      form.setError('root', {
        message: auth.lastError?.message ?? 'Login failed',
      });
    }
  });

  return (
    <AuthShell title="Sign in" subtitle="Use your school account to access the portal.">
      <Card>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <Field>
              <FieldLabel htmlFor="login-email">Email</FieldLabel>
              <FieldContent>
                <Input id="login-email" type="email" {...form.register('email')} />
                <FieldError errors={[form.formState.errors.email]} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="login-password">Password</FieldLabel>
              <FieldContent>
                <Input id="login-password" type="password" {...form.register('password')} />
                <FieldError errors={[form.formState.errors.password]} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="login-tenant">Tenant Code (optional)</FieldLabel>
              <FieldContent>
                <Input id="login-tenant" type="text" {...form.register('tenantCode')} />
                <FieldError errors={[form.formState.errors.tenantCode]} />
              </FieldContent>
            </Field>
            {formError ? <FieldError>{formError}</FieldError> : null}
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="mt-4 text-sm text-muted-foreground">
        Need an account?{' '}
        <Link to="/signup" className="underline">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}
