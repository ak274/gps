import { z } from 'zod';

export const studentsResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      admissionNo: z.string(),
      firstName: z.string(),
      lastName: z.string().nullable().optional(),
      currentStatus: z.string(),
      schoolId: z.string(),
    }),
  ),
  pagination: z.object({
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
  }),
});

export const classroomSchema = z.object({
  id: z.string(),
  schoolId: z.string(),
  academicYearId: z.string(),
  name: z.string(),
  gradeLevel: z.string(),
  section: z.string().nullable().optional(),
});

export const enrollmentSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  classRoomId: z.string(),
  academicYearId: z.string(),
  status: z.string(),
  enrolledOn: z.string(),
  leftOn: z.string().nullable().optional(),
  createdAt: z.string(),
});

export const enrollmentsResponseSchema = z.array(enrollmentSchema);
export const classroomsResponseSchema = z.array(classroomSchema);

export const createEnrollmentSchema = z.object({
  studentId: z.string().min(1),
  classRoomId: z.string().min(1),
  academicYearId: z.string().min(1),
  enrolledOn: z.string().min(1),
  status: z.string().optional(),
});

export const studentsFiltersSchema = z.object({
  search: z.string().optional(),
  schoolId: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});
