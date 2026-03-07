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
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@gps/web-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { z } from 'zod';

import { listAttendanceSessions, markAttendance } from './api';
import { attendanceMarkSchema, attendanceSessionsSchema } from './schemas';

const formSchema = attendanceMarkSchema.extend({
  remainingStatus: attendanceMarkSchema.shape.remainingStatus.or(z.literal('')),
});
type AttendanceSessionRow = z.infer<typeof attendanceSessionsSchema>[number];

export function AttendancePage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useRequireAuth({
    onRedirect: () => navigate({ to: '/login', search: { redirect: '/app/attendance' } }),
  });

  const canReadSessions = auth.can('attendance.sessions.read');
  const canWriteRecords = auth.can('attendance.records.write');

  const sessionsQuery = useQuery({
    queryKey: ['attendance', 'sessions'],
    queryFn: () => listAttendanceSessions(auth.authFetch),
    enabled: canReadSessions,
  });

  const sessionColumns = useMemo<ColumnDef<AttendanceSessionRow>[]>(
    () => [
      { accessorKey: 'id', header: 'Session ID' },
      { accessorKey: 'classRoomId', header: 'Classroom' },
      {
        accessorKey: 'periodNo',
        header: 'Period',
        cell: ({ row }) => row.original.periodNo ?? 'N/A',
      },
      {
        accessorKey: 'attendanceOn',
        header: 'Date',
        cell: ({ row }) => new Date(row.original.attendanceOn).toLocaleDateString(),
      },
    ],
    [],
  );

  const sessionsTable = useReactTable({
    data: sessionsQuery.data ?? [],
    columns: sessionColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sessionId: '',
      status: 'PRESENT',
      studentIdsCsv: '',
      remainingStatus: 'ABSENT',
      remarks: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: z.infer<typeof formSchema>) =>
      markAttendance(auth.authFetch, {
        ...payload,
        remainingStatus: payload.remainingStatus || undefined,
      }),
  });

  if (!canReadSessions) {
    return <p className="text-sm text-muted-foreground">Attendance access denied.</p>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Sessions</CardTitle>
          <CardDescription>Use one-click full-class marking or selected student IDs.</CardDescription>
        </CardHeader>
        <CardContent>
          {sessionsQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading sessions...</p> : null}
          {sessionsQuery.isError ? (
            <p className="text-sm text-destructive">{(sessionsQuery.error as Error).message}</p>
          ) : null}
          {sessionsQuery.data ? (
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  {sessionsTable.getHeaderGroups().map((headerGroup) => (
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
                  {sessionsTable.getRowModel().rows.length ? (
                    sessionsTable.getRowModel().rows.map((row) => (
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
                      <TableCell colSpan={sessionColumns.length} className="h-24 text-center">
                        No sessions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>
            Leave student IDs empty to mark full class in one click. For partial selection, provide CSV IDs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!canWriteRecords ? (
            <p className="text-sm text-muted-foreground">Attendance write access denied.</p>
          ) : (
            <form
              className="grid grid-cols-1 gap-3 md:grid-cols-2"
              onSubmit={form.handleSubmit((values) => {
                mutation.mutate(values);
              })}
            >
              <Field>
                <FieldLabel htmlFor="attendance-session-id">Session ID</FieldLabel>
                <FieldContent>
                  <Input id="attendance-session-id" {...form.register('sessionId')} />
                  <FieldError errors={[form.formState.errors.sessionId]} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="attendance-status">Status</FieldLabel>
                <FieldContent>
                  <Input id="attendance-status" {...form.register('status')} placeholder="PRESENT | ABSENT | LATE | EXCUSED" />
                  <FieldError errors={[form.formState.errors.status]} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="attendance-student-ids">Student IDs (CSV)</FieldLabel>
                <FieldContent>
                  <Input id="attendance-student-ids" {...form.register('studentIdsCsv')} placeholder="id1,id2,id3" />
                  <FieldDescription>Optional. Empty means full class.</FieldDescription>
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="attendance-remaining-status">Remaining Students Status</FieldLabel>
                <FieldContent>
                  <Input
                    id="attendance-remaining-status"
                    {...form.register('remainingStatus')}
                    placeholder="ABSENT (optional)"
                  />
                </FieldContent>
              </Field>
              <Field className="md:col-span-2">
                <FieldLabel htmlFor="attendance-remarks">Remarks</FieldLabel>
                <FieldContent>
                  <Input id="attendance-remarks" {...form.register('remarks')} />
                </FieldContent>
              </Field>
              <div className="md:col-span-2">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Marking...' : 'Mark Attendance'}
                </Button>
              </div>
            </form>
          )}
          {mutation.isError ? <p className="mt-3 text-sm text-destructive">{mutation.error.message}</p> : null}
          {mutation.data ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Updated {mutation.data.length} attendance records successfully.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
