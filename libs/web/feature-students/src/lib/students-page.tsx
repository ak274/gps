import { useAuth, useRequireAuth } from '@gps/auth';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@gps/web-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { z } from 'zod';

import {
  createEnrollment,
  listClassrooms,
  listStudentEnrollments,
  listStudents,
} from './api';
import {
  classroomsResponseSchema,
  enrollmentSchema,
  studentsFiltersSchema,
  studentsResponseSchema,
} from './schemas';

type StudentRow = z.infer<typeof studentsResponseSchema>['data'][number];
type ClassroomRow = z.infer<typeof classroomsResponseSchema>[number];
type EnrollmentRow = z.infer<typeof enrollmentSchema>;

export function StudentsPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedClassroomByStudent, setSelectedClassroomByStudent] = useState<Record<string, string>>({});

  useRequireAuth({
    onRedirect: () => navigate({ to: '/login', search: { redirect: '/app/students' } }),
  });

  const form = useForm<z.infer<typeof studentsFiltersSchema>>({
    resolver: zodResolver(studentsFiltersSchema),
    defaultValues: {
      page: 1,
      pageSize: 20,
      search: '',
      schoolId: '',
    },
  });

  const filters = form.watch();
  const canReadStudents = auth.can('students.read');
  const canReadClassrooms = auth.can('classrooms.read');
  const canReadEnrollments = auth.can('enrollments.read');
  const canWriteEnrollments = auth.can('enrollments.write');

  const studentsQuery = useQuery({
    queryKey: ['students', filters],
    queryFn: () => listStudents(auth.authFetch, filters),
    enabled: canReadStudents,
  });

  const classroomsQuery = useQuery({
    queryKey: ['classrooms', filters.schoolId || 'all'],
    queryFn: () => listClassrooms(auth.authFetch),
    enabled: canReadClassrooms,
  });

  const studentRows = studentsQuery.data?.data ?? [];

  const enrollmentQueries = useQueries({
    queries: studentRows.map((student) => ({
      queryKey: ['student-enrollments', student.id],
      queryFn: () => listStudentEnrollments(auth.authFetch, student.id),
      enabled: canReadEnrollments,
    })),
  });

  const classRoomById = useMemo(
    () => new Map((classroomsQuery.data ?? []).map((classRoom) => [classRoom.id, classRoom])),
    [classroomsQuery.data],
  );

  const enrollmentByStudentId = useMemo(() => {
    const map = new Map<string, EnrollmentRow>();
    studentRows.forEach((student, index) => {
      const list = enrollmentQueries[index]?.data ?? [];
      const active = list.find((enrollment) => enrollment.status === 'ACTIVE');
      if (active) {
        map.set(student.id, active);
      } else if (list[0]) {
        map.set(student.id, list[0]);
      }
    });
    return map;
  }, [enrollmentQueries, studentRows]);

  const classroomOptionsBySchool = useMemo(() => {
    const map = new Map<string, ClassroomRow[]>();
    (classroomsQuery.data ?? []).forEach((classRoom) => {
      const list = map.get(classRoom.schoolId) ?? [];
      list.push(classRoom);
      map.set(classRoom.schoolId, list);
    });
    return map;
  }, [classroomsQuery.data]);

  const assignMutation = useMutation({
    mutationFn: async (payload: { studentId: string; classRoomId: string; academicYearId: string }) =>
      createEnrollment(auth.authFetch, {
        ...payload,
        enrolledOn: new Date().toISOString().slice(0, 10),
        status: 'ACTIVE',
      }),
    onSuccess: (_data, variables) => {
      setSelectedClassroomByStudent((prev) => ({ ...prev, [variables.studentId]: '' }));
      void queryClient.invalidateQueries({ queryKey: ['student-enrollments', variables.studentId] });
    },
  });

  const columns = useMemo<ColumnDef<StudentRow>[]>(
    () => [
      {
        accessorKey: 'admissionNo',
        header: 'Admission No',
      },
      {
        id: 'name',
        header: 'Name',
        cell: ({ row }) => `${row.original.firstName} ${row.original.lastName ?? ''}`.trim(),
      },
      {
        accessorKey: 'currentStatus',
        header: 'Status',
      },
      {
        id: 'classSection',
        header: 'Class / Section',
        cell: ({ row }) => {
          const enrollment = enrollmentByStudentId.get(row.original.id);
          if (!enrollment) return 'Not assigned';

          const classRoom = classRoomById.get(enrollment.classRoomId);
          if (!classRoom) return `Assigned (${enrollment.classRoomId})`;

          return `${classRoom.name} ${classRoom.section ?? '-'}`;
        },
      },
      {
        id: 'assign',
        header: 'Assign',
        cell: ({ row }) => {
          const enrollment = enrollmentByStudentId.get(row.original.id);
          if (enrollment) return <span className="text-xs text-muted-foreground">Already assigned</span>;

          const options = classroomOptionsBySchool.get(row.original.schoolId) ?? [];
          const selectedClassroomId = selectedClassroomByStudent[row.original.id] ?? '';
          const selectedClassroom = options.find((option) => option.id === selectedClassroomId);

          return (
            <div className="flex items-center gap-2">
              <Select
                value={selectedClassroomId}
                onValueChange={(classRoomId) => {
                  setSelectedClassroomByStudent((prev) => ({
                    ...prev,
                    [row.original.id]: classRoomId ?? '',
                  }));
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Choose class" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name} {option.section ?? '-'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                disabled={!selectedClassroom || assignMutation.isPending || !canWriteEnrollments}
                onClick={() => {
                  if (!selectedClassroom) return;
                  assignMutation.mutate({
                    studentId: row.original.id,
                    classRoomId: selectedClassroom.id,
                    academicYearId: selectedClassroom.academicYearId,
                  });
                }}
              >
                Assign
              </Button>
            </div>
          );
        },
      },
    ],
    [assignMutation, canWriteEnrollments, classRoomById, classroomOptionsBySchool, enrollmentByStudentId, selectedClassroomByStudent],
  );

  const table = useReactTable({
    data: studentRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!canReadStudents) {
    return <p className="text-sm text-muted-foreground">Students access denied.</p>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
          <CardDescription>
            Search students, see current class/section, and assign unassigned students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(() => studentsQuery.refetch())}
            className="grid grid-cols-1 gap-3 md:grid-cols-3"
          >
            <Field>
              <FieldLabel htmlFor="students-search">Search</FieldLabel>
              <FieldContent>
                <Input id="students-search" {...form.register('search')} placeholder="Name or admission no" />
                <FieldError errors={[form.formState.errors.search]} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="students-school">School ID</FieldLabel>
              <FieldContent>
                <Input id="students-school" {...form.register('schoolId')} placeholder="Optional school scope" />
                <FieldError errors={[form.formState.errors.schoolId]} />
              </FieldContent>
            </Field>
            <div className="flex items-end">
              <Button type="submit" className="w-full">Apply Filters</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          {studentsQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : null}
          {studentsQuery.isError ? (
            <p className="text-sm text-destructive">{(studentsQuery.error as Error).message}</p>
          ) : null}
          {assignMutation.isError ? (
            <p className="text-sm text-destructive">{assignMutation.error.message}</p>
          ) : null}
          {studentsQuery.data ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Total: {studentsQuery.data.pagination.total} | Page: {studentsQuery.data.pagination.page}
              </p>
              <div className="overflow-hidden rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          No students found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
