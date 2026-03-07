import { z } from 'zod';

export const teachersResponseSchema = z.array(
  z.object({
    id: z.string(),
    staffProfileId: z.string(),
    specialization: z.string().nullable().optional(),
    experienceYears: z.number().nullable().optional(),
    createdAt: z.string(),
  }),
);
