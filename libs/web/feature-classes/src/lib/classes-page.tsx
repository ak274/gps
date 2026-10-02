import { useAuth, useRequireAuth } from '@gps/auth';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@gps/web-ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { ArrowUpRight, BookOpen, Check, Layers3, Plus, Sparkles, UsersRound } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

type School = { id: string; name: string; code?: string };
type AcademicYear = { id: string; schoolId: string; name: string; isCurrent: boolean };
type Classroom = { id: string; name: string; gradeLevel: string; section?: string | null; academicYearId: string };
type Subject = { id: string; code: string; name: string; isOptional: boolean };
type Teacher = { id: string; firstName?: string; lastName?: string | null; specialization?: string | null };
type Assignment = {
  id: string;
  classRoomId: string;
  className: string;
  section?: string | null;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  teacherId?: string | null;
  teacherName?: string | null;
};
type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

async function request<T>(authFetch: Fetcher, path: string, init?: RequestInit): Promise<T> {
  const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
  const response = await authFetch(`${apiBase}${path}`, {
    ...init,
    headers: { accept: 'application/json', ...(init?.body ? { 'content-type': 'application/json' } : {}), ...init?.headers },
  });
  const body = await response.json().catch(() => undefined);
  if (!response.ok) throw new Error(body?.message ?? `Request failed (${response.status})`);
  return body as T;
}

const initials = (value: string) => value.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

export function ClassesPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [schoolId, setSchoolId] = useState('');
  const [yearId, setYearId] = useState('');
  const [className, setClassName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [sections, setSections] = useState('A, B');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [assignment, setAssignment] = useState({ classRoomId: '', subjectId: '', teacherId: '' });
  const canRead = auth.can('classrooms.read');
  const canWrite = auth.can('classrooms.write');

  useRequireAuth({ onRedirect: () => navigate({ to: '/login', search: { redirect: '/app/classes' } }) });

  const schools = useQuery({
    queryKey: ['academic-setup-schools'],
    queryFn: () => request<School[]>(auth.authFetch, '/api/schools'),
    enabled: canRead,
  });
  const activeSchoolId = schoolId || schools.data?.[0]?.id || '';
  const years = useQuery({
    queryKey: ['academic-years', activeSchoolId],
    queryFn: () => request<AcademicYear[]>(auth.authFetch, `/api/academic-years?schoolId=${activeSchoolId}`),
    enabled: canRead && Boolean(activeSchoolId),
  });
  const activeYearId = yearId || years.data?.find((year) => year.isCurrent)?.id || years.data?.[0]?.id || '';
  const classrooms = useQuery({
    queryKey: ['academic-classrooms', activeSchoolId, activeYearId],
    queryFn: () => request<Classroom[]>(auth.authFetch, `/api/classrooms?schoolId=${activeSchoolId}`),
    enabled: canRead && Boolean(activeSchoolId),
  });
  const subjects = useQuery({
    queryKey: ['academic-subjects', activeSchoolId],
    queryFn: () => request<Subject[]>(auth.authFetch, `/api/subjects?schoolId=${activeSchoolId}`),
    enabled: canRead && Boolean(activeSchoolId),
  });
  const teachers = useQuery({
    queryKey: ['academic-teachers'],
    queryFn: () => request<Teacher[]>(auth.authFetch, '/api/staff/teachers/list'),
    enabled: canRead,
  });
  const assignments = useQuery({
    queryKey: ['academic-assignments', activeSchoolId, activeYearId],
    queryFn: () => request<Assignment[]>(auth.authFetch, `/api/classroom-subjects?schoolId=${activeSchoolId}&academicYearId=${activeYearId}`),
    enabled: canRead && Boolean(activeSchoolId),
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['academic-classrooms'] });
    void queryClient.invalidateQueries({ queryKey: ['academic-subjects'] });
    void queryClient.invalidateQueries({ queryKey: ['academic-assignments'] });
  };
  const mutation = useMutation({
    mutationFn: ({ path, body }: { path: string; body: unknown }) => request(auth.authFetch, path, { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: invalidate,
  });

  const currentClassrooms = useMemo(() => (classrooms.data ?? []).filter((row) => row.academicYearId === activeYearId), [classrooms.data, activeYearId]);
  const setupPercent = Math.round([currentClassrooms.length > 0, (subjects.data?.length ?? 0) > 0, (assignments.data?.length ?? 0) > 0].filter(Boolean).length / 3 * 100);

  if (!canRead) return <p className="text-sm text-muted-foreground">Academic setup access denied.</p>;

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-[28px] bg-[#17233b] px-6 py-8 text-[#f6f3ea] shadow-2xl shadow-slate-900/10 md:px-10 md:py-10">
        <div className="absolute -right-12 -top-24 h-72 w-72 rounded-full bg-[#d7a94b]/15 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#dfbd73]"><Sparkles className="h-4 w-4" /> Academic command centre</div>
            <div className="max-w-2xl space-y-3"><h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Shape the year before the year shapes you.</h1><p className="max-w-xl text-sm leading-7 text-slate-300 md:text-base">Set up the academic spine of your school in one calm, guided workspace—classes, sections, subjects, and the teachers who bring them to life.</p></div>
            <div className="flex flex-wrap gap-3">
              <label className="min-w-[220px] space-y-1.5 text-xs font-medium text-slate-300">School<select value={activeSchoolId} onChange={(event) => { setSchoolId(event.target.value); setYearId(''); }} className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white outline-none"><option value="" className="text-slate-900">Select school</option>{(schools.data ?? []).map((school) => <option key={school.id} value={school.id} className="text-slate-900">{school.name}</option>)}</select></label>
              <label className="min-w-[180px] space-y-1.5 text-xs font-medium text-slate-300">Academic year<select value={activeYearId} onChange={(event) => setYearId(event.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white outline-none"><option value="" className="text-slate-900">Select year</option>{(years.data ?? []).map((year) => <option key={year.id} value={year.id} className="text-slate-900">{year.name}{year.isCurrent ? ' · Current' : ''}</option>)}</select></label>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-[0.18em] text-slate-400">Setup pulse</p><p className="mt-2 text-4xl font-semibold">{setupPercent}%</p></div><div className="rounded-full bg-[#d7a94b]/20 p-2.5 text-[#dfbd73]"><Check className="h-5 w-5" /></div></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#d7a94b] transition-all" style={{ width: `${setupPercent}%` }} /></div><p className="mt-3 text-xs leading-5 text-slate-400">A strong setup makes admissions, attendance, timetables, and reporting feel effortless later.</p></div>
        </div>
      </section>

      {mutation.isError ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{(mutation.error as Error).message}</div> : null}
      <div className="grid gap-4 md:grid-cols-3"><Metric icon={<Layers3 />} label="Classes & sections" value={currentClassrooms.length} hint="The structure students belong to" /><Metric icon={<BookOpen />} label="Subjects" value={subjects.data?.length ?? 0} hint="The curriculum you deliver" /><Metric icon={<UsersRound />} label="Teaching assignments" value={assignments.data?.filter((item) => item.teacherId).length ?? 0} hint="Subjects with an owner" /></div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden border-slate-200/80 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-[#fbfaf7] pb-5"><div className="flex items-start justify-between gap-4"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#a47725]">01 · Foundation</p><CardTitle>Classes & sections</CardTitle><CardDescription>Build the rooms your academic year runs through.</CardDescription></div><div className="rounded-2xl bg-[#efe8d7] p-3 text-[#8b681d]"><Layers3 className="h-5 w-5" /></div></div></CardHeader>
          <CardContent className="space-y-5 pt-6">
            {currentClassrooms.length ? <div className="grid gap-3 sm:grid-cols-2">{groupClasses(currentClassrooms).map((item) => <div key={item.name} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-start justify-between"><div><p className="font-semibold text-slate-900">{item.name}</p><p className="mt-1 text-xs text-slate-500">Grade {item.gradeLevel}</p></div><span className="rounded-full bg-[#f3efe5] px-2.5 py-1 text-xs font-semibold text-[#85651d]">{item.sections.length} sections</span></div><div className="mt-4 flex flex-wrap gap-1.5">{item.sections.map((section) => <span key={section} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">Section {section || '—'}</span>)}</div></div>)}</div> : <EmptyState title="Your academic canvas is ready" body="Start with your first class and add its sections in one move." />}
            {canWrite ? <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2"><Input placeholder="Class name · Grade 8" value={className} onChange={(event) => setClassName(event.target.value)} /><Input placeholder="Grade level · 8" value={gradeLevel} onChange={(event) => setGradeLevel(event.target.value)} /><Input className="sm:col-span-2" placeholder="Sections · A, B, C" value={sections} onChange={(event) => setSections(event.target.value)} /><Button className="sm:col-span-2" disabled={!activeSchoolId || !activeYearId || !className || !gradeLevel || mutation.isPending} onClick={() => { mutation.mutate({ path: '/api/classrooms/with-sections', body: { schoolId: activeSchoolId, academicYearId: activeYearId, name: className, gradeLevel, sections: sections.split(',').map((part) => part.trim()).filter(Boolean) } }); setClassName(''); setGradeLevel(''); }}>{mutation.isPending ? 'Creating…' : <><Plus className="mr-2 h-4 w-4" /> Add class with sections</>}</Button></div> : null}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-slate-200/80 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-[#fbfaf7] pb-5"><div className="flex items-start justify-between gap-4"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#a47725]">02 · Curriculum</p><CardTitle>Subjects</CardTitle><CardDescription>Name the learning areas your school offers.</CardDescription></div><div className="rounded-2xl bg-[#efe8d7] p-3 text-[#8b681d]"><BookOpen className="h-5 w-5" /></div></div></CardHeader>
          <CardContent className="space-y-5 pt-6"><div className="flex flex-wrap gap-2">{(subjects.data ?? []).map((subject) => <span key={subject.id} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm"><span className="font-mono text-xs font-semibold text-[#a47725]">{subject.code}</span>{subject.name}</span>)}</div>{canWrite ? <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-[110px_1fr_auto]"><Input placeholder="Code" value={subjectCode} onChange={(event) => setSubjectCode(event.target.value.toUpperCase())} /><Input placeholder="Subject name" value={subjectName} onChange={(event) => setSubjectName(event.target.value)} /><Button size="icon" aria-label="Add subject" disabled={!activeSchoolId || !subjectCode || !subjectName || mutation.isPending} onClick={() => { mutation.mutate({ path: '/api/subjects', body: { schoolId: activeSchoolId, code: subjectCode, name: subjectName } }); setSubjectCode(''); setSubjectName(''); }}><Plus className="h-4 w-4" /></Button></div> : null}</CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-slate-200/80 shadow-sm"><CardHeader className="border-b border-slate-100 bg-[#17233b] text-[#f6f3ea]"><div className="flex items-start justify-between gap-4"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#dfbd73]">03 · Ownership</p><CardTitle className="text-[#f6f3ea]">Assign the people behind the timetable</CardTitle><CardDescription className="text-slate-300">Every subject can have a clear teacher owner for each class and section.</CardDescription></div><div className="rounded-2xl bg-white/10 p-3 text-[#dfbd73]"><UsersRound className="h-5 w-5" /></div></div></CardHeader><CardContent className="space-y-5 pt-6"><div className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1fr_1fr_1fr_auto]"><SelectField label="Class & section" value={assignment.classRoomId} onChange={(value) => setAssignment({ ...assignment, classRoomId: value })} options={currentClassrooms.map((item) => ({ value: item.id, label: `${item.name} · ${item.section ?? 'Main'}` }))} /><SelectField label="Subject" value={assignment.subjectId} onChange={(value) => setAssignment({ ...assignment, subjectId: value })} options={(subjects.data ?? []).map((item) => ({ value: item.id, label: `${item.code} · ${item.name}` }))} /><SelectField label="Teacher" value={assignment.teacherId} onChange={(value) => setAssignment({ ...assignment, teacherId: value })} options={(teachers.data ?? []).map((item) => ({ value: item.id, label: [item.firstName, item.lastName].filter(Boolean).join(' ') || item.specialization || `Teacher ${initials(item.id)}` }))} /><Button className="mt-5" disabled={!canWrite || !assignment.classRoomId || !assignment.subjectId || mutation.isPending} onClick={() => { mutation.mutate({ path: '/api/classroom-subjects', body: { ...assignment, teacherId: assignment.teacherId || undefined } }); setAssignment({ classRoomId: '', subjectId: '', teacherId: '' }); }}><Check className="mr-2 h-4 w-4" /> Assign</Button></div><div className="divide-y divide-slate-100 rounded-2xl border border-slate-200">{(assignments.data ?? []).length ? (assignments.data ?? []).map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5"><div><p className="font-medium text-slate-900">{item.className} <span className="text-slate-400">·</span> {item.section ?? 'Main'}</p><p className="mt-1 text-xs text-slate-500">{item.subjectCode} · {item.subjectName}</p></div><span className={item.teacherName ? 'rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700' : 'rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700'}>{item.teacherName ?? 'Needs a teacher'}</span></div>) : <EmptyState title="No teaching assignments yet" body="Connect a subject to a class section and the right teacher." />}</div><p className="flex items-center gap-2 text-xs text-slate-500"><ArrowUpRight className="h-3.5 w-3.5" /> This setup becomes the source of truth for future timetables, attendance, and academic reporting.</p></CardContent></Card>
    </div>
  );
}

function Metric({ icon, label, value, hint }: { icon: ReactNode; label: string; value: number; hint: string }) {
  return <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"><div className="rounded-xl bg-[#f3efe5] p-2.5 text-[#987321]">{icon}</div><div><p className="text-2xl font-semibold tracking-tight text-slate-900">{value}</p><p className="text-sm font-medium text-slate-700">{label}</p><p className="mt-0.5 text-xs text-slate-500">{hint}</p></div></div>;
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }> }) {
  return <label className="space-y-1.5 text-xs font-semibold text-slate-600">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-[#b38b3d]"><option value="">Choose…</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-8 text-center"><p className="font-medium text-slate-800">{title}</p><p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">{body}</p></div>;
}

function groupClasses(rows: Classroom[]) {
  const groups = new Map<string, { name: string; gradeLevel: string; sections: string[] }>();
  rows.forEach((row) => { const key = `${row.name}-${row.gradeLevel}`; const current = groups.get(key) ?? { name: row.name, gradeLevel: row.gradeLevel, sections: [] }; if (row.section && !current.sections.includes(row.section)) current.sections.push(row.section); groups.set(key, current); });
  return [...groups.values()];
}
