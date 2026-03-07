import type { AbacPolicy } from '@gps/auth';

export const authPolicy: AbacPolicy = {
  'students.read': ({ user, context }) => {
    if (user.roles.includes('admin')) return true;
    const schoolId = context?.schoolId;
    const userSchoolId = user.attributes?.schoolId;
    return typeof schoolId === 'string' && schoolId === userSchoolId;
  },
  'students.write': ({ user }) => user.roles.includes('admin'),
  'classrooms.read': ({ user }) => user.roles.includes('admin') || user.roles.includes('teacher'),
  'classrooms.write': ({ user }) => user.roles.includes('admin'),
  'enrollments.read': ({ user }) => user.roles.includes('admin') || user.roles.includes('teacher'),
  'enrollments.write': ({ user }) => user.roles.includes('admin') || user.roles.includes('teacher'),
  'teachers.read': ({ user }) => user.roles.includes('admin') || user.roles.includes('teacher'),
  'teachers.write': ({ user }) => user.roles.includes('admin'),
  'attendance.sessions.read': ({ user }) =>
    user.roles.includes('admin') || user.roles.includes('teacher'),
  'attendance.records.read': ({ user }) =>
    user.roles.includes('admin') || user.roles.includes('teacher'),
  'attendance.records.write': ({ user }) =>
    user.roles.includes('admin') || user.roles.includes('teacher'),
  'billing.feePlans.read': ({ user }) =>
    user.roles.includes('admin') || user.roles.includes('accountant'),
};
