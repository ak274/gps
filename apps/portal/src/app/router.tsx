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
import { useQuery } from '@tanstack/react-query';
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
  Search,
  Sparkles,
  Sun,
  Users,
  UsersRound,
  Wallet,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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
type FeePlanLite = { id: string; name: string };
type StudentLite = { id: string; firstName: string; lastName?: string | null; admissionNo: string };
type AttendanceSessionLite = { id: string; classRoomId: string; attendanceOn: string };

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
  const onboardingPercent = Math.round((completedSteps / onboardingSteps.length) * 100);

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

  const globalNavItems = [
    { label: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { label: 'Classes', path: '/app/classes', icon: Building2 },
    { label: 'Students', path: '/app/students', icon: GraduationCap },
    { label: 'Teachers', path: '/app/teachers', icon: UsersRound },
    { label: 'Attendance', path: '/app/attendance', icon: BookOpenCheck },
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

            {onboardingSteps.map((step) => {
              const done = onboarding.steps[step.id];
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

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signUpRoute,
  appRoute,
  classesRoute,
  studentsRoute,
  teachersRoute,
  attendanceRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
