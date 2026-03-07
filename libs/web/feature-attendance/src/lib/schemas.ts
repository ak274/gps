import { z } from 'zod';

export const attendanceSessionsSchema = z.array(
  z.object({
    id: z.string(),
    classRoomId: z.string(),
    subjectId: z.string().nullable().optional(),
    periodNo: z.number().nullable().optional(),
    attendanceOn: z.string(),
  }),
);

export const attendanceRecordsSchema = z.array(
  z.object({
    id: z.string(),
    attendanceSessionId: z.string(),
    studentId: z.string(),
    status: z.string(),
    remarks: z.string().nullable().optional(),
    markedAt: z.string(),
  }),
);

export const attendanceMarkSchema = z.object({
  sessionId: z.string().min(1),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
  studentIdsCsv: z.string().optional(),
  remainingStatus: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']).optional(),
  remarks: z.string().optional(),
});

export type AttendanceMarkInput = z.infer<typeof attendanceMarkSchema>;
