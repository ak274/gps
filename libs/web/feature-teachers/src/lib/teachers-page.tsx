import { useAuth, useRequireAuth } from '@gps/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@gps/web-ui';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';
import { z } from 'zod';

import { listTeachers } from './api';
import { teachersResponseSchema } from './schemas';

type TeacherRow = z.infer<typeof teachersResponseSchema>[number];

export function TeachersPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useRequireAuth({
    onRedirect: () => navigate({ to: '/login', search: { redirect: '/app/teachers' } }),
  });

  const canReadTeachers = auth.can('teachers.read');

  const query = useQuery({
    queryKey: ['teachers'],
    queryFn: () => listTeachers(auth.authFetch),
    enabled: canReadTeachers,
  });

  const columns = useMemo<ColumnDef<TeacherRow>[]>(
    () => [
      { accessorKey: 'id', header: 'Teacher ID' },
      { accessorKey: 'staffProfileId', header: 'Staff Profile' },
      {
        accessorKey: 'specialization',
        header: 'Specialization',
        cell: ({ row }) => row.original.specialization ?? 'N/A',
      },
      {
        accessorKey: 'experienceYears',
        header: 'Experience',
        cell: ({ row }) =>
          row.original.experienceYears == null ? 'N/A' : `${row.original.experienceYears} years`,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: query.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!canReadTeachers) {
    return <p className="text-sm text-muted-foreground">Teachers access denied.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teachers</CardTitle>
        <CardDescription>Teacher directory from the backend staff APIs.</CardDescription>
      </CardHeader>
      <CardContent>
        {query.isLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : null}
        {query.isError ? <p className="text-sm text-destructive">{(query.error as Error).message}</p> : null}
        {query.data ? (
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
                      No teachers found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
