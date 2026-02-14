import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  JWT_ISSUER: z.string().default('gps-api'),
  JWT_AUDIENCE: z.string().default('gps-clients'),
});

export type AppEnv = z.infer<typeof envSchema>;

export const validateEnv = (config: Record<string, unknown>): AppEnv => {
  const mode = (config.NODE_ENV ?? process.env.NODE_ENV ?? 'development') as
    | 'development'
    | 'test'
    | 'production';

  if (mode === 'production') {
    const result = envSchema.safeParse(config);
    if (!result.success) {
      throw new Error(
        `Environment validation failed: ${result.error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join('; ')}`,
      );
    }
    return result.data;
  }

  return envSchema.parse(config);
};
