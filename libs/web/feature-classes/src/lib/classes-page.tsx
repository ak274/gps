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

import { createClassWithSections, listClassesWithSections } from './api';
import { classFiltersSchema, classWithSectionsResponseSchema, createClassWithSectionsSchema } from './schemas';

type ClassWithSectionsRow = z.infer<typeof classWithSectionsResponseSchema>[number];

export function ClassesPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useRequireAuth({
    onRedirect: () => navigate({ to: '/login', search: { redirect: '/app/classes' } }),
  });

  const canReadClasses = auth.can('classrooms.read');
  const canWriteClasses = auth.can('classrooms.write');

  const filtersForm = useForm<z.infer<typeof classFiltersSchema>>({
    resolver: zodResolver(classFiltersSchema),
    defaultValues: {
      schoolId: '',
      academicYearId: '',
      search: '',
    },
  });

  const createForm = useForm<z.infer<typeof createClassWithSectionsSchema>>({
    resolver: zodResolver(createClassWithSectionsSchema),
    defaultValues: {
      schoolId: '',
      campusId: '',
      academicYearId: '',
      name: '',
      gradeLevel: '',
      sectionsCsv: 'A,B',
      homeRoomTeacherId: '',
    },
  });

  const filters = filtersForm.watch();

  const classesQuery = useQuery({
    queryKey: ['classes-with-sections', filters],
    queryFn: () => listClassesWithSections(auth.authFetch, filters),
    enabled: canReadClasses,
  });

  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof createClassWithSectionsSchema>) =>
      createClassWithSections(auth.authFetch, values),
    onSuccess: () => {
      createForm.reset({
        schoolId: '',
        campusId: '',
        academicYearId: '',
        name: '',
        gradeLevel: '',
        sectionsCsv: 'A,B',
        homeRoomTeacherId: '',
      });
      void classesQuery.refetch();
    },
  });

  const columns = useMemo<ColumnDef<ClassWithSectionsRow>[]>(
    () => [
      { accessorKey: 'schoolId', header: 'School ID' },
      { accessorKey: 'academicYearId', header: 'Academic Year' },
      { accessorKey: 'name', header: 'Class' },
      { accessorKey: 'gradeLevel', header: 'Grade' },
      {
        id: 'sections',
        header: 'Sections',
        cell: ({ row }) => row.original.sections.join(', '),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: classesQuery.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!canReadClasses) {
    return <p className="text-sm text-muted-foreground">Classes access denied.</p>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Classes & Sections</CardTitle>
          <CardDescription>Manage class groups and sections for each academic year.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={filtersForm.handleSubmit(() => classesQuery.refetch())}
            className="grid grid-cols-1 gap-3 md:grid-cols-4"
          >
            <Field>
              <FieldLabel htmlFor="classes-school-id">School ID</FieldLabel>
              <FieldContent>
                <Input id="classes-school-id" {...filtersForm.register('schoolId')} />
                <FieldError errors={[filtersForm.formState.errors.schoolId]} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="classes-academic-year">Academic Year ID</FieldLabel>
              <FieldContent>
                <Input id="classes-academic-year" {...filtersForm.register('academicYearId')} />
                <FieldError errors={[filtersForm.formState.errors.academicYearId]} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="classes-search">Search</FieldLabel>
              <FieldContent>
                <Input id="classes-search" {...filtersForm.register('search')} />
                <FieldError errors={[filtersForm.formState.errors.search]} />
              </FieldContent>
            </Field>
            <div className="flex items-end">
              <Button type="submit" className="w-full">Apply</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Class List</CardTitle>
        </CardHeader>
        <CardContent>
          {classesQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading classes...</p> : null}
          {classesQuery.isError ? (
            <p className="text-sm text-destructive">{(classesQuery.error as Error).message}</p>
          ) : null}
          {classesQuery.data ? (
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
                        No classes found.
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
          <CardTitle>Create Class With Sections</CardTitle>
          <CardDescription>Create one class and multiple sections in a single request.</CardDescription>
        </CardHeader>
        <CardContent>
          {!canWriteClasses ? (
            <p className="text-sm text-muted-foreground">Classroom write access denied.</p>
          ) : (
            <form
              onSubmit={createForm.handleSubmit((values) => createMutation.mutate(values))}
              className="grid grid-cols-1 gap-3 md:grid-cols-2"
            >
              <Field>
                <FieldLabel htmlFor="create-class-school-id">School ID</FieldLabel>
                <FieldContent>
                  <Input id="create-class-school-id" {...createForm.register('schoolId')} />
                  <FieldError errors={[createForm.formState.errors.schoolId]} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="create-class-campus-id">Campus ID</FieldLabel>
                <FieldContent>
                  <Input id="create-class-campus-id" {...createForm.register('campusId')} />
                  <FieldError errors={[createForm.formState.errors.campusId]} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="create-class-year-id">Academic Year ID</FieldLabel>
                <FieldContent>
                  <Input id="create-class-year-id" {...createForm.register('academicYearId')} />
                  <FieldError errors={[createForm.formState.errors.academicYearId]} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="create-class-name">Class Name</FieldLabel>
                <FieldContent>
                  <Input id="create-class-name" {...createForm.register('name')} />
                  <FieldError errors={[createForm.formState.errors.name]} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="create-class-grade">Grade Level</FieldLabel>
                <FieldContent>
                  <Input id="create-class-grade" {...createForm.register('gradeLevel')} />
                  <FieldError errors={[createForm.formState.errors.gradeLevel]} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="create-class-sections">Sections (CSV)</FieldLabel>
                <FieldContent>
                  <Input id="create-class-sections" {...createForm.register('sectionsCsv')} />
                  <FieldError errors={[createForm.formState.errors.sectionsCsv]} />
                </FieldContent>
              </Field>
              <div className="md:col-span-2">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create Class'}
                </Button>
              </div>
            </form>
          )}
          {createMutation.isError ? (
            <p className="mt-3 text-sm text-destructive">{createMutation.error.message}</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
