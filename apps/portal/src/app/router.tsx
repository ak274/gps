import {
  getStoredSession,
  useAuth,
  useRequireAuth,
  useRequireGuest,
} from '@gps/auth';
import { LoginPage, SignUpPage } from '@gps/web-feature-auth';
import { AttendancePage } from '@gps/web-feature-attendance';
import { ClassesPage } from '@gps/web-feature-classes';
import { StudentsPage } from '@gps/web-feature-students';
import { TeachersPage } from '@gps/web-feature-teachers';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Progress,
  ProgressLabel,
  ProgressValue,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@gps/web-ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Link,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router';
import {
  BookOpenCheck,
  ChevronsUpDown,
  Building2,
  BadgeCheck,
  Bell,
  CheckCircle2,
  Command,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Moon,
  Plus,
  Search,
  Sparkles,
  Sun,
  Users,
  UsersRound,
  Wallet,
} from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';

type ThemeMode = 'light' | 'dark';

type SchoolLite = { id: string; name: string; code?: string };
type CampusLite = { id: string; schoolId: string; code: string; name: string };
type ClassroomLite = {
  id: string;
  name: string;
  section?: string | null;
  schoolId: string;
  campusId?: string | null;
};
type StaffLite = { id: string; firstName?: string | null; lastName?: string | null };
type TeacherLite = { id: string };
type StudentLite = { id: string; firstName: string; lastName?: string | null; admissionNo: string };
type AttendanceSessionLite = { id: string; classRoomId: string; attendanceOn: string };
type SchoolReadinessLite = {
  percent: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'READY';
  steps: Array<{
    id: string;
    label: string;
    description: string;
    complete: boolean;
    required: boolean;
    count: number;
    href: string;
  }>;
};
type StudentImportPreview = {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  records: Array<Record<string, unknown>>;
  errors: Array<{ rowIndex: number; code: string; message: string }>;
};
type PlatformTenantLite = { id: string; code: string; name: string; status: string; schoolCount: number };
type PlatformSchoolLite = {
  id: string;
  tenantCode: string;
  tenantName: string;
  code: string;
  name: string;
  board?: string | null;
  campusCount: number;
};
type StaffImportPreview = {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  records: Array<Record<string, unknown>>;
  errors: Array<{ rowIndex: number; code: string; message: string }>;
};
type AdmissionLite = {
  id: string; schoolId: string; academicYearId: string; classRoomId?: string | null;
  studentId?: string | null; status: 'DRAFT' | 'SUBMITTED' | 'REVIEWING' | 'APPROVED' | 'REJECTED' | 'ENROLLED' | 'WITHDRAWN';
  firstName: string; lastName?: string | null; dateOfBirth: string;
  guardianFirstName: string; guardianLastName?: string | null; guardianPhoneE164?: string | null;
  guardianEmail?: string | null; relationType: string; createdAt: string;
};
type FeePlanLite = { id: string; name: string; billingCycle: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'ONE_TIME'; currencyCode: string; items: Array<{ id: string; code: string; name: string; amount: string }> };
type FeeAssignmentLite = { id: string; feePlanId: string; feePlanName: string; scope: 'CLASS' | 'STUDENT'; targetId: string; targetLabel: string | null };
type InvoiceLite = { id: string; studentId: string; invoiceNumber?: string; status: string; totalAmount: string; balanceAmount: string; dueDate?: string | null };
type InvoiceScheduleLite = { id: string; feePlanId: string; feePlanName: string; name: string; billingCycle: string; issueDay: number; dueDay: number; invoiceCount: number; autoPublish: boolean; autoEmail: boolean; lastGeneratedAt?: string | null };
type LedgerLite = { studentId: string; currencyCode: string; closingBalance: string; entries: Array<{ id: string; type: string; date: string; description: string; debit: string; credit: string; balance: string; reference: string }> };
type PaymentLite = { id: string; receiptNumber: string; studentId: string; amount: string; method: string; paidAt: string };
type FamilyLite = { id: string; displayName: string; notes?: string | null; students: Array<{ id: string; firstName: string; lastName?: string | null; admissionNo: string; relationshipLabel?: string | null }>; guardians: Array<{ id: string; firstName: string; lastName?: string | null; relationshipLabel?: string | null }>; alumni: Array<{ id: string; name: string; relationshipLabel?: string | null; graduationYear?: string | null }>; benefits: Array<{ id: string; type: string; value: string; minimumStudentCount: number; reason: string }> };

type OnboardingStepId =
  | 'schoolProfile'
  | 'campuses'
  | 'classrooms'
  | 'students'
  | 'teachers'
  | 'staff'
  | 'feeStructures';

type OnboardingState = {
  skipped: boolean;
  steps: Record<OnboardingStepId, boolean>;
};

const onboardingStorageKey = 'gps.portal.onboarding.v1';
const schoolSwitchStorageKey = 'gps.portal.school-context.v1';
const onboardingPromptSessionKey = 'gps.portal.onboarding.prompted.v1';

const onboardingSteps: Array<{ id: OnboardingStepId; label: string; description: string }> = [
  {
    id: 'schoolProfile',
    label: 'School profile',
    description: 'Create and validate your school profile and board information.',
  },
  {
    id: 'campuses',
    label: 'Campuses',
    description: 'Configure all campuses for this tenant and define campus context.',
  },
  {
    id: 'classrooms',
    label: 'Classes & sections',
    description: 'Create classes/sections for the current academic session.',
  },
  {
    id: 'students',
    label: 'Students',
    description: 'Import or add students and verify admissions.',
  },
  {
    id: 'teachers',
    label: 'Teachers',
    description: 'Create teacher profiles and assignments.',
  },
  {
    id: 'staff',
    label: 'Staff',
    description: 'Add non-teaching staff records and roles.',
  },
  {
    id: 'feeStructures',
    label: 'Fee structures',
    description: 'Set fee plans/components/discounts for billing.',
  },
];

function getInitialOnboardingState(): OnboardingState {
  if (typeof window === 'undefined') {
    return {
      skipped: false,
      steps: Object.fromEntries(onboardingSteps.map((step) => [step.id, false])) as Record<
        OnboardingStepId,
        boolean
      >,
    };
  }

  const raw = localStorage.getItem(onboardingStorageKey);
  if (!raw) {
    return {
      skipped: false,
      steps: Object.fromEntries(onboardingSteps.map((step) => [step.id, false])) as Record<
        OnboardingStepId,
        boolean
      >,
    };
  }

  try {
    const parsed = JSON.parse(raw) as OnboardingState;
    return {
      skipped: Boolean(parsed.skipped),
      steps: {
        schoolProfile: Boolean(parsed.steps.schoolProfile),
        campuses: Boolean(parsed.steps.campuses),
        classrooms: Boolean(parsed.steps.classrooms),
        students: Boolean(parsed.steps.students),
        teachers: Boolean(parsed.steps.teachers),
        staff: Boolean(parsed.steps.staff),
        feeStructures: Boolean(parsed.steps.feeStructures),
      },
    };
  } catch {
    return {
      skipped: false,
      steps: Object.fromEntries(onboardingSteps.map((step) => [step.id, false])) as Record<
        OnboardingStepId,
        boolean
      >,
    };
  }
}

function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light';

    const stored = localStorage.getItem('gps.portal.theme');
    if (stored === 'dark' || stored === 'light') return stored;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('gps.portal.theme', mode);
  }, [mode]);

  return {
    mode,
    toggle: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark')),
  };
}

async function fetchJsonArray<T>(
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
  path: string,
): Promise<T[]> {
  const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
  const response = await authFetch(`${apiBase}${path}`, {
    method: 'GET',
    headers: { accept: 'application/json' },
  });

  const body = await response.json().catch(() => []);
  if (!response.ok || !Array.isArray(body)) return [];
  return body as T[];
}

function withQuery(path: string, query?: Record<string, string | undefined>): string {
  if (!query) return path;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value && value.length > 0) params.set(key, value);
  });
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

async function fetchStudents(
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
  schoolId?: string,
): Promise<StudentLite[]> {
  const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
  const response = await authFetch(
    `${apiBase}${withQuery('/api/students', {
      page: '1',
      pageSize: '15',
      schoolId,
    })}`,
    {
    method: 'GET',
    headers: { accept: 'application/json' },
  },
  );

  const body = await response.json().catch(() => ({ data: [] }));
  if (!response.ok || !body || typeof body !== 'object' || !Array.isArray(body.data)) return [];
  return body.data as StudentLite[];
}

async function fetchSchoolReadiness(
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
  schoolId: string,
): Promise<SchoolReadinessLite | null> {
  const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
  const response = await authFetch(`${apiBase}/api/schools/${schoolId}/readiness`, {
    method: 'GET',
    headers: { accept: 'application/json' },
  });

  const body = await response.json().catch(() => null);
  if (!response.ok || !body || typeof body !== 'object') return null;
  return body as SchoolReadinessLite;
}

function SidebarUserMenu({
  displayName,
  email,
  tenantCode,
  initials,
  onLogout,
}: {
  displayName: string;
  email: string;
  tenantCode: string;
  initials: string;
  onLogout: () => void;
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage alt={displayName} />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{displayName}</span>
              <span className="truncate text-xs text-muted-foreground">{email}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <div className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage alt={displayName} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
              <p className="px-2 pb-1 text-[11px] text-muted-foreground">Tenant: {tenantCode}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles className="size-4 text-muted-foreground" />
                Upgrade Plan
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck className="size-4 text-muted-foreground" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="size-4 text-muted-foreground" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="size-4 text-muted-foreground" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function RootLayout() {
  const auth = useAuth();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isAppRoute = pathname.startsWith('/app');

  if (isAppRoute && auth.isAuthenticated) {
    return <AuthenticatedAppShell />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="border-b bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="text-sm font-semibold tracking-wide">GPS Portal</div>
          <div className="flex items-center gap-3 text-sm">
            <Link to="/login" className="text-slate-700 hover:text-slate-950">
              Login
            </Link>
            <Link to="/signup" className="text-slate-700 hover:text-slate-950">
              Signup
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

function AuthenticatedAppShell() {
  const auth = useAuth();
  const isPlatformAdmin = Boolean(
    (auth.user as { isPlatformAdmin?: boolean } | null)?.isPlatformAdmin,
  );
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [searchOpen, setSearchOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [onboarding, setOnboarding] = useState<OnboardingState>(() => getInitialOnboardingState());
  const theme = useThemeMode();

  const [selection, setSelection] = useState<{ schoolId: string; campusId: string }>(() => {
    if (typeof window === 'undefined') {
      return { schoolId: 'all-schools', campusId: 'all-campuses' };
    }
    const raw = localStorage.getItem(schoolSwitchStorageKey);
    if (!raw) return { schoolId: 'all-schools', campusId: 'all-campuses' };
    try {
      const parsed = JSON.parse(raw) as { schoolId?: string; campusId?: string };
      return {
        schoolId: parsed.schoolId ?? 'all-schools',
        campusId: parsed.campusId ?? 'all-campuses',
      };
    } catch {
      return { schoolId: 'all-schools', campusId: 'all-campuses' };
    }
  });

  const selectedSchoolId = selection.schoolId === 'all-schools' ? undefined : selection.schoolId;

  const schoolsQuery = useQuery({
    queryKey: ['shell', 'schools'],
    queryFn: () => fetchJsonArray<SchoolLite>(auth.authFetch, '/api/schools'),
    enabled: auth.isAuthenticated,
  });

  const classroomsQuery = useQuery({
    queryKey: ['shell', 'classrooms', selectedSchoolId],
    queryFn: () =>
      fetchJsonArray<ClassroomLite>(
        auth.authFetch,
        withQuery('/api/classrooms', { schoolId: selectedSchoolId }),
      ),
    enabled: auth.isAuthenticated,
  });

  const campusesQuery = useQuery({
    queryKey: ['shell', 'campuses', selectedSchoolId],
    queryFn: () =>
      fetchJsonArray<CampusLite>(
        auth.authFetch,
        withQuery('/api/schools/campuses', { schoolId: selectedSchoolId }),
      ),
    enabled: auth.isAuthenticated,
  });

  const studentsQuery = useQuery({
    queryKey: ['shell', 'students', selectedSchoolId],
    queryFn: () => fetchStudents(auth.authFetch, selectedSchoolId),
    enabled: auth.isAuthenticated,
  });

  const teachersQuery = useQuery({
    queryKey: ['shell', 'teachers'],
    queryFn: () => fetchJsonArray<TeacherLite>(auth.authFetch, '/api/staff/teachers/list'),
    enabled: auth.isAuthenticated,
  });

  const staffQuery = useQuery({
    queryKey: ['shell', 'staff', selectedSchoolId],
    queryFn: () =>
      fetchJsonArray<StaffLite>(
        auth.authFetch,
        withQuery('/api/staff', { schoolId: selectedSchoolId }),
      ),
    enabled: auth.isAuthenticated,
  });

  const feePlansQuery = useQuery({
    queryKey: ['shell', 'feePlans', selectedSchoolId],
    queryFn: () =>
      fetchJsonArray<FeePlanLite>(
        auth.authFetch,
        withQuery('/api/billing/fee-plans', { schoolId: selectedSchoolId }),
      ),
    enabled: auth.isAuthenticated,
  });

  const readinessQuery = useQuery({
    queryKey: ['shell', 'school-readiness', selectedSchoolId],
    queryFn: () => fetchSchoolReadiness(auth.authFetch, selectedSchoolId as string),
    enabled: auth.isAuthenticated && Boolean(selectedSchoolId),
  });

  const attendanceSessionsQuery = useQuery({
    queryKey: ['shell', 'attendanceSessions'],
    queryFn: () => fetchJsonArray<AttendanceSessionLite>(auth.authFetch, '/api/attendance/sessions'),
    enabled: auth.isAuthenticated,
  });

  useEffect(() => {
    localStorage.setItem(onboardingStorageKey, JSON.stringify(onboarding));
  }, [onboarding]);

  useEffect(() => {
    setOnboarding((prev) => ({
      ...prev,
      steps: {
        ...prev.steps,
        schoolProfile: prev.steps.schoolProfile || (schoolsQuery.data?.length ?? 0) > 0,
        campuses: prev.steps.campuses || (campusesQuery.data?.length ?? 0) > 0,
        classrooms: prev.steps.classrooms || (classroomsQuery.data?.length ?? 0) > 0,
        students: prev.steps.students || (studentsQuery.data?.length ?? 0) > 0,
        teachers: prev.steps.teachers || (teachersQuery.data?.length ?? 0) > 0,
        staff: prev.steps.staff || (staffQuery.data?.length ?? 0) > 0,
        feeStructures: prev.steps.feeStructures || (feePlansQuery.data?.length ?? 0) > 0,
      },
    }));
  }, [
    campusesQuery.data,
    classroomsQuery.data,
    feePlansQuery.data,
    schoolsQuery.data,
    staffQuery.data,
    studentsQuery.data,
    teachersQuery.data,
  ]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const completedSteps = onboardingSteps.filter((step) => onboarding.steps[step.id]).length;
  const onboardingPercent = readinessQuery.data?.percent ?? Math.round((completedSteps / onboardingSteps.length) * 100);
  const displayedOnboardingSteps = readinessQuery.data?.steps ?? onboardingSteps.map((step) => ({
    ...step,
    complete: onboarding.steps[step.id],
    required: true,
    count: onboarding.steps[step.id] ? 1 : 0,
    href: '/app',
  }));

  useEffect(() => {
    localStorage.setItem(schoolSwitchStorageKey, JSON.stringify(selection));
  }, [selection]);

  useEffect(() => {
    const schools = schoolsQuery.data ?? [];
    if (schools.length !== 1) return;
    if (selection.schoolId !== 'all-schools') return;
    setSelection((prev) => ({ ...prev, schoolId: schools[0].id }));
  }, [schoolsQuery.data, selection.schoolId]);

  const schoolOptions = useMemo(() => {
    const dynamic = (schoolsQuery.data ?? []).map((school) => ({ value: school.id, label: school.name }));
    return [{ value: 'all-schools', label: 'All Schools' }, ...dynamic];
  }, [schoolsQuery.data]);

  const campusOptions = useMemo(() => {
    const dynamic = (campusesQuery.data ?? []).map((campus) => ({
      value: campus.id,
      label: campus.name || campus.code,
    }));
    return [{ value: 'all-campuses', label: 'All Campuses' }, ...dynamic];
  }, [campusesQuery.data]);

  useEffect(() => {
    if (selection.campusId === 'all-campuses') return;
    if (campusOptions.some((option) => option.value === selection.campusId)) return;
    setSelection((prev) => ({ ...prev, campusId: 'all-campuses' }));
  }, [campusOptions, selection.campusId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (onboarding.skipped) return;
    if (onboardingPercent >= 100) return;
    if (sessionStorage.getItem(onboardingPromptSessionKey) === '1') return;

    sessionStorage.setItem(onboardingPromptSessionKey, '1');
    setWizardOpen(true);
  }, [onboarding.skipped, onboardingPercent]);

  const canProvisionSchools = (auth.user?.roles ?? []).some((role) =>
    ['super_admin', 'admin', 'tenant_admin'].includes(role.toLowerCase()),
  );

  const globalNavItems = [
    { label: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { label: 'Classes', path: '/app/classes', icon: Building2 },
    { label: 'Students', path: '/app/students', icon: GraduationCap },
    ...(auth.user?.scopes?.includes('admissions.read')
      ? [{ label: 'Admissions', path: '/app/admissions', icon: BadgeCheck }]
      : []),
    ...(auth.user?.scopes?.includes('billing.feePlans.read')
      ? [{ label: 'Finance', path: '/app/finance', icon: Wallet }]
      : []),
    ...(auth.user?.scopes?.includes('students.read')
      ? [{ label: 'Families', path: '/app/families', icon: UsersRound }]
      : []),
    { label: 'Teachers', path: '/app/teachers', icon: UsersRound },
    { label: 'Attendance', path: '/app/attendance', icon: BookOpenCheck },
    ...(canProvisionSchools
      ? [{ label: 'Provision School', path: '/app/schools/provision', icon: Building2 }]
      : []),
    ...(auth.user?.scopes?.includes('students.write')
      ? [{ label: 'Import Students', path: '/app/students/import', icon: Users }]
      : []),
    ...(auth.user?.scopes?.includes('staff.write')
      ? [{ label: 'Import Staff', path: '/app/staff/import', icon: UsersRound }]
      : []),
    ...(isPlatformAdmin
      ? [{ label: 'Platform Overview', path: '/app/platform', icon: Sparkles }]
      : []),
  ];

  const initials = (auth.user?.email ?? 'U').slice(0, 2).toUpperCase();

  const commandStudentItems = (studentsQuery.data ?? []).slice(0, 6);
  const commandTeacherItems = (teachersQuery.data ?? []).slice(0, 6);
  const commandSchoolItems = (schoolsQuery.data ?? []).slice(0, 6);
  const commandAttendanceItems = (attendanceSessionsQuery.data ?? []).slice(0, 6);
  const commandClassroomItems = (classroomsQuery.data ?? []).slice(0, 6);
  const commandStaffItems = (staffQuery.data ?? []).slice(0, 6);
  const commandFeePlanItems = (feePlansQuery.data ?? []).slice(0, 6);
  const displayName = auth.user?.email?.split('@')[0] ?? 'User';

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider defaultOpen className="flex flex-col">
        <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
            <SidebarTrigger />
            <div className="h-4 w-px bg-border" />
            <Button
              variant="outline"
              className="h-9 w-full justify-start gap-2 rounded-lg border-dashed bg-muted/35 text-muted-foreground sm:ml-auto sm:max-w-[28rem]"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-4" />
              <span className="truncate">Search students, classes, fees, attendance...</span>
              <span className="ml-auto rounded border bg-background px-1.5 py-0.5 text-[10px] text-foreground/70">
                ⌘K
              </span>
            </Button>
            <Button variant="ghost" size="icon" onClick={theme.toggle} aria-label="Toggle theme">
              {theme.mode === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </div>
        </header>
        <div className="flex flex-1">
          <Sidebar
            variant="inset"
            collapsible="icon"
            className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
          >
        <SidebarHeader>
          <div className="flex items-center gap-2 rounded-md bg-sidebar-accent/60 px-2 py-2">
            <Building2 className="size-4" />
            <div className="text-xs font-semibold">GPS Admin Console</div>
          </div>
          <SidebarSeparator />
          <Select
            value={selection.schoolId}
            onValueChange={(schoolId) => {
              if (!schoolId) return;
              setSelection((prev) => ({ ...prev, schoolId, campusId: 'all-campuses' }));
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Switch School" />
            </SelectTrigger>
            <SelectContent>
              {schoolOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selection.campusId}
            onValueChange={(campusId) => {
              if (!campusId) return;
              setSelection((prev) => ({ ...prev, campusId }));
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Switch Campus" />
            </SelectTrigger>
            <SelectContent>
              {campusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {globalNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        isActive={pathname === item.path}
                        onClick={() => {
                          void navigate({ to: item.path });
                        }}
                        tooltip={item.label}
                      >
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarSeparator />
          <Progress value={onboardingPercent}>
            <ProgressLabel>Onboarding</ProgressLabel>
            <ProgressValue>{() => `${onboardingPercent}%`}</ProgressValue>
          </Progress>
          <Button variant="outline" className="w-full" onClick={() => setWizardOpen(true)}>
            Continue Onboarding
          </Button>
          <SidebarUserMenu
            displayName={displayName}
            email={auth.user?.email ?? 'Unknown'}
            tenantCode={auth.user?.tenantCode ?? 'N/A'}
            initials={initials}
            onLogout={() => {
              void auth.logout();
            }}
          />
        </SidebarFooter>
          </Sidebar>

          <SidebarInset>
            <main className="min-h-0 flex-1 p-4 md:p-6">
              <Outlet />
            </main>
          </SidebarInset>
        </div>

        <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search students, teachers, schools, attendance, navigation..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {globalNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.path}
                  onSelect={() => {
                    setSearchOpen(false);
                    void navigate({ to: item.path });
                  }}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Students">
            {commandStudentItems.map((student) => (
              <CommandItem
                key={student.id}
                onSelect={() => {
                  setSearchOpen(false);
                  void navigate({ to: '/app/students' });
                }}
              >
                <GraduationCap className="size-4" />
                <span>
                  {student.firstName} {student.lastName ?? ''} ({student.admissionNo})
                </span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Teachers">
            {commandTeacherItems.map((teacher) => (
              <CommandItem
                key={teacher.id}
                onSelect={() => {
                  setSearchOpen(false);
                  void navigate({ to: '/app/teachers' });
                }}
              >
                <UsersRound className="size-4" />
                <span>Teacher {teacher.id}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Schools">
            {commandSchoolItems.map((school) => (
              <CommandItem
                key={school.id}
                onSelect={() => {
                  setSearchOpen(false);
                  setSelection((prev) => ({ ...prev, schoolId: school.id }));
                }}
              >
                <Building2 className="size-4" />
                <span>{school.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Attendance Sessions">
            {commandAttendanceItems.map((session) => (
              <CommandItem
                key={session.id}
                onSelect={() => {
                  setSearchOpen(false);
                  void navigate({ to: '/app/attendance' });
                }}
              >
                <BookOpenCheck className="size-4" />
                <span>
                  {session.classRoomId} - {new Date(session.attendanceOn).toLocaleDateString()}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Classrooms">
            {commandClassroomItems.map((classroom) => (
              <CommandItem
                key={classroom.id}
                onSelect={() => {
                  setSearchOpen(false);
                  void navigate({ to: '/app/classes' });
                }}
              >
                <Users className="size-4" />
                <span>{classroom.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Staff">
            {commandStaffItems.map((staff) => (
              <CommandItem
                key={staff.id}
                onSelect={() => {
                  setSearchOpen(false);
                  void navigate({ to: '/app/teachers' });
                }}
              >
                <Users className="size-4" />
                <span>
                  {(staff.firstName ?? '').trim()} {(staff.lastName ?? '').trim()} {staff.id}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Fee Structures">
            {commandFeePlanItems.map((feePlan) => (
              <CommandItem
                key={feePlan.id}
                onSelect={() => {
                  setSearchOpen(false);
                  void navigate({ to: '/app' });
                }}
              >
                <Wallet className="size-4" />
                <span>{feePlan.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Onboarding">
            <CommandItem
              onSelect={() => {
                setSearchOpen(false);
                setWizardOpen(true);
              }}
            >
              <Command className="size-4" />
              <span>Open onboarding wizard</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
        </CommandDialog>

        <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Admin Onboarding Wizard</DialogTitle>
            <DialogDescription>
              Skippable setup checklist for fast go-live. Progress auto-updates based on actual data in the system.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Progress value={onboardingPercent}>
              <ProgressLabel>Completion</ProgressLabel>
              <ProgressValue>{() => `${onboardingPercent}%`}</ProgressValue>
            </Progress>

            {displayedOnboardingSteps.map((step) => {
              const done = step.complete;
              return (
                <div key={step.id} className="flex items-start justify-between rounded-md border p-3">
                  <div>
                    <p className="text-sm font-medium">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                  <Button
                    variant={done ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => {
                      if (readinessQuery.data) {
                        setWizardOpen(false);
                        return;
                      }
                      setOnboarding((prev) => ({
                        ...prev,
                        skipped: false,
                        steps: { ...prev.steps, [step.id]: !done },
                      }));
                    }}
                  >
                    {done ? (
                      <>
                        <CheckCircle2 className="size-4" /> Done
                      </>
                    ) : (
                      'Mark done'
                    )}
                  </Button>
                </div>
              );
            })}

            <div className="flex items-center justify-between gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setOnboarding((prev) => ({ ...prev, skipped: true }));
                  setWizardOpen(false);
                }}
              >
                Skip for now
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setOnboarding({
                    skipped: false,
                    steps: Object.fromEntries(onboardingSteps.map((step) => [step.id, false])) as Record<
                      OnboardingStepId,
                      boolean
                    >,
                  });
                }}
              >
                Reset checklist
              </Button>
            </div>
          </div>
        </DialogContent>
        </Dialog>
      </SidebarProvider>
    </div>
  );
}

function AppHomePage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useRequireAuth({
    onRedirect: () => navigate({ to: '/login', search: { redirect: '/app' } }),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-sm text-muted-foreground">Welcome back, {auth.user?.email}.</p>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-md border p-3">
          <h2 className="text-sm font-medium">Global Search</h2>
          <p className="text-xs text-muted-foreground">Use Cmd/Ctrl + K to search across entities and navigation.</p>
        </div>
        <div className="rounded-md border p-3">
          <h2 className="text-sm font-medium">Onboarding</h2>
          <p className="text-xs text-muted-foreground">Track setup progress for classes, students, teachers, staff, and billing.</p>
        </div>
      </div>
    </div>
  );
}

function ProvisionSchoolPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const isPlatformAdmin = Boolean(
    (auth.user as { isPlatformAdmin?: boolean } | null)?.isPlatformAdmin,
  );
  const currentTenantId = (auth.user as { tenantId?: string } | null)?.tenantId ?? '';
  const platformTenantsQuery = useQuery({
    queryKey: ['platform', 'provision-tenants'],
    queryFn: () => fetchJsonArray<PlatformTenantLite>(auth.authFetch, '/api/schools/platform/tenants'),
    enabled: auth.isAuthenticated && isPlatformAdmin,
  });
  const [targetTenantId, setTargetTenantId] = useState(currentTenantId);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({
    schoolCode: '',
    schoolName: '',
    board: '',
    contactEmail: '',
    campusCode: 'MAIN',
    campusName: 'Main Campus',
    adminEmail: '',
    adminFirstName: '',
    adminLastName: '',
  });

  useRequireAuth({
    onRedirect: () => navigate({ to: '/login', search: { redirect: '/app/schools/provision' } }),
  });

  const canProvision = isPlatformAdmin || (auth.user?.roles ?? []).some((role) =>
    ['super_admin', 'admin', 'tenant_admin'].includes(role.toLowerCase()),
  );

  if (!canProvision) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">Provision a school</h1>
        <p className="text-sm text-muted-foreground">
          This platform operation is available to Super Admin and tenant administrators.
        </p>
      </div>
    );
  }

  const update = (field: keyof typeof form, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
      const response = await auth.authFetch(
        `${apiBase}${isPlatformAdmin ? '/api/schools/platform/provision' : '/api/schools/provision'}`,
        {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          ...form,
          ...(isPlatformAdmin ? { tenantId: targetTenantId } : {}),
          board: form.board || undefined,
          contactEmail: form.contactEmail || undefined,
          adminLastName: form.adminLastName || undefined,
        }),
        },
      );
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          body && typeof body === 'object' && 'message' in body
            ? String(body.message)
            : 'Unable to provision the school.',
        );
      }
      setMessage({
        tone: 'success',
        text: `School created. An administrator invitation is ready for ${body.schoolAdmin.email}.`,
      });
      setForm({
        schoolCode: '',
        schoolName: '',
        board: '',
        contactEmail: '',
        campusCode: 'MAIN',
        campusName: 'Main Campus',
        adminEmail: '',
        adminFirstName: '',
        adminLastName: '',
      });
    } catch (error) {
      setMessage({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Unable to provision the school.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const fields: Array<{ key: keyof typeof form; label: string; required?: boolean; type?: string }> = [
    { key: 'schoolCode', label: 'School code', required: true },
    { key: 'schoolName', label: 'School name', required: true },
    { key: 'board', label: 'Board' },
    { key: 'contactEmail', label: 'School contact email', type: 'email' },
    { key: 'campusCode', label: 'Initial campus code', required: true },
    { key: 'campusName', label: 'Initial campus name', required: true },
    { key: 'adminEmail', label: 'School admin email', required: true, type: 'email' },
    { key: 'adminFirstName', label: 'Admin first name', required: true },
    { key: 'adminLastName', label: 'Admin last name' },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Provision a school</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isPlatformAdmin
            ? 'Create a school under any institution and invite its administrator in one controlled operation.'
            : 'Create the school foundation and invite its administrator in one controlled operation.'}
        </p>
      </div>

      {message ? (
        <div className={`rounded-md border p-3 text-sm ${message.tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-destructive/30 bg-destructive/5 text-destructive'}`}>
          {message.text}
        </div>
      ) : null}

      <form onSubmit={submit} className="space-y-6 rounded-lg border bg-card p-5 shadow-sm">
        <div>
          <h2 className="text-sm font-semibold">School foundation</h2>
          <p className="mt-1 text-xs text-muted-foreground">The school administrator can complete the remaining setup after accepting the invitation.</p>
        </div>
        {isPlatformAdmin ? (
          <label className="block max-w-md space-y-1.5 text-sm">
            <span className="font-medium">Institution *</span>
            <select
              required
              value={targetTenantId}
              onChange={(event) => setTargetTenantId(event.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Choose an institution</option>
              {(platformTenantsQuery.data ?? []).map((tenant) => (
                <option key={tenant.id} value={tenant.id}>{tenant.name} ({tenant.code})</option>
              ))}
            </select>
          </label>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field.key} className="space-y-1.5 text-sm">
              <span className="font-medium">{field.label}{field.required ? ' *' : ''}</span>
              <input
                required={field.required}
                type={field.type ?? 'text'}
                value={form[field.key]}
                onChange={(event) => update(field.key, event.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
          ))}
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Provisioning…' : 'Provision school'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function ImportStudentsPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [schoolId, setSchoolId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<StudentImportPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const schoolsQuery = useQuery({
    queryKey: ['student-import', 'schools'],
    queryFn: () => fetchJsonArray<SchoolLite>(auth.authFetch, '/api/schools'),
    enabled: auth.isAuthenticated,
  });

  useRequireAuth({
    onRedirect: () => navigate({ to: '/login', search: { redirect: '/app/students/import' } }),
  });

  const previewFile = async () => {
    if (!schoolId || !file) {
      setMessage('Choose a school and CSV file before previewing.');
      return;
    }
    setBusy(true);
    setMessage(null);
    setPreview(null);
    try {
      const formData = new FormData();
      formData.append('schoolId', schoolId);
      formData.append('file', file);
      const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
      const response = await auth.authFetch(`${apiBase}/api/students/bulk-import/csv/preview`, {
        method: 'POST',
        body: formData,
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.message ?? 'Unable to preview this file.');
      setPreview(body as StudentImportPreview);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to preview this file.');
    } finally {
      setBusy(false);
    }
  };

  const commitImport = async () => {
    if (!preview || preview.records.length === 0) return;
    setBusy(true);
    setMessage(null);
    try {
      const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
      const response = await auth.authFetch(`${apiBase}/api/students/bulk-import`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ records: preview.records }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.message ?? 'Unable to commit this import.');
      setMessage(`Import complete: ${body.createdCount} students created, ${body.failedCount} failed.`);
      setPreview(null);
      setFile(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to commit this import.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Import students</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload your existing CSV, review the rows GPS can accept, then explicitly commit the import.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5 text-sm">
            <span className="font-medium">School *</span>
            <select
              value={schoolId}
              onChange={(event) => setSchoolId(event.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Choose a school</option>
              {(schoolsQuery.data ?? []).map((school) => (
                <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5 text-sm">
            <span className="font-medium">CSV file *</span>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="block w-full text-sm"
            />
          </label>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Required headers: admissionNo, firstName. Optional headers: lastName, gender, dateOfBirth, joinedOn, profilePhotoKey.
        </p>
        <div className="mt-5 flex justify-end">
          <Button onClick={() => void previewFile()} disabled={busy || !file || !schoolId}>
            {busy ? 'Working…' : 'Preview import'}
          </Button>
        </div>
      </div>

      {message ? <div className="rounded-md border p-3 text-sm">{message}</div> : null}

      {preview ? (
        <div className="space-y-4 rounded-lg border bg-card p-5 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-3">
            <div><p className="text-xs text-muted-foreground">Rows found</p><p className="text-xl font-semibold">{preview.totalRows}</p></div>
            <div><p className="text-xs text-muted-foreground">Ready to import</p><p className="text-xl font-semibold text-emerald-700">{preview.validRows}</p></div>
            <div><p className="text-xs text-muted-foreground">Needs attention</p><p className="text-xl font-semibold text-amber-700">{preview.invalidRows}</p></div>
          </div>
          {preview.errors.length > 0 ? (
            <div className="space-y-2">
              <h2 className="text-sm font-semibold">Rows to fix</h2>
              {preview.errors.slice(0, 10).map((error, index) => (
                <div key={`${error.rowIndex}-${error.code}-${index}`} className="rounded border p-2 text-xs">
                  Row {error.rowIndex + 1}: {error.message}
                </div>
              ))}
              {preview.errors.length > 10 ? <p className="text-xs text-muted-foreground">Showing the first 10 issues.</p> : null}
            </div>
          ) : null}
          <div className="flex justify-end">
            <Button onClick={() => void commitImport()} disabled={busy || preview.records.length === 0}>
              Commit {preview.records.length} valid students
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PlatformOverviewPage() {
  const auth = useAuth();
  const isPlatformAdmin = Boolean(
    (auth.user as { isPlatformAdmin?: boolean } | null)?.isPlatformAdmin,
  );
  const navigate = useNavigate();
  const tenantsQuery = useQuery({
    queryKey: ['platform', 'tenants'],
    queryFn: () => fetchJsonArray<PlatformTenantLite>(auth.authFetch, '/api/schools/platform/tenants'),
    enabled: auth.isAuthenticated && isPlatformAdmin,
  });
  const schoolsQuery = useQuery({
    queryKey: ['platform', 'schools'],
    queryFn: () => fetchJsonArray<PlatformSchoolLite>(auth.authFetch, '/api/schools/platform/all'),
    enabled: auth.isAuthenticated && isPlatformAdmin,
  });

  useRequireAuth({
    onRedirect: () => navigate({ to: '/login', search: { redirect: '/app/platform' } }),
  });

  if (!isPlatformAdmin) {
    return <p className="text-sm text-muted-foreground">Platform administrator access is required.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Platform overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Monitor institutions and schools across the GPS platform.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div><h2 className="text-sm font-semibold">Institutions</h2><p className="text-xs text-muted-foreground">All tenant organizations</p></div>
            <span className="text-2xl font-semibold">{tenantsQuery.data?.length ?? 0}</span>
          </div>
          <div className="mt-4 space-y-2">
            {(tenantsQuery.data ?? []).map((tenant) => (
              <div key={tenant.id} className="flex items-center justify-between rounded border p-3 text-sm">
                <div><p className="font-medium">{tenant.name}</p><p className="text-xs text-muted-foreground">{tenant.code} · {tenant.status}</p></div>
                <span className="text-xs text-muted-foreground">{tenant.schoolCount} schools</span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div><h2 className="text-sm font-semibold">Schools</h2><p className="text-xs text-muted-foreground">Across every institution</p></div>
            <span className="text-2xl font-semibold">{schoolsQuery.data?.length ?? 0}</span>
          </div>
          <div className="mt-4 space-y-2">
            {(schoolsQuery.data ?? []).map((school) => (
              <div key={school.id} className="rounded border p-3 text-sm">
                <p className="font-medium">{school.name}</p>
                <p className="text-xs text-muted-foreground">{school.tenantName} · {school.code} · {school.campusCount} campuses</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ImportStaffPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [schoolId, setSchoolId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<StaffImportPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const schoolsQuery = useQuery({
    queryKey: ['staff-import', 'schools'],
    queryFn: () => fetchJsonArray<SchoolLite>(auth.authFetch, '/api/schools'),
    enabled: auth.isAuthenticated,
  });

  useRequireAuth({
    onRedirect: () => navigate({ to: '/login', search: { redirect: '/app/staff/import' } }),
  });

  const previewFile = async () => {
    if (!schoolId || !file) {
      setMessage('Choose a school and CSV file before previewing.');
      return;
    }
    setBusy(true);
    setMessage(null);
    setPreview(null);
    try {
      const formData = new FormData();
      formData.append('schoolId', schoolId);
      formData.append('file', file);
      const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
      const response = await auth.authFetch(`${apiBase}/api/staff/import/csv/preview`, {
        method: 'POST',
        body: formData,
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.message ?? 'Unable to preview this file.');
      setPreview(body as StaffImportPreview);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to preview this file.');
    } finally {
      setBusy(false);
    }
  };

  const commitImport = async () => {
    if (!preview || preview.records.length === 0) return;
    setBusy(true);
    setMessage(null);
    try {
      const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
      const response = await auth.authFetch(`${apiBase}/api/staff/import`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ schoolId, records: preview.records }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.message ?? 'Unable to commit this import.');
      setMessage(`Import complete: ${body.createdCount} staff profiles created, ${body.invitedCount} invitations prepared.`);
      setPreview(null);
      setFile(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to commit this import.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Import staff</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review staff identity rows first, then create memberships and staff profiles together.</p>
      </div>
      <div className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5 text-sm">
            <span className="font-medium">School *</span>
            <select value={schoolId} onChange={(event) => setSchoolId(event.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="">Choose a school</option>
              {(schoolsQuery.data ?? []).map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}
            </select>
          </label>
          <label className="space-y-1.5 text-sm">
            <span className="font-medium">CSV file *</span>
            <input type="file" accept=".csv,text/csv" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="block w-full text-sm" />
          </label>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Required headers: email, firstName, employeeCode. Optional headers: lastName, designation, employmentType, joinedOn.</p>
        <div className="mt-5 flex justify-end"><Button onClick={() => void previewFile()} disabled={busy || !file || !schoolId}>{busy ? 'Working…' : 'Preview import'}</Button></div>
      </div>
      {message ? <div className="rounded-md border p-3 text-sm">{message}</div> : null}
      {preview ? (
        <div className="space-y-4 rounded-lg border bg-card p-5 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-3">
            <div><p className="text-xs text-muted-foreground">Rows found</p><p className="text-xl font-semibold">{preview.totalRows}</p></div>
            <div><p className="text-xs text-muted-foreground">Ready to import</p><p className="text-xl font-semibold text-emerald-700">{preview.validRows}</p></div>
            <div><p className="text-xs text-muted-foreground">Needs attention</p><p className="text-xl font-semibold text-amber-700">{preview.invalidRows}</p></div>
          </div>
          {preview.errors.length > 0 ? <div className="space-y-2"><h2 className="text-sm font-semibold">Rows to fix</h2>{preview.errors.slice(0, 10).map((error, index) => <div key={`${error.rowIndex}-${error.code}-${index}`} className="rounded border p-2 text-xs">Row {error.rowIndex + 1}: {error.message}</div>)}</div> : null}
          <div className="flex justify-end"><Button onClick={() => void commitImport()} disabled={busy || preview.records.length === 0}>Commit {preview.records.length} valid staff</Button></div>
        </div>
      ) : null}
    </div>
  );
}

function AdmissionsPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const canRead = auth.can('admissions.read');
  const canWrite = auth.can('admissions.write');
  const [schoolId, setSchoolId] = useState('');
  const [yearId, setYearId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', dateOfBirth: '', guardianFirstName: '', guardianLastName: '', guardianPhoneE164: '', guardianEmail: '', relationType: 'Parent' });
  const [selectedClass, setSelectedClass] = useState('');
  const [admissionNo, setAdmissionNo] = useState('');

  useRequireAuth({ onRedirect: () => navigate({ to: '/login', search: { redirect: '/app/admissions' } }) });

  const schoolsQuery = useQuery({ queryKey: ['admissions-schools'], queryFn: () => fetchJsonArray<SchoolLite>(auth.authFetch, '/api/schools'), enabled: canRead });
  const activeSchoolId = schoolId || schoolsQuery.data?.[0]?.id || '';
  const yearsQuery = useQuery({ queryKey: ['admissions-years', activeSchoolId], queryFn: () => fetchJsonArray<{ id: string; name: string; isCurrent: boolean }>(auth.authFetch, `/api/academic-years?schoolId=${activeSchoolId}`), enabled: canRead && Boolean(activeSchoolId) });
  const activeYearId = yearId || yearsQuery.data?.find((year) => year.isCurrent)?.id || yearsQuery.data?.[0]?.id || '';
  const classesQuery = useQuery({ queryKey: ['admissions-classes', activeSchoolId], queryFn: () => fetchJsonArray<ClassroomLite>(auth.authFetch, `/api/classrooms?schoolId=${activeSchoolId}`), enabled: canRead && Boolean(activeSchoolId) });
  const applicationsQuery = useQuery({
    queryKey: ['admissions-applications', activeSchoolId, activeYearId, statusFilter],
    queryFn: () => fetchJsonArray<AdmissionLite>(auth.authFetch, `/api/admissions/applications?schoolId=${activeSchoolId}&academicYearId=${activeYearId}${statusFilter ? `&status=${statusFilter}` : ''}`),
    enabled: canRead && Boolean(activeSchoolId) && Boolean(activeYearId),
  });
  const request = async (path: string, method: string, body: unknown) => {
    const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
    const response = await auth.authFetch(`${apiBase}${path}`, { method, headers: { accept: 'application/json', 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const payload = await response.json().catch(() => undefined);
    if (!response.ok) throw new Error(payload?.message ?? `Request failed (${response.status})`);
    return payload;
  };
  const mutation = useMutation({
    mutationFn: ({ path, method, body }: { path: string; method: string; body: unknown }) => request(path, method, body),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['admissions-applications'] }); },
  });
  const applications = applicationsQuery.data ?? [];
  const counts = { inbox: applications.filter((item) => ['SUBMITTED', 'REVIEWING'].includes(item.status)).length, approved: applications.filter((item) => item.status === 'APPROVED').length, enrolled: applications.filter((item) => item.status === 'ENROLLED').length };

  if (!canRead) return <p className="text-sm text-muted-foreground">Admissions access denied.</p>;
  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-[28px] bg-[#17233b] px-6 py-8 text-[#f6f3ea] shadow-2xl shadow-slate-900/10 md:px-10 md:py-10">
        <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-[#d7a94b]/15 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end"><div className="max-w-2xl space-y-4"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#dfbd73]"><BadgeCheck className="h-4 w-4" /> Admissions desk</div><h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Turn interest into belonging.</h1><p className="max-w-xl text-sm leading-7 text-slate-300 md:text-base">A clear pipeline for every family—from first application to a confirmed seat in the right class.</p></div><div className="flex flex-wrap gap-3"><label className="min-w-[210px] text-xs font-medium text-slate-300">School<select value={activeSchoolId} onChange={(event) => { setSchoolId(event.target.value); setYearId(''); }} className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white outline-none"><option value="" className="text-slate-900">Select school</option>{(schoolsQuery.data ?? []).map((school) => <option key={school.id} value={school.id} className="text-slate-900">{school.name}</option>)}</select></label><label className="min-w-[170px] text-xs font-medium text-slate-300">Academic year<select value={activeYearId} onChange={(event) => setYearId(event.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white outline-none"><option value="" className="text-slate-900">Select year</option>{(yearsQuery.data ?? []).map((year) => <option key={year.id} value={year.id} className="text-slate-900">{year.name}{year.isCurrent ? ' · Current' : ''}</option>)}</select></label></div></div>
      </section>
      {mutation.isError ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{(mutation.error as Error).message}</div> : null}
      <div className="grid gap-4 md:grid-cols-3"><AdmissionMetric label="Needs attention" value={counts.inbox} tone="amber" /><AdmissionMetric label="Ready to enroll" value={counts.approved} tone="blue" /><AdmissionMetric label="Enrolled this year" value={counts.enrolled} tone="green" /></div>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="overflow-hidden border-slate-200/80 shadow-sm"><CardHeader className="border-b border-slate-100 bg-[#fbfaf7]"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a47725]">New application</p><CardTitle>Welcome a new family</CardTitle><CardDescription>Capture the essentials now; complete the review when the documents arrive.</CardDescription></CardHeader><CardContent className="space-y-4 pt-6">{(['firstName', 'lastName', 'dateOfBirth', 'guardianFirstName', 'guardianLastName', 'guardianPhoneE164', 'guardianEmail', 'relationType'] as const).map((field) => <Input key={field} type={field === 'dateOfBirth' ? 'date' : field === 'guardianEmail' ? 'email' : field === 'guardianPhoneE164' ? 'tel' : 'text'} placeholder={field.replace(/([A-Z])/g, ' $1').replace(/^./, (value) => value.toUpperCase())} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />)}<Button className="w-full" disabled={!canWrite || !activeSchoolId || !activeYearId || !form.firstName || !form.dateOfBirth || !form.guardianFirstName || mutation.isPending} onClick={() => { mutation.mutate({ path: '/api/admissions/applications', method: 'POST', body: { ...form, schoolId: activeSchoolId, academicYearId: activeYearId, status: 'SUBMITTED' } }); setForm({ firstName: '', lastName: '', dateOfBirth: '', guardianFirstName: '', guardianLastName: '', guardianPhoneE164: '', guardianEmail: '', relationType: 'Parent' }); }}>{mutation.isPending ? 'Saving…' : 'Submit application'}</Button></CardContent></Card>
        <Card className="overflow-hidden border-slate-200/80 shadow-sm"><CardHeader className="border-b border-slate-100 bg-[#fbfaf7]"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a47725]">Application pipeline</p><CardTitle>Every applicant, clearly placed</CardTitle><CardDescription>Move an application forward only when the next decision is ready.</CardDescription></div><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><option value="">All stages</option>{['SUBMITTED', 'REVIEWING', 'APPROVED', 'REJECTED', 'ENROLLED'].map((status) => <option key={status} value={status}>{status[0] + status.slice(1).toLowerCase()}</option>)}</select></div></CardHeader><CardContent className="space-y-3 pt-6">{applications.length ? applications.map((application) => <AdmissionRow key={application.id} application={application} canWrite={canWrite} classes={classesQuery.data ?? []} selectedClass={selectedClass} admissionNo={admissionNo} setSelectedClass={setSelectedClass} setAdmissionNo={setAdmissionNo} onUpdate={(status) => mutation.mutate({ path: `/api/admissions/applications/${application.id}`, method: 'PATCH', body: { status } })} onEnroll={() => mutation.mutate({ path: `/api/admissions/applications/${application.id}/enroll`, method: 'POST', body: { admissionNo, classRoomId: selectedClass || application.classRoomId } })} />) : <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center"><p className="font-medium text-slate-800">Your admissions desk is quiet</p><p className="mt-1 text-sm text-slate-500">New applications will appear here for review.</p></div>}</CardContent></Card>
      </div>
    </div>
  );
}

function AdmissionMetric({ label, value, tone }: { label: string; value: number; tone: 'amber' | 'blue' | 'green' }) {
  const styles = { amber: 'bg-amber-50 text-amber-700', blue: 'bg-blue-50 text-blue-700', green: 'bg-emerald-50 text-emerald-700' }[tone];
  return <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"><div><p className="text-2xl font-semibold text-slate-900">{value}</p><p className="text-sm text-slate-600">{label}</p></div><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${styles}`}>Live</span></div>;
}

function AdmissionRow({ application, canWrite, classes, selectedClass, admissionNo, setSelectedClass, setAdmissionNo, onUpdate, onEnroll }: { application: AdmissionLite; canWrite: boolean; classes: ClassroomLite[]; selectedClass: string; admissionNo: string; setSelectedClass: (value: string) => void; setAdmissionNo: (value: string) => void; onUpdate: (status: string) => void; onEnroll: () => void }) {
  const statusClass = { SUBMITTED: 'bg-slate-100 text-slate-700', REVIEWING: 'bg-blue-50 text-blue-700', APPROVED: 'bg-amber-50 text-amber-700', REJECTED: 'bg-red-50 text-red-700', ENROLLED: 'bg-emerald-50 text-emerald-700', DRAFT: 'bg-slate-100 text-slate-500', WITHDRAWN: 'bg-slate-100 text-slate-500' }[application.status];
  return <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold text-slate-900">{application.firstName} {application.lastName ?? ''}</p><p className="mt-1 text-xs text-slate-500">Guardian: {application.guardianFirstName} {application.guardianLastName ?? ''} · {application.relationType}</p></div><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusClass}`}>{application.status[0] + application.status.slice(1).toLowerCase()}</span></div><div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500"><span>{application.guardianPhoneE164 || application.guardianEmail || 'Contact not provided'}</span>{application.classRoomId ? <span>· class assigned</span> : null}</div>{canWrite && application.status !== 'ENROLLED' && application.status !== 'REJECTED' ? <div className="mt-4 flex flex-wrap gap-2">{application.status === 'SUBMITTED' ? <Button size="sm" variant="outline" onClick={() => onUpdate('REVIEWING')}>Start review</Button> : null}{application.status === 'REVIEWING' ? <><Button size="sm" variant="outline" onClick={() => onUpdate('APPROVED')}>Approve</Button><Button size="sm" variant="ghost" onClick={() => onUpdate('REJECTED')}>Decline</Button></> : null}{application.status === 'APPROVED' ? <><Input className="h-9 w-32" placeholder="Admission no." value={admissionNo} onChange={(event) => setAdmissionNo(event.target.value)} /><select value={selectedClass || application.classRoomId || ''} onChange={(event) => setSelectedClass(event.target.value)} className="h-9 rounded-lg border border-slate-200 px-2 text-xs"><option value="">Choose class</option>{classes.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.section ?? 'Main'}</option>)}</select><Button size="sm" disabled={!admissionNo || !(selectedClass || application.classRoomId)} onClick={onEnroll}>Enroll student</Button></> : null}</div> : null}</div>;
}

function FinancePage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const canRead = auth.can('billing.feePlans.read');
  const canWrite = auth.can('billing.feePlans.write');
  const [schoolId, setSchoolId] = useState('');
  const [yearId, setYearId] = useState('');
  const [plan, setPlan] = useState({ name: '', billingCycle: 'MONTHLY', code: 'TUITION', itemName: 'Tuition Fee', amount: '' });
  const [assignment, setAssignment] = useState({ feePlanId: '', targetId: '', scope: 'CLASS' });
  const [adjustment, setAdjustment] = useState({ targetId: '', scope: 'STUDENT', code: 'DISCOUNT', name: '', amount: '', type: 'DISCOUNT', billingCycle: 'ONE_TIME', reason: '' });
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [schedule, setSchedule] = useState({ name: '', feePlanId: '', billingCycle: 'MONTHLY', startsOn: new Date().toISOString().slice(0, 10), issueDay: '1', dueDay: '10', autoPublish: true, autoEmail: false });
  const [generation, setGeneration] = useState({ scheduleId: '', periodStart: new Date().toISOString().slice(0, 8) + '01', periodEnd: new Date().toISOString().slice(0, 10) });
  useRequireAuth({ onRedirect: () => navigate({ to: '/login', search: { redirect: '/app/finance' } }) });
  const call = async (path: string, method: string, body?: unknown) => { const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'; const response = await auth.authFetch(`${apiBase}${path}`, { method, headers: { accept: 'application/json', ...(body ? { 'content-type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) }); const payload = await response.json().catch(() => undefined); if (!response.ok) throw new Error(payload?.message ?? `Request failed (${response.status})`); return payload; };
  const schools = useQuery({ queryKey: ['finance-schools'], queryFn: () => fetchJsonArray<SchoolLite>(auth.authFetch, '/api/schools'), enabled: canRead });
  const activeSchoolId = schoolId || schools.data?.[0]?.id || '';
  const years = useQuery({ queryKey: ['finance-years', activeSchoolId], queryFn: () => fetchJsonArray<{ id: string; name: string; isCurrent: boolean }>(auth.authFetch, `/api/academic-years?schoolId=${activeSchoolId}`), enabled: canRead && Boolean(activeSchoolId) });
  const activeYearId = yearId || years.data?.find((item) => item.isCurrent)?.id || years.data?.[0]?.id || '';
  const plans = useQuery({ queryKey: ['finance-plans', activeSchoolId, activeYearId], queryFn: () => fetchJsonArray<FeePlanLite>(auth.authFetch, `/api/billing/fee-plans?schoolId=${activeSchoolId}&academicYearId=${activeYearId}`), enabled: canRead && Boolean(activeSchoolId) && Boolean(activeYearId) });
  const assignments = useQuery({ queryKey: ['finance-assignments', activeSchoolId], queryFn: () => fetchJsonArray<FeeAssignmentLite>(auth.authFetch, `/api/billing/assignments?schoolId=${activeSchoolId}`), enabled: canRead && Boolean(activeSchoolId) });
  const classes = useQuery({ queryKey: ['finance-classes', activeSchoolId], queryFn: () => fetchJsonArray<ClassroomLite>(auth.authFetch, `/api/classrooms?schoolId=${activeSchoolId}`), enabled: canRead && Boolean(activeSchoolId) });
  const students = useQuery({ queryKey: ['finance-students', activeSchoolId], queryFn: () => fetchJsonArray<StudentLite>(auth.authFetch, `/api/students?schoolId=${activeSchoolId}`), enabled: canRead && Boolean(activeSchoolId) });
  const invoices = useQuery({ queryKey: ['finance-invoices', activeSchoolId], queryFn: () => fetchJsonArray<InvoiceLite>(auth.authFetch, `/api/billing/invoices?schoolId=${activeSchoolId}`), enabled: canRead && Boolean(activeSchoolId) });
  const payments = useQuery({ queryKey: ['finance-payments', activeSchoolId], queryFn: () => fetchJsonArray<PaymentLite>(auth.authFetch, `/api/billing/payments?schoolId=${activeSchoolId}`), enabled: canRead && Boolean(activeSchoolId) });
  const schedules = useQuery({ queryKey: ['finance-schedules', activeSchoolId], queryFn: () => fetchJsonArray<InvoiceScheduleLite>(auth.authFetch, `/api/billing/schedules?schoolId=${activeSchoolId}`), enabled: canRead && Boolean(activeSchoolId) });
  const ledger = useQuery<LedgerLite>({ queryKey: ['finance-ledger', selectedStudentId], queryFn: () => call(`/api/billing/students/${selectedStudentId}/ledger`, 'GET') as Promise<LedgerLite>, enabled: canRead && Boolean(selectedStudentId) });
  const mutation = useMutation({ mutationFn: ({ path, body }: { path: string; body: unknown }) => call(path, 'POST', body), onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['finance-plans'] }); void queryClient.invalidateQueries({ queryKey: ['finance-assignments'] }); void queryClient.invalidateQueries({ queryKey: ['finance-schedules'] }); void queryClient.invalidateQueries({ queryKey: ['finance-invoices'] }); } });
  const outstanding = (invoices.data ?? []).reduce((total, invoice) => total + Number(invoice.balanceAmount || 0), 0);
  const printReceipt = async (paymentId: string) => { const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'; const response = await auth.authFetch(`${apiBase}/api/billing/payments/${paymentId}/receipt`); const html = await response.text(); const windowRef = window.open('', '_blank'); if (windowRef) { windowRef.document.write(html); windowRef.document.close(); } };
  if (!canRead) return <p className="text-sm text-muted-foreground">Finance access denied.</p>;
  return <div className="mx-auto max-w-7xl space-y-8 pb-10">
    <section className="relative overflow-hidden rounded-[28px] bg-[#17233b] px-6 py-8 text-[#f6f3ea] shadow-2xl shadow-slate-900/10 md:px-10 md:py-10"><div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#d7a94b]/15 blur-3xl" /><div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end"><div className="max-w-2xl space-y-4"><div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#dfbd73]">Finance command centre</div><h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Make every rupee accountable.</h1><p className="max-w-xl text-sm leading-7 text-slate-300 md:text-base">Design flexible fee rules, assign them at the right scope, and keep the full journey—from charge to collection—visible.</p></div><div className="flex flex-wrap gap-3"><label className="min-w-[210px] text-xs font-medium text-slate-300">School<select value={activeSchoolId} onChange={(event) => { setSchoolId(event.target.value); setYearId(''); }} className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white outline-none"><option value="" className="text-slate-900">Select school</option>{(schools.data ?? []).map((school) => <option key={school.id} value={school.id} className="text-slate-900">{school.name}</option>)}</select></label><label className="min-w-[170px] text-xs font-medium text-slate-300">Academic year<select value={activeYearId} onChange={(event) => setYearId(event.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white outline-none"><option value="" className="text-slate-900">Select year</option>{(years.data ?? []).map((year) => <option key={year.id} value={year.id} className="text-slate-900">{year.name}{year.isCurrent ? ' · Current' : ''}</option>)}</select></label></div></div></section>
    {mutation.isError ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{(mutation.error as Error).message}</div> : null}
    <div className="grid gap-4 md:grid-cols-4"><FinanceMetric label="Fee plans" value={plans.data?.length ?? 0} /><FinanceMetric label="Recurring schedules" value={schedules.data?.length ?? 0} /><FinanceMetric label="Invoices" value={invoices.data?.length ?? 0} /><FinanceMetric label="Outstanding" value={`₹${outstanding.toLocaleString('en-IN')}`} /></div>
    <Card className="overflow-hidden border-slate-200/80 shadow-sm"><CardHeader className="border-b border-slate-100 bg-[#fbfaf7]"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a47725]">01 · Recurring engine</p><CardTitle>Turn fee plans into a predictable calendar</CardTitle><CardDescription>Create a schedule once, then generate each billing period with duplicate protection.</CardDescription></CardHeader><CardContent className="space-y-5 pt-6"><div className="grid gap-3 md:grid-cols-4"><Input placeholder="Schedule name · Monthly tuition" value={schedule.name} onChange={(event) => setSchedule({ ...schedule, name: event.target.value })} /><select value={schedule.feePlanId} onChange={(event) => { const selected = plans.data?.find((item) => item.id === event.target.value); setSchedule({ ...schedule, feePlanId: event.target.value, billingCycle: selected?.billingCycle ?? schedule.billingCycle }); }} className="rounded-xl border border-slate-200 px-3 text-sm"><option value="">Fee plan</option>{(plans.data ?? []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select value={schedule.billingCycle} onChange={(event) => setSchedule({ ...schedule, billingCycle: event.target.value })} className="rounded-xl border border-slate-200 px-3 text-sm"><option value="MONTHLY">Monthly</option><option value="QUARTERLY">Quarterly</option><option value="ANNUAL">Annual</option><option value="ONE_TIME">One-time</option></select><Input type="date" value={schedule.startsOn} onChange={(event) => setSchedule({ ...schedule, startsOn: event.target.value })} /></div><div className="grid gap-3 md:grid-cols-4"><Input type="number" min="1" max="28" placeholder="Issue day" value={schedule.issueDay} onChange={(event) => setSchedule({ ...schedule, issueDay: event.target.value })} /><Input type="number" min="1" max="28" placeholder="Due day" value={schedule.dueDay} onChange={(event) => setSchedule({ ...schedule, dueDay: event.target.value })} /><label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm"><input type="checkbox" checked={schedule.autoPublish} onChange={(event) => setSchedule({ ...schedule, autoPublish: event.target.checked })} /> Publish to portal</label><label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm"><input type="checkbox" checked={schedule.autoEmail} onChange={(event) => setSchedule({ ...schedule, autoEmail: event.target.checked })} /> Queue email</label></div><div className="flex flex-wrap gap-3"><Button disabled={!canWrite || !activeSchoolId || !activeYearId || !schedule.name || !schedule.feePlanId || mutation.isPending} onClick={() => { mutation.mutate({ path: '/api/billing/schedules', body: { ...schedule, schoolId: activeSchoolId, academicYearId: activeYearId, issueDay: Number(schedule.issueDay), dueDay: Number(schedule.dueDay) } }); setSchedule({ ...schedule, name: '' }); }}>Create schedule</Button><select value={generation.scheduleId} onChange={(event) => setGeneration({ ...generation, scheduleId: event.target.value })} className="rounded-xl border border-slate-200 px-3 text-sm"><option value="">Schedule to generate</option>{(schedules.data ?? []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><Input type="date" value={generation.periodStart} onChange={(event) => setGeneration({ ...generation, periodStart: event.target.value })} /><Input type="date" value={generation.periodEnd} onChange={(event) => setGeneration({ ...generation, periodEnd: event.target.value })} /><Button variant="outline" disabled={!canWrite || !generation.scheduleId || mutation.isPending} onClick={() => mutation.mutate({ path: '/api/billing/invoices/generate', body: generation })}>Generate period</Button><Button variant="ghost" disabled={!canWrite || !activeSchoolId || mutation.isPending} onClick={() => mutation.mutate({ path: '/api/billing/reminders/run', body: { schoolId: activeSchoolId, channel: 'EMAIL', daysBeforeDue: 3, asOf: new Date().toISOString() } })}>Queue reminders</Button></div><div className="grid gap-3 md:grid-cols-2">{(schedules.data ?? []).map((item) => <div key={item.id} className="rounded-2xl bg-slate-50 px-4 py-3"><div className="flex items-center justify-between gap-3"><p className="font-medium text-slate-900">{item.name}</p><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{item.billingCycle.toLowerCase()}</span></div><p className="mt-1 text-xs text-slate-500">{item.feePlanName} · issue day {item.issueDay} · due day {item.dueDay} · {item.invoiceCount} invoices</p></div>)}</div></CardContent></Card>
    <Card className="overflow-hidden border-slate-200/80 shadow-sm"><CardHeader className="border-b border-slate-100 bg-[#17233b] text-[#f6f3ea]"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#dfbd73]">02 · Student ledger</p><CardTitle className="text-[#f6f3ea]">The complete account, in one view</CardTitle><CardDescription className="text-slate-300">Charges, payments, family benefits, and the running balance stay connected to the student.</CardDescription></CardHeader><CardContent className="space-y-4 pt-6"><select value={selectedStudentId} onChange={(event) => setSelectedStudentId(event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"><option value="">Choose a student</option>{(students.data ?? []).map((student) => <option key={student.id} value={student.id}>{student.firstName} {student.lastName ?? ''} · {student.admissionNo}</option>)}</select>{ledger.data ? <div className="space-y-2"><div className="flex items-end justify-between rounded-2xl bg-[#fbfaf7] px-4 py-4"><div><p className="text-xs uppercase tracking-[0.18em] text-[#a47725]">Closing balance</p><p className="mt-1 text-2xl font-semibold text-slate-900">₹{Number(ledger.data.closingBalance).toLocaleString('en-IN')}</p></div><span className="text-xs text-slate-500">{ledger.data.entries.length} entries</span></div>{ledger.data.entries.slice(-8).reverse().map((entry) => <div key={entry.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5 text-sm"><div><p className="font-medium text-slate-800">{entry.description}</p><p className="text-xs text-slate-500">{entry.date.slice(0, 10)} · {entry.reference}</p></div><span className={entry.type === 'PAYMENT' ? 'font-semibold text-emerald-700' : 'font-semibold text-slate-900'}>{entry.type === 'PAYMENT' ? `−₹${entry.credit}` : `₹${entry.debit}`}</span></div>)}</div> : <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">Choose a student to open their ledger.</div>}</CardContent></Card>
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"><Card className="overflow-hidden border-slate-200/80 shadow-sm"><CardHeader className="border-b border-slate-100 bg-[#fbfaf7]"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a47725]">03 · Delivery desk</p><CardTitle>Publish, send, follow up</CardTitle><CardDescription>Portal publication is immediate; email delivery is queued with an auditable status for the configured provider.</CardDescription></CardHeader><CardContent className="space-y-2 pt-6">{(invoices.data ?? []).slice(0, 6).map((invoice) => <div key={invoice.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 px-3 py-2.5 text-sm"><div><p className="font-medium text-slate-800">{invoice.invoiceNumber ?? 'Invoice'}</p><p className="text-xs text-slate-500">{invoice.status.toLowerCase()} · balance ₹{Number(invoice.balanceAmount).toLocaleString('en-IN')}</p></div><div className="flex gap-2"><Button size="sm" variant="ghost" disabled={!canWrite} onClick={() => mutation.mutate({ path: `/api/billing/invoices/${invoice.id}/deliver`, body: { channel: 'PORTAL' } })}>Portal</Button><Button size="sm" variant="outline" disabled={!canWrite} onClick={() => mutation.mutate({ path: `/api/billing/invoices/${invoice.id}/deliver`, body: { channel: 'EMAIL' } })}>Queue email</Button></div></div>)}{(invoices.data ?? []).length === 0 ? <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">Generated invoices will appear here.</p> : null}</CardContent></Card><Card className="overflow-hidden border-slate-200/80 shadow-sm"><CardHeader className="border-b border-slate-100 bg-[#fbfaf7]"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a47725]">04 · Receipts</p><CardTitle>Close the loop cleanly</CardTitle><CardDescription>Open a print-ready receipt after recording a payment.</CardDescription></CardHeader><CardContent className="space-y-2 pt-6">{(payments.data ?? []).slice(0, 6).map((payment) => <div key={payment.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5 text-sm"><div><p className="font-medium text-slate-800">{payment.receiptNumber}</p><p className="text-xs text-slate-500">{payment.method.replace('_', ' ')} · ₹{Number(payment.amount).toLocaleString('en-IN')}</p></div><Button size="sm" variant="outline" onClick={() => void printReceipt(payment.id)}>Print receipt</Button></div>)}{(payments.data ?? []).length === 0 ? <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">Recorded payments will appear here.</p> : null}</CardContent></Card></div>
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <Card className="overflow-hidden border-slate-200/80 shadow-sm"><CardHeader className="border-b border-slate-100 bg-[#fbfaf7]"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a47725]">01 · Fee catalogue</p><CardTitle>Build reusable fee plans</CardTitle><CardDescription>One plan can be monthly, quarterly, annual, or one-time—and each plan can carry many components.</CardDescription></CardHeader><CardContent className="space-y-4 pt-6"><div className="grid gap-3 sm:grid-cols-[1fr_140px]"><Input placeholder="Plan name · Standard 2026" value={plan.name} onChange={(event) => setPlan({ ...plan, name: event.target.value })} /><select value={plan.billingCycle} onChange={(event) => setPlan({ ...plan, billingCycle: event.target.value })} className="rounded-xl border border-slate-200 px-3 text-sm"><option value="MONTHLY">Monthly</option><option value="QUARTERLY">Quarterly</option><option value="ANNUAL">Annual</option><option value="ONE_TIME">One-time</option></select></div><div className="grid gap-3 sm:grid-cols-[120px_1fr_140px]"><Input placeholder="Code" value={plan.code} onChange={(event) => setPlan({ ...plan, code: event.target.value.toUpperCase() })} /><Input placeholder="Component · Tuition" value={plan.itemName} onChange={(event) => setPlan({ ...plan, itemName: event.target.value })} /><Input placeholder="Amount" value={plan.amount} onChange={(event) => setPlan({ ...plan, amount: event.target.value })} /></div><Button disabled={!canWrite || !activeSchoolId || !activeYearId || !plan.name || !plan.itemName || !plan.amount || mutation.isPending} onClick={() => { mutation.mutate({ path: '/api/billing/fee-plans', body: { schoolId: activeSchoolId, academicYearId: activeYearId, name: plan.name, billingCycle: plan.billingCycle, items: [{ code: plan.code, name: plan.itemName, amount: plan.amount }] } }); setPlan({ ...plan, name: '', amount: '' }); }}>{mutation.isPending ? 'Saving…' : <><Plus className="mr-2 h-4 w-4" /> Create fee plan</>}</Button><div className="space-y-2 pt-2">{(plans.data ?? []).map((item) => <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3"><div><p className="font-medium text-slate-900">{item.name}</p><p className="mt-1 text-xs text-slate-500">{item.billingCycle.toLowerCase()} · {item.items.length} components · {item.items.map((fee) => fee.name).join(', ')}</p></div><span className="font-semibold text-slate-800">₹{item.items.reduce((sum, fee) => sum + Number(fee.amount), 0).toLocaleString('en-IN')}</span></div>)}</div></CardContent></Card>
      <Card className="overflow-hidden border-slate-200/80 shadow-sm"><CardHeader className="border-b border-slate-100 bg-[#fbfaf7]"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a47725]">02 · Scope</p><CardTitle>Assign without duplication</CardTitle><CardDescription>Start at class level, then override a single student when their circumstances differ.</CardDescription></CardHeader><CardContent className="space-y-4 pt-6"><select value={assignment.feePlanId} onChange={(event) => setAssignment({ ...assignment, feePlanId: event.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"><option value="">Choose fee plan</option>{(plans.data ?? []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><div className="grid gap-3 sm:grid-cols-[120px_1fr]"><select value={assignment.scope} onChange={(event) => setAssignment({ ...assignment, scope: event.target.value, targetId: '' })} className="rounded-xl border border-slate-200 px-3 text-sm"><option value="CLASS">Class</option><option value="STUDENT">Student</option></select><select value={assignment.targetId} onChange={(event) => setAssignment({ ...assignment, targetId: event.target.value })} className="rounded-xl border border-slate-200 px-3 text-sm"><option value="">Choose target</option>{(assignment.scope === 'CLASS' ? classes.data ?? [] : students.data ?? []).map((item) => <option key={item.id} value={item.id}>{assignment.scope === 'CLASS' ? `${(item as ClassroomLite).name} · ${(item as ClassroomLite).section ?? 'Main'}` : `${(item as StudentLite).firstName} ${(item as StudentLite).lastName ?? ''} · ${(item as StudentLite).admissionNo}`}</option>)}</select></div><Button className="w-full" disabled={!canWrite || !assignment.feePlanId || !assignment.targetId || mutation.isPending} onClick={() => { mutation.mutate({ path: assignment.scope === 'CLASS' ? '/api/billing/assignments/classes' : '/api/billing/assignments/students', body: { feePlanId: assignment.feePlanId, targetId: assignment.targetId } }); setAssignment({ ...assignment, targetId: '' }); }}>Assign fee plan</Button><div className="max-h-52 space-y-2 overflow-auto">{(assignments.data ?? []).map((item) => <div key={item.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-sm"><span>{item.targetLabel}</span><span className="text-xs text-slate-500">{item.scope.toLowerCase()} · {item.feePlanName}</span></div>)}</div></CardContent></Card>
    </div>
    <Card className="overflow-hidden border-slate-200/80 shadow-sm"><CardHeader className="border-b border-slate-100 bg-[#17233b] text-[#f6f3ea]"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#dfbd73]">03 · Exceptions</p><CardTitle className="text-[#f6f3ea]">Add the human context</CardTitle><CardDescription className="text-slate-300">Transport, meals, sibling discounts, scholarships, late fees, and one-off charges belong here—not buried in notes.</CardDescription></CardHeader><CardContent className="space-y-4 pt-6"><div className="grid gap-3 md:grid-cols-6"><select value={adjustment.scope} onChange={(event) => setAdjustment({ ...adjustment, scope: event.target.value, targetId: '' })} className="rounded-xl border border-slate-200 px-3 text-sm"><option value="STUDENT">Student</option><option value="CLASS">Class</option></select><select value={adjustment.targetId} onChange={(event) => setAdjustment({ ...adjustment, targetId: event.target.value })} className="rounded-xl border border-slate-200 px-3 text-sm md:col-span-2"><option value="">Choose target</option>{(adjustment.scope === 'CLASS' ? classes.data ?? [] : students.data ?? []).map((item) => <option key={item.id} value={item.id}>{adjustment.scope === 'CLASS' ? `${(item as ClassroomLite).name} · ${(item as ClassroomLite).section ?? 'Main'}` : `${(item as StudentLite).firstName} ${(item as StudentLite).lastName ?? ''}`}</option>)}</select><Input placeholder="Name · Sibling discount" value={adjustment.name} onChange={(event) => setAdjustment({ ...adjustment, name: event.target.value })} /><Input placeholder="Amount" value={adjustment.amount} onChange={(event) => setAdjustment({ ...adjustment, amount: event.target.value })} /><select value={adjustment.type} onChange={(event) => setAdjustment({ ...adjustment, type: event.target.value })} className="rounded-xl border border-slate-200 px-3 text-sm"><option value="DISCOUNT">Discount</option><option value="CHARGE">Charge</option></select></div><div className="flex flex-wrap gap-3"><select value={adjustment.billingCycle} onChange={(event) => setAdjustment({ ...adjustment, billingCycle: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="ONE_TIME">One-time</option><option value="MONTHLY">Monthly</option><option value="QUARTERLY">Quarterly</option><option value="ANNUAL">Annual</option></select><Input className="max-w-sm" placeholder="Reason or internal note" value={adjustment.reason} onChange={(event) => setAdjustment({ ...adjustment, reason: event.target.value })} /><Button disabled={!canWrite || !activeSchoolId || !adjustment.targetId || !adjustment.name || !adjustment.amount || mutation.isPending} onClick={() => { mutation.mutate({ path: '/api/billing/adjustments', body: { schoolId: activeSchoolId, [adjustment.scope === 'CLASS' ? 'classRoomId' : 'studentId']: adjustment.targetId, code: adjustment.code, name: adjustment.name, amount: adjustment.amount, type: adjustment.type, billingCycle: adjustment.billingCycle, reason: adjustment.reason || undefined } }); setAdjustment({ ...adjustment, targetId: '', name: '', amount: '', reason: '' }); }}>Add adjustment</Button></div></CardContent></Card>
  </div>;
}

function FinanceMetric({ label, value }: { label: string; value: number | string }) { return <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"><p className="text-2xl font-semibold text-slate-900">{value}</p><p className="mt-1 text-sm text-slate-600">{label}</p></div>; }

function FamiliesPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const canRead = auth.can('students.read');
  const canWrite = auth.can('students.write');
  const [selectedFamilyId, setSelectedFamilyId] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [benefit, setBenefit] = useState({ schoolId: '', type: 'PERCENTAGE', value: '10', reason: 'Second sibling discount' });
  const [alumni, setAlumni] = useState({ schoolId: '', name: '', relationshipLabel: 'Parent', graduationYear: '' });
  useRequireAuth({ onRedirect: () => navigate({ to: '/login', search: { redirect: '/app/families' } }) });
  const families = useQuery({ queryKey: ['families'], queryFn: () => fetchJsonArray<FamilyLite>(auth.authFetch, '/api/students/families'), enabled: canRead });
  const schools = useQuery({ queryKey: ['family-schools'], queryFn: () => fetchJsonArray<SchoolLite>(auth.authFetch, '/api/schools'), enabled: canRead });
  const students = useQuery({ queryKey: ['family-students'], queryFn: () => fetchStudents(auth.authFetch), enabled: canRead });
  const activeFamily = (families.data ?? []).find((family) => family.id === selectedFamilyId) ?? families.data?.[0];
  const call = async (path: string, body: unknown) => { const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'; const response = await auth.authFetch(`${apiBase}${path}`, { method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/json' }, body: JSON.stringify(body) }); const payload = await response.json().catch(() => undefined); if (!response.ok) throw new Error(payload?.message ?? 'Family update failed'); return payload; };
  const mutation = useMutation({ mutationFn: ({ path, body }: { path: string; body: unknown }) => call(path, body), onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['families'] }); } });
  if (!canRead) return <p className="text-sm text-muted-foreground">Family access denied.</p>;
  return <div className="mx-auto max-w-7xl space-y-8 pb-10">
    <section className="relative overflow-hidden rounded-[28px] bg-[#17233b] px-6 py-8 text-[#f6f3ea] shadow-2xl shadow-slate-900/10 md:px-10 md:py-10"><div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#d7a94b]/15 blur-3xl" /><div className="relative max-w-3xl space-y-4"><div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#dfbd73]">Family profile</div><h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-5xl">One family. Every chapter.</h1><p className="max-w-2xl text-sm leading-7 text-slate-300 md:text-base">Connect siblings, parents, and alumni across schools so the relationship—and the benefit attached to it—stays with the family, not inside a spreadsheet.</p></div></section>
    {mutation.isError ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{(mutation.error as Error).message}</div> : null}
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <Card className="overflow-hidden border-slate-200/80 shadow-sm"><CardHeader className="border-b border-slate-100 bg-[#fbfaf7]"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a47725]">Family directory</p><CardTitle>Bring the household together</CardTitle><CardDescription>Families live at the tenant level, so they can span schools and campuses.</CardDescription></CardHeader><CardContent className="space-y-4 pt-6"><div className="flex gap-2"><Input placeholder="Family name · Sharma Family" value={familyName} onChange={(event) => setFamilyName(event.target.value)} /><Button size="icon" aria-label="Create family" disabled={!canWrite || !familyName || mutation.isPending} onClick={() => { mutation.mutate({ path: '/api/students/families', body: { displayName: familyName } }); setFamilyName(''); }}><Plus className="h-4 w-4" /></Button></div><div className="space-y-2">{(families.data ?? []).map((family) => <button type="button" key={family.id} onClick={() => setSelectedFamilyId(family.id)} className={`w-full rounded-2xl border px-4 py-3 text-left transition ${activeFamily?.id === family.id ? 'border-[#b38b3d] bg-[#fbfaf7]' : 'border-slate-200 bg-white hover:bg-slate-50'}`}><div className="flex items-center justify-between"><span className="font-medium text-slate-900">{family.displayName}</span><span className="text-xs text-slate-500">{family.students.length} student{family.students.length === 1 ? '' : 's'}</span></div><p className="mt-1 text-xs text-slate-500">{family.alumni.length} alumni · {family.benefits.length} active benefit{family.benefits.length === 1 ? '' : 's'}</p></button>)}</div></CardContent></Card>
      <Card className="overflow-hidden border-slate-200/80 shadow-sm"><CardHeader className="border-b border-slate-100 bg-[#17233b] text-[#f6f3ea]"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#dfbd73]">Family dossier</p><CardTitle className="text-[#f6f3ea]">{activeFamily?.displayName ?? 'Select a family'}</CardTitle><CardDescription className="text-slate-300">A shared relationship graph for people, legacy, and benefits.</CardDescription></CardHeader><CardContent className="space-y-6 pt-6">{activeFamily ? <><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Students & siblings</p><div className="grid gap-2 sm:grid-cols-2">{activeFamily.students.map((student) => <div key={student.id} className="rounded-xl bg-slate-50 px-3 py-2.5"><p className="font-medium text-slate-800">{student.firstName} {student.lastName ?? ''}</p><p className="text-xs text-slate-500">{student.admissionNo} · {student.relationshipLabel ?? 'Family member'}</p></div>)}</div><div className="mt-3 flex gap-2"><select value={studentId} onChange={(event) => setStudentId(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="">Link a student</option>{(students.data ?? []).map((student) => <option key={student.id} value={student.id}>{student.firstName} {student.lastName ?? ''} · {student.admissionNo}</option>)}</select><Button disabled={!canWrite || !studentId || mutation.isPending} onClick={() => { mutation.mutate({ path: `/api/students/families/${activeFamily.id}/students`, body: { memberId: studentId, relationshipLabel: 'Sibling' } }); setStudentId(''); }}>Link</Button></div></div><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Family benefits</p>{activeFamily.benefits.length ? activeFamily.benefits.map((item) => <div key={item.id} className="mb-2 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2.5 text-sm"><span className="font-medium text-emerald-800">{item.reason}</span><span className="font-semibold text-emerald-700">{item.type === 'WAIVER' ? 'Waiver' : `${item.value}${item.type === 'PERCENTAGE' ? '%' : ' INR'}`}</span></div>) : <p className="rounded-xl border border-dashed border-slate-200 px-3 py-4 text-sm text-slate-500">No sibling benefit configured yet.</p>}<div className="mt-3 grid gap-2 sm:grid-cols-[1fr_100px_1fr_auto]"><select value={benefit.schoolId} onChange={(event) => setBenefit({ ...benefit, schoolId: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="">School</option>{(schools.data ?? []).map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}</select><select value={benefit.type} onChange={(event) => setBenefit({ ...benefit, type: event.target.value })} className="rounded-xl border border-slate-200 px-2 py-2 text-sm"><option value="PERCENTAGE">%</option><option value="FIXED">Fixed</option><option value="WAIVER">Waiver</option></select><Input placeholder="Reason · Second sibling" value={benefit.reason} onChange={(event) => setBenefit({ ...benefit, reason: event.target.value })} /><Button disabled={!canWrite || !benefit.schoolId || mutation.isPending} onClick={() => { mutation.mutate({ path: `/api/students/families/${activeFamily.id}/benefits`, body: { schoolId: benefit.schoolId, type: benefit.type, value: benefit.type === 'WAIVER' ? '100' : benefit.value, minimumStudentCount: 2, reason: benefit.reason } }); }}>Add benefit</Button></div></div><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Legacy & alumni</p>{activeFamily.alumni.map((item) => <div key={item.id} className="mb-2 rounded-xl bg-[#fbfaf7] px-3 py-2.5 text-sm"><span className="font-medium text-slate-800">{item.name}</span><span className="ml-2 text-xs text-slate-500">{item.relationshipLabel ?? 'Alumni'}{item.graduationYear ? ` · ${item.graduationYear}` : ''}</span></div>)}<div className="mt-3 grid gap-2 sm:grid-cols-2"><Input placeholder="Alumni name · Parent" value={alumni.name} onChange={(event) => setAlumni({ ...alumni, name: event.target.value })} /><select value={alumni.schoolId} onChange={(event) => setAlumni({ ...alumni, schoolId: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="">School attended</option>{(schools.data ?? []).map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}</select><Input placeholder="Graduation year" value={alumni.graduationYear} onChange={(event) => setAlumni({ ...alumni, graduationYear: event.target.value })} /><Button disabled={!canWrite || !alumni.name || !alumni.schoolId || mutation.isPending} onClick={() => { mutation.mutate({ path: `/api/students/families/${activeFamily.id}/alumni`, body: alumni }); setAlumni({ ...alumni, name: '', graduationYear: '' }); }}>Record alumni</Button></div></div></> : <p className="py-10 text-center text-sm text-slate-500">Create or choose a family to see its complete profile.</p>}</CardContent></Card>
    </div>
  </div>;
}

function LoginRoutePage() {
  const navigate = useNavigate();
  useRequireGuest({
    onRedirect: () => navigate({ to: '/app' }),
  });
  return <LoginPage />;
}

function SignUpRoutePage() {
  const navigate = useNavigate();
  useRequireGuest({
    onRedirect: () => navigate({ to: '/app' }),
  });
  return <SignUpPage />;
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    if (getStoredSession()) {
      throw redirect({ to: '/app' });
    }
    throw redirect({ to: '/login' });
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: () => {
    if (getStoredSession()) {
      throw redirect({ to: '/app' });
    }
  },
  component: LoginRoutePage,
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  beforeLoad: () => {
    if (getStoredSession()) {
      throw redirect({ to: '/app' });
    }
  },
  component: SignUpRoutePage,
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app',
  beforeLoad: ({ location }) => {
    if (!getStoredSession()) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AppHomePage,
});

const studentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/students',
  beforeLoad: ({ location }) => {
    if (!getStoredSession()) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: StudentsPage,
});

const admissionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/admissions',
  beforeLoad: ({ location }) => {
    if (!getStoredSession()) throw redirect({ to: '/login', search: { redirect: location.href } });
  },
  component: AdmissionsPage,
});

const financeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/finance',
  beforeLoad: ({ location }) => {
    if (!getStoredSession()) throw redirect({ to: '/login', search: { redirect: location.href } });
  },
  component: FinancePage,
});

const familiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/families',
  beforeLoad: ({ location }) => {
    if (!getStoredSession()) throw redirect({ to: '/login', search: { redirect: location.href } });
  },
  component: FamiliesPage,
});

const classesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/classes',
  beforeLoad: ({ location }) => {
    if (!getStoredSession()) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: ClassesPage,
});

const teachersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/teachers',
  beforeLoad: ({ location }) => {
    if (!getStoredSession()) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: TeachersPage,
});

const attendanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/attendance',
  beforeLoad: ({ location }) => {
    if (!getStoredSession()) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AttendancePage,
});

const provisionSchoolRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/schools/provision',
  beforeLoad: ({ location }) => {
    if (!getStoredSession()) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
  component: ProvisionSchoolPage,
});

const importStudentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/students/import',
  beforeLoad: ({ location }) => {
    if (!getStoredSession()) {
      throw redirect({ to: '/login', search: { redirect: location.href } });
    }
  },
  component: ImportStudentsPage,
});

const platformOverviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/platform',
  beforeLoad: ({ location }) => {
    if (!getStoredSession()) {
      throw redirect({ to: '/login', search: { redirect: location.href } });
    }
  },
  component: PlatformOverviewPage,
});

const importStaffRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/staff/import',
  beforeLoad: ({ location }) => {
    if (!getStoredSession()) throw redirect({ to: '/login', search: { redirect: location.href } });
  },
  component: ImportStaffPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signUpRoute,
  appRoute,
  classesRoute,
  admissionsRoute,
  financeRoute,
  familiesRoute,
  studentsRoute,
  teachersRoute,
  attendanceRoute,
  provisionSchoolRoute,
  importStudentsRoute,
  platformOverviewRoute,
  importStaffRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
