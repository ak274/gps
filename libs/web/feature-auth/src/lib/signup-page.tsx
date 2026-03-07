import { useAuth } from '@gps/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardContent, Field, FieldContent, FieldError, FieldLabel, Input } from '@gps/web-ui';
import { Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { AuthShell } from './auth-shell';
import { signUpSchema } from './forms';

export function SignUpPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      tenantCode: '',
      email: '',
      password: '',
    },
  });
  const formError = form.formState.errors.root?.message ?? auth.lastError?.message ?? null;

  const onSubmit = form.handleSubmit(async (values) => {
    auth.clearError();
    try {
      await auth.signUp(values);
      await navigate({ to: '/' });
    } catch {
      form.setError('root', {
        message: auth.lastError?.message ?? 'Sign up failed',
      });
    }
  });

  return (
    <AuthShell title="Create account" subtitle="Register with your tenant to start using the portal.">
      <Card>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <Field>
              <FieldLabel htmlFor="signup-first-name">First Name</FieldLabel>
              <FieldContent>
                <Input id="signup-first-name" type="text" {...form.register('firstName')} />
                <FieldError errors={[form.formState.errors.firstName]} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="signup-last-name">Last Name</FieldLabel>
              <FieldContent>
                <Input id="signup-last-name" type="text" {...form.register('lastName')} />
                <FieldError errors={[form.formState.errors.lastName]} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="signup-tenant">Tenant Code</FieldLabel>
              <FieldContent>
                <Input id="signup-tenant" type="text" {...form.register('tenantCode')} />
                <FieldError errors={[form.formState.errors.tenantCode]} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="signup-email">Email</FieldLabel>
              <FieldContent>
                <Input id="signup-email" type="email" {...form.register('email')} />
                <FieldError errors={[form.formState.errors.email]} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="signup-password">Password</FieldLabel>
              <FieldContent>
                <Input id="signup-password" type="password" {...form.register('password')} />
                <FieldError errors={[form.formState.errors.password]} />
              </FieldContent>
            </Field>
            {formError ? <FieldError>{formError}</FieldError> : null}
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
