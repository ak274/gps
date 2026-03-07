import { z } from 'zod';

export const classWithSectionsSchema = z.object({
  schoolId: z.string(),
  academicYearId: z.string(),
  name: z.string(),
  gradeLevel: z.string(),
  sections: z.array(z.string()),
  classroomIds: z.array(z.string()),
});

export const classWithSectionsResponseSchema = z.array(classWithSectionsSchema);

export const classFiltersSchema = z.object({
  schoolId: z.string().optional(),
  academicYearId: z.string().optional(),
  search: z.string().optional(),
});

export const createClassWithSectionsSchema = z.object({
  schoolId: z.string().min(1),
  campusId: z.string().optional(),
  academicYearId: z.string().min(1),
  name: z.string().min(2),
  gradeLevel: z.string().min(1),
  sectionsCsv: z.string().min(1),
  capacity: z.number().int().min(1).optional(),
  homeRoomTeacherId: z.string().optional(),
});
