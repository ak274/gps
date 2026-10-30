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
  useParams,
  useRouterState,
} from '@tanstack/react-router';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  BookOpenCheck,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Building2,
  BadgeCheck,
  ClipboardList,
  Bell,
  Command,
  CreditCard,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Mail,
  Moon,
  Plus,
  Search,
  Save,
  ShieldCheck,
  Sparkles,
  Sun,
  Phone,
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
type TaskLite = {
  id: string;
  schoolId: string;
  title: string;
  description: string | null;
  type: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  assigneeName: string | null;
  dueAt: string | null;
  actionUrl: string | null;
  isOverdue: boolean;
  reminderCount: number;
};
type ApprovalLite = {
  id: string;
  schoolId: string;
  title: string;
  description: string | null;
  status: 'REQUESTED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED' | 'CANCELLED';
  entityType: string;
  entityId: string;
  dueAt: string | null;
  steps: Array<{ id: string; sequence: number; assigneeId: string; assigneeName: string | null; status: string; decisionNote: string | null }>;
};
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
  studentId?: string | null; status: 'DRAFT' | 'SUBMITTED' | 'REVIEWING' | 'INFO_REQUESTED' | 'APPROVED' | 'WAITLISTED' | 'REJECTED' | 'OFFERED' | 'FEE_PENDING' | 'READY_FOR_ENROLLMENT' | 'ENROLLED' | 'WITHDRAWN';
  firstName: string; lastName?: string | null; dateOfBirth: string;
  guardianFirstName: string; guardianLastName?: string | null; guardianPhoneE164?: string | null;
  guardianEmail?: string | null; relationType: string; createdAt: string;
};
type StudentDocumentRecordLite = { id: string; key: string; label: string; isRequired: boolean; status: string; reviewNote?: string | null; expiresAt?: string | null; documentId?: string | null };
type DocumentLite = { id: string; entityType: string; entityId: string; category: string; fileName: string; mimeType: string; fileSizeBytes: string; uploadedAt: string; reviewStatus: string; reviewNote?: string | null; reviewedAt?: string | null; expiresAt?: string | null; downloadUrl: string };
type DocumentAuditLite = { id: string; action: string; entityType: string; message?: string | null; oldValues?: Record<string, unknown> | null; newValues?: Record<string, unknown> | null; actorUserId?: string | null; createdAt: string };
type NotificationPreferenceLite = { id: string; eventKey: string; channel: string; enabled: boolean; updatedAt: string };
type StudentMedicalProfileLite = { allergies?: string | null; medicalConditions?: string | null; medications?: string | null; dietaryRequirements?: string | null; physicalRestrictions?: string | null; emergencyInstructions?: string | null; emergencyContactName?: string | null; emergencyContactPhone?: string | null; doctorName?: string | null; doctorPhone?: string | null };
type AdmissionFormLite = { id: string; schoolId: string; academicYearId: string; name: string; version: number; status: string; description?: string | null; sections: Array<{ id: string; title: string; sortOrder: number; fields: Array<{ id: string; key: string; label: string; type: string; isRequired: boolean; isSensitive: boolean }> }>; documents: Array<{ id: string; key: string; label: string; stage: string; isRequired: boolean; isSensitive: boolean }> };
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

  if (pathname.startsWith('/apply/')) {
    return <main className="min-h-screen bg-[#f7f4ee] text-[#17233b]"><Outlet /></main>;
  }

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

type PublicAdmissionField = { id: string; key: string; label: string; type: string; helpText?: string | null; isRequired: boolean; options?: unknown };
type PublicAdmissionSection = { id: string; title: string; description?: string | null; fields: PublicAdmissionField[] };
type PublicAdmissionForm = { id: string; name: string; version: number; description?: string | null; termsText?: string | null; sections: PublicAdmissionSection[]; documents: Array<{ id: string; label: string; isRequired: boolean }> };
type PublicAdmissionPayload = { school: { id: string; name: string; board?: string | null }; academicYear?: { id: string; name: string } | null; campuses: Array<{ id: string; name: string; code: string }>; classes: Array<{ id: string; name: string; gradeLevel: string; section?: string | null; campusId?: string | null }>; form: PublicAdmissionForm };

async function publicAdmissionRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
  const payload = (await response.json().catch(() => ({}))) as { message?: string } & T;
  if (!response.ok) throw new Error(payload.message ?? 'Something went wrong. Please try again.');
  return payload;
}

function PublicAdmissionPage() {
  const { schoolId } = useParams({ strict: false }) as { schoolId: string };
  const [page, setPage] = useState<PublicAdmissionPayload | null>(null);
  const [stage, setStage] = useState<'start' | 'verify' | 'wizard' | 'done'>('start');
  const [leadId, setLeadId] = useState('');
  const [resumeToken, setResumeToken] = useState('');
  const [verificationPreviewCode, setVerificationPreviewCode] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const [startForm, setStartForm] = useState({ firstName: '', lastName: '', email: '', phone: '', campusId: '', classRoomId: '' });

  useEffect(() => {
    void publicAdmissionRequest<PublicAdmissionPayload>(`/api/admissions/public/form/${schoolId}`)
      .then(setPage)
      .catch((reason: Error) => setError(reason.message));
  }, [schoolId]);

  useEffect(() => {
    if (stage !== 'wizard' || !leadId || !resumeToken) return;
    const timer = window.setTimeout(() => {
      void publicAdmissionRequest<{ savedAt: string }>(`/api/admissions/public/${leadId}/draft?resumeToken=${encodeURIComponent(resumeToken)}`, { method: 'PATCH', body: JSON.stringify({ draftData: draft, currentSection }) })
        .then((result) => setSavedAt(new Date(result.savedAt)))
        .catch(() => undefined);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [currentSection, draft, leadId, resumeToken, stage]);

  const activeSection = page?.form.sections[currentSection];
  const start = async (event: FormEvent) => {
    event.preventDefault(); setError('');
    try {
      const result = await publicAdmissionRequest<{ leadId: string; verificationPreviewCode?: string }>(`/api/admissions/public/start`, { method: 'POST', body: JSON.stringify({ schoolId, ...startForm }) });
      setLeadId(result.leadId); setVerificationPreviewCode(result.verificationPreviewCode ?? ''); setStage('verify');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to start your application.'); }
  };
  const verify = async (event: FormEvent) => {
    event.preventDefault(); setError('');
    try {
      const result = await publicAdmissionRequest<{ resumeToken: string; form: PublicAdmissionForm; draftData: Record<string, unknown>; currentSection: number }>(`/api/admissions/public/${leadId}/verify`, { method: 'POST', body: JSON.stringify({ code }) });
      setResumeToken(result.resumeToken); setDraft(result.draftData); setCurrentSection(result.currentSection); setPage((current) => current ? { ...current, form: result.form } : current); setStage('wizard');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'That code did not work.'); }
  };
  const goNext = () => {
    if (!activeSection || !page) return;
    const missing = activeSection.fields.filter((field) => field.isRequired && !draft[field.key]).map((field) => field.label);
    if (missing.length) { setError(`A quick check before you continue: ${missing.join(', ')} still need${missing.length === 1 ? 's' : ''} an answer.`); return; }
    setError('');
    if (currentSection < page.form.sections.length - 1) setCurrentSection((value) => value + 1);
  };
  const submit = async () => {
    setError('');
    try { await publicAdmissionRequest(`/api/admissions/public/${leadId}/submit?resumeToken=${encodeURIComponent(resumeToken)}`, { method: 'POST', body: JSON.stringify({}) }); setStage('done'); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Please complete the required details before submitting.'); }
  };

  if (!page && !error) return <div className="grid min-h-screen place-items-center text-sm text-slate-500">Preparing your admission space…</div>;
  if (error && !page) return <div className="grid min-h-screen place-items-center px-6 text-center"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a47725]">Admissions are taking a breath</p><h1 className="mt-3 text-3xl font-semibold">This application page isn’t available yet.</h1><p className="mt-3 text-slate-600">{error}</p></div></div>;
  if (!page) return null;

  if (stage === 'done') return <div className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16"><div className="w-full rounded-[2rem] bg-[#17233b] p-8 text-[#f8f5ed] shadow-2xl shadow-[#17233b]/20 sm:p-14"><div className="grid size-14 place-items-center rounded-2xl bg-[#dfbd73] text-[#17233b]"><Check className="size-7" /></div><p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-[#dfbd73]">Application received</p><h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight sm:text-6xl">That’s a beautiful beginning.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">{page.school.name} has your application. Their admissions team can now review the details and reach out using the contact you provided.</p></div></div>;

  return <div className="relative overflow-hidden"><div className="pointer-events-none absolute -right-32 -top-24 size-[32rem] rounded-full bg-[#dfbd73]/20 blur-3xl" /><div className="pointer-events-none absolute -left-48 top-[40%] size-[28rem] rounded-full bg-[#b9cfe0]/35 blur-3xl" /><div className="relative mx-auto min-h-screen max-w-7xl px-5 py-6 sm:px-8 sm:py-10">
    <header className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-2xl bg-[#17233b] text-[#dfbd73]"><GraduationCap className="size-5" /></div><div><p className="text-sm font-bold tracking-tight">{page.school.name}</p><p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">Admissions · {page.form.version ? `2026–27` : 'Application'}</p></div></div><div className="hidden items-center gap-2 rounded-full border border-[#17233b]/10 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-600 sm:flex"><Save className="size-3.5 text-emerald-600" /> Save anytime · return later</div></header>
    {stage === 'start' || stage === 'verify' ? <div className="grid items-center gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20"><div><p className="inline-flex items-center gap-2 rounded-full border border-[#dfbd73]/60 bg-[#fffaf0] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#8a671e]"><Sparkles className="size-3.5" /> A considered start</p><h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-[#17233b] sm:text-7xl">A place for your child to <span className="font-serif italic text-[#a47725]">begin.</span></h1><p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">Start with a few details. We’ll open a private application space where you can take your time, save automatically, and return whenever it suits your family.</p><div className="mt-9 grid max-w-xl gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-[#17233b]/10 bg-white/70 p-4"><Clock3 className="size-5 text-[#a47725]" /><p className="mt-5 text-sm font-semibold">15–20 minutes</p><p className="mt-1 text-xs leading-5 text-slate-500">Total, across as many sessions as you like.</p></div><div className="rounded-2xl border border-[#17233b]/10 bg-white/70 p-4"><Save className="size-5 text-[#a47725]" /><p className="mt-5 text-sm font-semibold">Auto-saved</p><p className="mt-1 text-xs leading-5 text-slate-500">Your progress stays with you.</p></div><div className="rounded-2xl border border-[#17233b]/10 bg-white/70 p-4"><ShieldCheck className="size-5 text-[#a47725]" /><p className="mt-5 text-sm font-semibold">Private by design</p><p className="mt-1 text-xs leading-5 text-slate-500">Only your verified email can resume it.</p></div></div></div><div className="rounded-[2rem] border border-[#17233b]/10 bg-white/85 p-6 shadow-2xl shadow-[#17233b]/10 backdrop-blur sm:p-9">{stage === 'start' ? <form onSubmit={start} className="space-y-5"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47725]">First, hello</p><h2 className="mt-2 text-2xl font-semibold">Let’s create your private space.</h2><p className="mt-2 text-sm leading-6 text-slate-500">We’ll send a one-time code to verify your email. No password to remember.</p></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">First name<Input className="mt-2" required value={startForm.firstName} onChange={(event) => setStartForm({ ...startForm, firstName: event.target.value })} /></label><label className="text-sm font-semibold">Last name<Input className="mt-2" value={startForm.lastName} onChange={(event) => setStartForm({ ...startForm, lastName: event.target.value })} /></label></div><label className="block text-sm font-semibold">Email address<div className="relative mt-2"><Mail className="absolute left-3 top-3 size-4 text-slate-400" /><Input className="pl-10" type="email" required value={startForm.email} onChange={(event) => setStartForm({ ...startForm, email: event.target.value })} /></div></label><label className="block text-sm font-semibold">Phone number<div className="relative mt-2"><Phone className="absolute left-3 top-3 size-4 text-slate-400" /><Input className="pl-10" type="tel" required value={startForm.phone} onChange={(event) => setStartForm({ ...startForm, phone: event.target.value })} /></div></label>{error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}<Button className="h-12 w-full rounded-xl bg-[#17233b] text-[#f8f5ed] hover:bg-[#273754]" type="submit">Begin application <ArrowRight className="ml-2 size-4" /></Button><p className="text-center text-xs text-slate-400">By continuing, you agree to begin an admission application with {page.school.name}.</p></form> : <form onSubmit={verify} className="space-y-5"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47725]">Check your inbox</p><h2 className="mt-2 text-2xl font-semibold">One small step, then you’re in.</h2><p className="mt-2 text-sm leading-6 text-slate-500">Enter the six-digit code sent to <span className="font-semibold text-slate-700">{startForm.email}</span>.</p></div><Input autoFocus inputMode="numeric" maxLength={6} placeholder="000000" className="h-14 text-center text-2xl font-bold tracking-[0.35em]" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))} />{verificationPreviewCode ? <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">Local preview: your verification code is <strong>{verificationPreviewCode}</strong>.</p> : null}{error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}<Button className="h-12 w-full rounded-xl bg-[#17233b] text-[#f8f5ed] hover:bg-[#273754]" type="submit" disabled={code.length !== 6}>Open my application <ArrowRight className="ml-2 size-4" /></Button><button type="button" className="w-full text-sm font-semibold text-slate-500 hover:text-[#17233b]" onClick={() => setStage('start')}>Use a different email</button></form>}</div></div> : <div className="grid gap-8 py-10 lg:grid-cols-[260px_1fr] lg:py-14"><aside className="lg:sticky lg:top-8 lg:self-start"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47725]">Your application</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Take it at your pace.</h1><p className="mt-3 text-sm leading-6 text-slate-500">We save as you go. You can close this page and return later using your verified email.</p><div className="mt-8 space-y-2">{page.form.sections.map((section, index) => <button type="button" key={section.id} onClick={() => index <= currentSection && setCurrentSection(index)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${index === currentSection ? 'bg-[#17233b] font-semibold text-white' : index < currentSection ? 'text-emerald-700 hover:bg-white' : 'text-slate-400'}`}><span className={`grid size-7 place-items-center rounded-full text-xs ${index < currentSection ? 'bg-emerald-100' : index === currentSection ? 'bg-[#dfbd73] text-[#17233b]' : 'bg-slate-200 text-slate-500'}`}>{index < currentSection ? <Check className="size-3.5" /> : index + 1}</span>{section.title}</button>)}</div></aside><section className="rounded-[2rem] border border-[#17233b]/10 bg-white/90 p-6 shadow-2xl shadow-[#17233b]/10 sm:p-10"><div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-7"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47725]">Section {currentSection + 1} of {page.form.sections.length}</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">{activeSection?.title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{activeSection?.description ?? 'A few thoughtful details help the school prepare a welcoming first step.'}</p></div><div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700"><Save className="size-3.5" />{savedAt ? `Saved ${savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Saving securely'}</div></div><div className="grid gap-5 py-8 sm:grid-cols-2">{activeSection?.fields.map((field) => <label key={field.id} className={`text-sm font-semibold ${field.type === 'TEXTAREA' ? 'sm:col-span-2' : ''}`}>{field.label}{field.isRequired ? <span className="ml-1 text-[#a47725]">*</span> : null}{field.type === 'BOOLEAN' ? <span className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 font-normal"><input type="checkbox" checked={Boolean(draft[field.key])} onChange={(event) => setDraft({ ...draft, [field.key]: event.target.checked })} className="size-4 accent-[#17233b]" />Yes, I confirm</span> : field.type === 'TEXTAREA' ? <textarea className="mt-2 min-h-32 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal outline-none ring-[#dfbd73] focus:ring-2" value={String(draft[field.key] ?? '')} onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })} /> : <Input className="mt-2" type={field.type === 'EMAIL' ? 'email' : field.type === 'DATE' ? 'date' : field.type === 'NUMBER' ? 'number' : field.type === 'PHONE' ? 'tel' : 'text'} value={String(draft[field.key] ?? '')} onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })} />}{field.helpText ? <span className="mt-1 block text-xs font-normal text-slate-400">{field.helpText}</span> : null}</label>)}</div>{error ? <p className="mb-5 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}<div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6"><Button variant="ghost" type="button" disabled={currentSection === 0} onClick={() => { setError(''); setCurrentSection((value) => Math.max(0, value - 1)); }}><ChevronLeft className="mr-1 size-4" />Back</Button>{currentSection === page.form.sections.length - 1 ? <Button type="button" className="rounded-xl bg-[#17233b] text-[#f8f5ed] hover:bg-[#273754]" onClick={submit}>Review & submit <CheckCircle2 className="ml-2 size-4" /></Button> : <Button type="button" className="rounded-xl bg-[#17233b] text-[#f8f5ed] hover:bg-[#273754]" onClick={goNext}>Save & continue <ChevronRight className="ml-2 size-4" /></Button>}</div></section></div>}
  </div></div>;
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
    { label: 'Student records', path: '/app/students/records', icon: ShieldCheck },
    ...(auth.user?.scopes?.includes('admissions.read')
      ? [{ label: 'Admissions', path: '/app/admissions', icon: BadgeCheck }]
      : []),
    ...(auth.user?.scopes?.includes('admissions.read')
      ? [{ label: 'Form builder', path: '/app/admissions/forms', icon: ClipboardList }]
      : []),
    ...(auth.user?.scopes?.includes('billing.feePlans.read')
      ? [{ label: 'Finance', path: '/app/finance', icon: Wallet }]
      : []),
    ...(auth.user?.scopes?.includes('students.read')
      ? [{ label: 'Families', path: '/app/families', icon: UsersRound }]
      : []),
    { label: 'Teachers', path: '/app/teachers', icon: UsersRound },
    { label: 'Attendance', path: '/app/attendance', icon: BookOpenCheck },
    ...(auth.user?.scopes?.includes('workflows.tasks.read')
      ? [{ label: 'Work queue', path: '/app/tasks', icon: ListTodo }]
      : []),
    ...(auth.user?.scopes?.includes('workflows.approvals.read')
      ? [{ label: 'Approvals', path: '/app/approvals', icon: BadgeCheck }]
      : []),
    ...(auth.user?.scopes?.includes('documents.read')
      ? [{ label: 'Document review', path: '/app/documents/review', icon: FileCheck2 }]
      : []),
    ...(auth.user?.scopes?.includes('communications.notifications.read')
      ? [{ label: 'Notification settings', path: '/app/settings/notifications', icon: Bell }]
      : []),
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

function ApprovalsPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const canRead = auth.can('workflows.approvals.read');
  const canDecide = auth.can('workflows.approvals.decide');
  const [schoolId, setSchoolId] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  useRequireAuth({ onRedirect: () => navigate({ to: '/login', search: { redirect: '/app/approvals' } }) });
  const request = async <T,>(path: string, method = 'GET', body?: unknown): Promise<T> => {
    const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
    const response = await auth.authFetch(`${apiBase}${path}`, { method, headers: { accept: 'application/json', ...(body ? { 'content-type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
    const payload = await response.json().catch(() => undefined);
    if (!response.ok) throw new Error(payload?.message ?? `Request failed (${response.status})`);
    return payload as T;
  };
  const schoolsQuery = useQuery({ queryKey: ['approvals-schools'], queryFn: () => fetchJsonArray<SchoolLite>(auth.authFetch, '/api/schools'), enabled: canRead });
  const activeSchoolId = schoolId || schoolsQuery.data?.[0]?.id || '';
  const approvalsQuery = useQuery({ queryKey: ['approvals', activeSchoolId], queryFn: () => request<ApprovalLite[]>(`/api/approvals?schoolId=${activeSchoolId}`), enabled: canRead && Boolean(activeSchoolId) });
  const mutation = useMutation({ mutationFn: ({ id, decision }: { id: string; decision: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES' }) => request(`/api/approvals/${id}/decision`, 'POST', { decision, note: note.trim() || (decision === 'APPROVE' ? 'Approved in the school workflow.' : 'Please review the request and provide the missing information.') }), onSuccess: () => { setNote(''); setMessage('Approval decision recorded.'); void queryClient.invalidateQueries({ queryKey: ['approvals'] }); void queryClient.invalidateQueries({ queryKey: ['tasks'] }); } });
  if (!canRead) return <p className="text-sm text-muted-foreground">Approval access denied.</p>;
  const approvals = approvalsQuery.data ?? [];
  return <div className="mx-auto max-w-7xl space-y-8 pb-10"><section className="relative overflow-hidden rounded-[28px] bg-[#17233b] px-6 py-8 text-[#f6f3ea] shadow-2xl shadow-slate-900/10 md:px-10 md:py-10"><div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#d7a94b]/15 blur-3xl" /><div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#dfbd73]"><BadgeCheck className="size-4" /> Approval desk</div><h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Decisions with context, not guesswork.</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">Review the evidence, see the ordered decision path and leave a reason that helps the next person act.</p></div><label className="min-w-[220px] text-xs font-medium text-slate-300">School<select value={activeSchoolId} onChange={(event) => setSchoolId(event.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white"><option value="" className="text-slate-900">Choose school</option>{(schoolsQuery.data ?? []).map((school) => <option key={school.id} value={school.id} className="text-slate-900">{school.name}</option>)}</select></label></div></section><Card><CardHeader><CardTitle>Approval requests</CardTitle><CardDescription>Each request is sequential, auditable and connected to an underlying school record.</CardDescription></CardHeader><CardContent className="space-y-4"><label className="block max-w-xl text-sm font-medium">Decision note<textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-1.5 min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Explain the decision or the information needed next." /></label>{approvals.map((approval) => { const active = approval.steps.find((step) => step.status === 'ACTIVE'); const canAct = canDecide && active?.assigneeId === auth.user?.sub; return <div key={approval.id} className="rounded-2xl border border-slate-100 p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold text-slate-900">{approval.title}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${approval.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' : approval.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{approval.status.toLowerCase().replace('_', ' ')}</span></div><p className="mt-1 text-xs text-slate-500">{approval.entityType} · {approval.entityId}{approval.dueAt ? ` · due ${approval.dueAt.slice(0, 10)}` : ''}</p><p className="mt-3 text-sm text-slate-600">{approval.description || 'No additional context was provided.'}</p></div>{canAct ? <div className="flex flex-wrap gap-2"><Button size="sm" onClick={() => mutation.mutate({ id: approval.id, decision: 'APPROVE' })}>Approve</Button><Button size="sm" variant="outline" onClick={() => mutation.mutate({ id: approval.id, decision: 'REQUEST_CHANGES' })}>Request changes</Button><Button size="sm" variant="destructive" onClick={() => mutation.mutate({ id: approval.id, decision: 'REJECT' })}>Reject</Button></div> : null}</div><div className="mt-4 grid gap-2 md:grid-cols-3">{approval.steps.map((step) => <div key={step.id} className={`rounded-xl border px-3 py-2.5 ${step.status === 'ACTIVE' ? 'border-[#d7a94b] bg-[#fffaf0]' : 'border-slate-100 bg-slate-50'}`}><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Step {step.sequence}</p><p className="mt-1 text-sm font-medium text-slate-800">{step.assigneeName ?? 'Assigned approver'}</p><p className="mt-1 text-xs text-slate-500">{step.status.toLowerCase().replace('_', ' ')}{step.decisionNote ? ` · ${step.decisionNote}` : ''}</p></div>)}</div></div>; })}{!approvals.length ? <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-12 text-center text-sm text-slate-500">No approval requests are waiting for this school.</div> : null}{message ? <p className="text-sm text-emerald-700">{message}</p> : null}</CardContent></Card></div>;
}

function NotificationSettingsPage() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const canRead = auth.user?.scopes?.includes('communications.notifications.read');
  const canWrite = auth.user?.scopes?.includes('communications.notifications.write');
  const request = async <T,>(path: string, method = 'GET', body?: unknown): Promise<T> => {
    const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
    const response = await auth.authFetch(`${apiBase}${path}`, { method, headers: { accept: 'application/json', ...(body ? { 'content-type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
    const payload = await response.json().catch(() => undefined);
    if (!response.ok) throw new Error(payload?.message ?? `Request failed (${response.status})`);
    return payload as T;
  };
  const preferencesQuery = useQuery({ queryKey: ['notification-preferences'], queryFn: () => request<NotificationPreferenceLite[]>('/api/communications/notifications/preferences'), enabled: Boolean(canRead) });
  const mutation = useMutation({ mutationFn: (preference: NotificationPreferenceLite) => request('/api/communications/notifications/preferences', 'POST', { eventKey: preference.eventKey, channel: preference.channel, enabled: !preference.enabled }), onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['notification-preferences'] }) });
  if (!canRead) return <div className="p-8 text-sm text-slate-500">You do not have permission to manage notification preferences.</div>;
  const preferences = preferencesQuery.data ?? [];
  const events = Array.from(new Set(preferences.map((item) => item.eventKey)));
  const formatEvent = (eventKey: string) => eventKey.replace(/_/g, ' ').toLowerCase().replace(/^./, (value: string) => value.toUpperCase());
  return <div className="space-y-6"><section className="rounded-[28px] bg-[#17233b] px-6 py-8 text-[#f6f3ea] shadow-2xl shadow-slate-900/10 md:px-10 md:py-10"><div className="flex items-start gap-3"><Bell className="mt-1 size-5 text-[#dfbd73]" /><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#dfbd73]">Your communication control</p><h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Choose how work reaches you.</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">In-app alerts stay enabled by default. Other channels are preferences for future delivery providers and can be changed without losing school notifications.</p></div></div></section><Card><CardHeader><CardTitle>Notification preferences</CardTitle><CardDescription>Control event categories by channel. Changes apply to your account in this institution.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead><tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500"><th className="px-3 py-3">Event</th>{['IN_APP', 'EMAIL', 'SMS', 'WHATSAPP'].map((channel) => <th key={channel} className="px-3 py-3">{channel.replace('_', ' ')}</th>)}</tr></thead><tbody>{events.map((eventKey) => <tr key={eventKey} className="border-b border-slate-100 last:border-0"><td className="px-3 py-4 font-medium text-slate-800">{formatEvent(eventKey)}</td>{['IN_APP', 'EMAIL', 'SMS', 'WHATSAPP'].map((channel) => { const preference = preferences.find((item) => item.eventKey === eventKey && item.channel === channel); return <td key={channel} className="px-3 py-4"><Button size="sm" variant={preference?.enabled ? 'default' : 'outline'} disabled={!canWrite || !preference || mutation.isPending} onClick={() => preference && mutation.mutate(preference)}>{preference?.enabled ? 'On' : 'Off'}</Button></td>; })}</tr>)}</tbody></table></div></CardContent></Card></div>;
}

function DocumentReviewPage() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const request = async <T,>(path: string, method = 'GET', body?: unknown): Promise<T> => {
    const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
    const response = await auth.authFetch(`${apiBase}${path}`, { method, headers: { accept: 'application/json', ...(body ? { 'content-type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
    const payload = await response.json().catch(() => undefined);
    if (!response.ok) throw new Error(payload?.message ?? `Request failed (${response.status})`);
    return payload as T;
  };
  const [status, setStatus] = useState('PENDING');
  const [note, setNote] = useState<Record<string, string>>({});
  const [auditDocumentId, setAuditDocumentId] = useState('');
  const canRead = auth.user?.scopes?.includes('documents.read');
  const canReview = auth.user?.scopes?.includes('documents.review');
  const documentsQuery = useQuery({
    queryKey: ['documents-review', status],
    queryFn: () => request<DocumentLite[]>(`/api/documents?reviewStatus=${status}`),
    enabled: Boolean(canRead),
  });
  const auditQuery = useQuery({ queryKey: ['document-audit', auditDocumentId], queryFn: () => request<DocumentAuditLite[]>(`/api/documents/${auditDocumentId}/audit`), enabled: Boolean(auditDocumentId && canRead) });
  const reviewMutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: string; nextStatus: string }) => request(`/api/documents/${id}/review`, 'PATCH', { status: nextStatus, note: note[id]?.trim() || undefined }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['documents-review'] });
    },
  });
  const expiryMutation = useMutation({ mutationFn: () => request<{ expired: number; tasksCreated: number }>('/api/documents/expiry-reminders/run?days=30', 'POST'), onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['documents-review'] }); } });

  if (!canRead) return <div className="p-8 text-sm text-slate-500">You do not have permission to review documents.</div>;
  const documents = documentsQuery.data ?? [];
  return <div className="space-y-6">
    <section className="relative overflow-hidden rounded-[28px] bg-[#17233b] px-6 py-8 text-[#f6f3ea] shadow-2xl shadow-slate-900/10 md:px-10 md:py-10">
      <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#d7a94b]/15 blur-3xl" />
      <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#dfbd73]"><FileCheck2 className="size-4" /> Evidence desk</div><h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Every document gets a clear answer.</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">Review uploaded evidence, explain what is missing, and keep admissions, student records and compliance journeys moving.</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white" disabled={expiryMutation.isPending} onClick={() => expiryMutation.mutate()}>Run renewal check</Button><select value={status} onChange={(event) => setStatus(event.target.value)} className="relative min-w-[190px] rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white"><option value="PENDING" className="text-slate-900">Pending review</option><option value="IN_REVIEW" className="text-slate-900">In review</option><option value="NEEDS_INFORMATION" className="text-slate-900">Needs information</option><option value="VERIFIED" className="text-slate-900">Verified</option><option value="REJECTED" className="text-slate-900">Rejected</option><option value="EXPIRED" className="text-slate-900">Expired</option></select></div></div>
    </section>
    <Card><CardHeader><CardTitle>{documents.length} documents in this queue</CardTitle><CardDescription>Decisions are recorded with the reviewer, timestamp and an explanation where follow-up is needed.</CardDescription></CardHeader><CardContent className="space-y-3">{documents.map((document) => <div key={document.id} className="rounded-2xl border border-slate-100 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-medium text-slate-900">{document.fileName}</p><p className="mt-1 text-xs text-slate-500">{document.category} · {document.entityType} · {document.entityId}</p><p className="mt-1 text-xs text-slate-400">Uploaded {document.uploadedAt.slice(0, 10)} · {document.mimeType}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${document.reviewStatus === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700' : document.reviewStatus === 'REJECTED' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{document.reviewStatus.replace('_', ' ').toLowerCase()}</span></div><div className="mt-3 flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => setAuditDocumentId(auditDocumentId === document.id ? '' : document.id)}>{auditDocumentId === document.id ? 'Hide history' : 'View history'}</Button><a className="inline-flex items-center rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700" href={document.downloadUrl} target="_blank" rel="noreferrer">Open file</a></div>{auditDocumentId === document.id ? <div className="mt-3 rounded-xl bg-slate-50 p-3">{(auditQuery.data ?? []).map((event) => <div key={event.id} className="border-b border-slate-200 py-2 last:border-0"><p className="text-xs font-semibold text-slate-700">{event.action} · {event.createdAt.slice(0, 19).replace('T', ' ')}</p><p className="text-xs text-slate-500">{event.message ?? 'Document record updated'}{event.actorUserId ? ` · by ${event.actorUserId}` : ''}</p></div>)}{!auditQuery.data?.length ? <p className="text-xs text-slate-500">No audit events recorded yet.</p> : null}</div> : null}{document.reviewNote ? <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">{document.reviewNote}</p> : null}{canReview ? <div className="mt-4 flex flex-col gap-2 sm:flex-row"><Input placeholder="Reviewer note (required for rejection or more information)" value={note[document.id] ?? ''} onChange={(event) => setNote((current) => ({ ...current, [document.id]: event.target.value }))} /><Button variant="outline" disabled={reviewMutation.isPending} onClick={() => reviewMutation.mutate({ id: document.id, nextStatus: 'NEEDS_INFORMATION' })}>Needs information</Button><Button disabled={reviewMutation.isPending} onClick={() => reviewMutation.mutate({ id: document.id, nextStatus: 'VERIFIED' })}>Verify</Button><Button variant="destructive" disabled={reviewMutation.isPending} onClick={() => reviewMutation.mutate({ id: document.id, nextStatus: 'REJECTED' })}>Reject</Button></div> : null}</div>)}{!documents.length ? <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-12 text-center text-sm text-slate-500">No documents are waiting in this queue. Choose another status or return when new evidence is uploaded.</div> : null}</CardContent></Card>
  </div>;
}

function TasksPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const canRead = auth.can('workflows.tasks.read');
  const canWrite = auth.can('workflows.tasks.write');
  const [schoolId, setSchoolId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ title: '', description: '', priority: 'NORMAL', dueAt: '' });
  useRequireAuth({ onRedirect: () => navigate({ to: '/login', search: { redirect: '/app/tasks' } }) });
  const request = async <T,>(path: string, method = 'GET', body?: unknown): Promise<T> => {
    const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
    const response = await auth.authFetch(`${apiBase}${path}`, { method, headers: { accept: 'application/json', ...(body ? { 'content-type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
    const payload = await response.json().catch(() => undefined);
    if (!response.ok) throw new Error(payload?.message ?? `Request failed (${response.status})`);
    return payload as T;
  };
  const schoolsQuery = useQuery({ queryKey: ['tasks-schools'], queryFn: () => fetchJsonArray<SchoolLite>(auth.authFetch, '/api/schools'), enabled: canRead });
  const activeSchoolId = schoolId || schoolsQuery.data?.[0]?.id || '';
  const tasksQuery = useQuery({ queryKey: ['tasks', activeSchoolId, statusFilter], queryFn: () => request<TaskLite[]>(`/api/tasks?schoolId=${activeSchoolId}${statusFilter ? `&status=${statusFilter}` : ''}`), enabled: canRead && Boolean(activeSchoolId) });
  const mutation = useMutation({ mutationFn: ({ path, method, body }: { path: string; method: string; body?: unknown }) => request(path, method, body), onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['tasks'] }); setMessage('Work queue updated.'); } });
  if (!canRead) return <p className="text-sm text-muted-foreground">Work queue access denied.</p>;
  const tasks = tasksQuery.data ?? [];
  const openCount = tasks.filter((task) => !['COMPLETED', 'CANCELLED'].includes(task.status)).length;
  const overdueCount = tasks.filter((task) => task.isOverdue).length;
  return <div className="mx-auto max-w-7xl space-y-8 pb-10">
    <section className="relative overflow-hidden rounded-[28px] bg-[#17233b] px-6 py-8 text-[#f6f3ea] shadow-2xl shadow-slate-900/10 md:px-10 md:py-10"><div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#d7a94b]/15 blur-3xl" /><div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#dfbd73]"><ListTodo className="size-4" /> Work queue</div><h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">The next action should never disappear.</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">Bring follow-ups, reviews and approvals into one calm queue with an owner, a due date and a recoverable next step.</p></div><div className="flex flex-wrap gap-3"><label className="min-w-[210px] text-xs font-medium text-slate-300">School<select value={activeSchoolId} onChange={(event) => setSchoolId(event.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white"><option value="" className="text-slate-900">Choose school</option>{(schoolsQuery.data ?? []).map((school) => <option key={school.id} value={school.id} className="text-slate-900">{school.name}</option>)}</select></label><label className="min-w-[160px] text-xs font-medium text-slate-300">View<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white"><option value="" className="text-slate-900">All work</option>{['OPEN', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'CANCELLED'].map((status) => <option key={status} value={status} className="text-slate-900">{status.replace('_', ' ')}</option>)}</select></label></div></div></section>
    <div className="grid gap-4 md:grid-cols-3"><Card><CardContent className="pt-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Visible work</p><p className="mt-2 text-3xl font-semibold">{tasks.length}</p><p className="mt-1 text-sm text-muted-foreground">Across the selected school</p></CardContent></Card><Card><CardContent className="pt-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Needs action</p><p className="mt-2 text-3xl font-semibold text-[#a47725]">{openCount}</p><p className="mt-1 text-sm text-muted-foreground">Open, active or blocked</p></CardContent></Card><Card><CardContent className="pt-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Overdue</p><p className="mt-2 text-3xl font-semibold text-rose-700">{overdueCount}</p><p className="mt-1 text-sm text-muted-foreground">Requires visible recovery</p></CardContent></Card></div>
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]"><Card><CardHeader><CardTitle>Pending actions</CardTitle><CardDescription>Every item has an owner, status and next decision.</CardDescription></CardHeader><CardContent className="space-y-3">{tasks.map((task) => <div key={task.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-medium text-slate-800">{task.title}</p><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${task.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : task.status === 'BLOCKED' || task.isOverdue ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{task.status.replace('_', ' ').toLowerCase()}</span><span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{task.priority.toLowerCase()}</span></div><p className="mt-1 text-xs text-slate-500">{task.assigneeName ? `Owned by ${task.assigneeName}` : 'Unassigned'}{task.dueAt ? ` · due ${task.dueAt.slice(0, 10)}` : ' · no due date'}{task.reminderCount ? ` · ${task.reminderCount} reminder${task.reminderCount === 1 ? '' : 's'}` : ''}</p></div><div className="flex items-center gap-2">{task.actionUrl ? <Button size="sm" variant="ghost" onClick={() => window.location.assign(task.actionUrl ?? '')}>Open source</Button> : null}{canWrite && !['COMPLETED', 'CANCELLED'].includes(task.status) ? <Button size="sm" variant="outline" onClick={() => mutation.mutate({ path: `/api/tasks/${task.id}/status`, method: 'PATCH', body: { status: 'COMPLETED' } })}>Complete</Button> : null}</div></div>)}{!tasks.length ? <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-12 text-center text-sm text-slate-500">Nothing is waiting here. New admissions, document reviews and approvals can appear in this queue.</div> : null}</CardContent></Card><Card><CardHeader><CardTitle>Create a follow-up</CardTitle><CardDescription>Keep the first save lightweight. Add detail later if the work grows.</CardDescription></CardHeader><CardContent className="space-y-4"><label className="space-y-1.5 text-sm font-medium">Title<Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. Verify missing birth certificate" /></label><label className="space-y-1.5 text-sm font-medium">Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="What should the owner know?" /></label><div className="grid gap-3 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium">Priority<select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">{['LOW', 'NORMAL', 'HIGH', 'URGENT'].map((priority) => <option key={priority}>{priority}</option>)}</select></label><label className="space-y-1.5 text-sm font-medium">Due date<input type="datetime-local" value={form.dueAt} onChange={(event) => setForm({ ...form, dueAt: event.target.value })} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" /></label></div><Button className="w-full" disabled={!canWrite || !activeSchoolId || !form.title.trim() || mutation.isPending} onClick={() => { mutation.mutate({ path: '/api/tasks', method: 'POST', body: { schoolId: activeSchoolId, title: form.title, description: form.description || undefined, priority: form.priority, dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : undefined } }); setForm({ title: '', description: '', priority: 'NORMAL', dueAt: '' }); }}>Add to queue</Button>{message ? <p className="text-xs text-emerald-700">{message}</p> : null}<Button variant="ghost" className="w-full" disabled={!canWrite || mutation.isPending} onClick={() => mutation.mutate({ path: '/api/tasks/reminders/run', method: 'POST' })}>Process due reminders</Button></CardContent></Card></div>
  </div>;
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

function StudentRecordsPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const canRead = auth.can('students.read');
  const canWrite = auth.can('students.write');
  const [schoolId, setSchoolId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [document, setDocument] = useState({ key: '', label: '', isRequired: true, documentId: '' });
  const [medical, setMedical] = useState<StudentMedicalProfileLite>({});
  useRequireAuth({ onRedirect: () => navigate({ to: '/login', search: { redirect: '/app/students/records' } }) });
  const schools = useQuery({ queryKey: ['student-records-schools'], queryFn: () => fetchJsonArray<SchoolLite>(auth.authFetch, '/api/schools'), enabled: canRead });
  const activeSchoolId = schoolId || schools.data?.[0]?.id || '';
  const students = useQuery({ queryKey: ['student-records-students', activeSchoolId], queryFn: () => fetchStudents(auth.authFetch, activeSchoolId), enabled: canRead && Boolean(activeSchoolId) });
  const activeStudentId = studentId || students.data?.[0]?.id || '';
  const request = async <T,>(path: string, method = 'GET', body?: unknown): Promise<T> => { const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'; const response = await auth.authFetch(`${apiBase}${path}`, { method, headers: { accept: 'application/json', ...(body ? { 'content-type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) }); const payload = await response.json().catch(() => undefined); if (!response.ok) throw new Error(payload?.message ?? `Request failed (${response.status})`); return payload as T; };
  const documents = useQuery({ queryKey: ['student-records-documents', activeStudentId], queryFn: () => request<StudentDocumentRecordLite[]>(`/api/students/${activeStudentId}/documents`), enabled: canRead && Boolean(activeStudentId) });
  const medicalQuery = useQuery({ queryKey: ['student-records-medical', activeStudentId], queryFn: () => request<StudentMedicalProfileLite | null>(`/api/students/${activeStudentId}/medical-profile`), enabled: canRead && Boolean(activeStudentId) });
  useEffect(() => {
    setMedical(medicalQuery.data ?? {});
  }, [medicalQuery.data]);
  const mutation = useMutation({ mutationFn: ({ path, method, body }: { path: string; method: string; body?: unknown }) => request(path, method, body), onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['student-records-documents'] }); void queryClient.invalidateQueries({ queryKey: ['student-records-medical'] }); } });
  const selectedStudent = students.data?.find((student) => student.id === activeStudentId);
  if (!canRead) return <p className="text-sm text-muted-foreground">Student records access denied.</p>;
  return <div className="mx-auto max-w-7xl space-y-8 pb-10">
    <section className="relative overflow-hidden rounded-[28px] bg-[#17233b] px-6 py-8 text-[#f6f3ea] shadow-2xl shadow-slate-900/10 md:px-10 md:py-10"><div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#d7a94b]/15 blur-3xl" /><div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#dfbd73]">Student records</div><h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">The details behind the student.</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">Keep evidence, sensitive support information and review responsibility together—so staff can act with context, not guesswork.</p></div><div className="flex flex-wrap gap-3"><label className="min-w-[210px] text-xs font-medium text-slate-300">School<select value={activeSchoolId} onChange={(event) => { setSchoolId(event.target.value); setStudentId(''); }} className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white"><option value="" className="text-slate-900">Choose school</option>{(schools.data ?? []).map((school) => <option key={school.id} value={school.id} className="text-slate-900">{school.name}</option>)}</select></label><label className="min-w-[240px] text-xs font-medium text-slate-300">Student<select value={activeStudentId} onChange={(event) => setStudentId(event.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white"><option value="" className="text-slate-900">Choose student</option>{(students.data ?? []).map((student) => <option key={student.id} value={student.id} className="text-slate-900">{student.firstName} {student.lastName ?? ''} · {student.admissionNo}</option>)}</select></label></div></div></section>
    {selectedStudent ? <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]"><Card className="overflow-hidden border-slate-200/80 shadow-sm"><CardHeader className="border-b border-slate-100 bg-[#fbfaf7]"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a47725]">Evidence checklist</p><CardTitle>{selectedStudent.firstName} {selectedStudent.lastName ?? ''}</CardTitle><CardDescription>Required evidence is visible before staff attempts enrollment or final verification.</CardDescription></div><ClipboardList className="mt-1 size-5 text-[#a47725]" /></div></CardHeader><CardContent className="space-y-3 pt-6">{(documents.data ?? []).map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 px-4 py-3"><div><p className="font-medium text-slate-800">{item.label}{item.isRequired ? <span className="ml-2 text-xs font-semibold text-[#a47725]">Required</span> : null}</p><p className="mt-1 text-xs text-slate-500">{item.documentId ? 'Metadata linked' : 'No file linked yet'}{item.expiresAt ? ` · expires ${item.expiresAt.slice(0, 10)}` : ''}{item.reviewNote ? ` · ${item.reviewNote}` : ''}</p></div><div className="flex items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700' : item.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{item.status.toLowerCase()}</span>{canWrite && item.status !== 'VERIFIED' ? <Button size="sm" variant="outline" onClick={() => mutation.mutate({ path: `/api/students/${activeStudentId}/documents/${item.id}`, method: 'PATCH', body: { status: 'VERIFIED' } })}>Verify</Button> : null}</div></div>)}{!(documents.data ?? []).length ? <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">No document checklist exists yet. Add the first required record below.</div> : null}<div className="grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-[1fr_1fr_auto_auto]"><Input placeholder="Key · birthCertificate" value={document.key} onChange={(event) => setDocument({ ...document, key: event.target.value })} /><Input placeholder="Label · Birth certificate" value={document.label} onChange={(event) => setDocument({ ...document, label: event.target.value })} /><Input placeholder="Object metadata ID" value={document.documentId} onChange={(event) => setDocument({ ...document, documentId: event.target.value })} /><Button disabled={!canWrite || !document.key || !document.label || mutation.isPending} onClick={() => { mutation.mutate({ path: `/api/students/${activeStudentId}/documents`, method: 'POST', body: { ...document, documentId: document.documentId || undefined } }); setDocument({ key: '', label: '', isRequired: true, documentId: '' }); }}>Add requirement</Button></div></CardContent></Card><Card className="overflow-hidden border-slate-200/80 shadow-sm"><CardHeader className="border-b border-slate-100 bg-[#17233b] text-[#f6f3ea]"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#dfbd73]">Restricted support record</p><CardTitle className="text-[#f6f3ea]">Medical and care context</CardTitle><CardDescription className="text-slate-300">Keep sensitive details available only to authorized school staff.</CardDescription></div><ShieldCheck className="mt-1 size-5 text-[#dfbd73]" /></div></CardHeader><CardContent className="space-y-3 pt-6"><div className="grid gap-3 sm:grid-cols-2">{(['allergies', 'medicalConditions', 'medications', 'dietaryRequirements', 'physicalRestrictions', 'emergencyInstructions', 'emergencyContactName', 'emergencyContactPhone', 'doctorName', 'doctorPhone'] as const).map((field) => <label key={field} className={`text-sm font-medium ${field === 'emergencyInstructions' ? 'sm:col-span-2' : ''}`}>{field.replace(/([A-Z])/g, ' $1').replace(/^./, (value) => value.toUpperCase())}<Input className="mt-1.5" value={medical[field] ?? ''} onChange={(event) => setMedical({ ...medical, [field]: event.target.value })} /></label>)}</div><Button className="w-full" disabled={!canWrite || mutation.isPending} onClick={() => mutation.mutate({ path: `/api/students/${activeStudentId}/medical-profile`, method: 'PUT', body: medical })}>{medicalQuery.isFetching ? 'Loading…' : 'Save restricted profile'}</Button></CardContent></Card></div> : <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center text-sm text-slate-500">Choose a school and student to open their document and support records.</div>}
  </div>;
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
  const counts = { inbox: applications.filter((item) => ['SUBMITTED', 'REVIEWING', 'INFO_REQUESTED'].includes(item.status)).length, approved: applications.filter((item) => ['APPROVED', 'OFFERED', 'FEE_PENDING', 'READY_FOR_ENROLLMENT'].includes(item.status)).length, enrolled: applications.filter((item) => item.status === 'ENROLLED').length };

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
        <Card className="overflow-hidden border-slate-200/80 shadow-sm"><CardHeader className="border-b border-slate-100 bg-[#fbfaf7]"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a47725]">Application pipeline</p><CardTitle>Every applicant, clearly placed</CardTitle><CardDescription>Move an application forward only when the next decision is ready.</CardDescription></div><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><option value="">All stages</option>{['SUBMITTED', 'REVIEWING', 'INFO_REQUESTED', 'APPROVED', 'WAITLISTED', 'OFFERED', 'FEE_PENDING', 'READY_FOR_ENROLLMENT', 'REJECTED', 'ENROLLED'].map((status) => <option key={status} value={status}>{status.replace(/_/g, ' ').toLowerCase()}</option>)}</select></div></CardHeader><CardContent className="space-y-3 pt-6">{applications.length ? applications.map((application) => <AdmissionRow key={application.id} application={application} canWrite={canWrite} classes={classesQuery.data ?? []} selectedClass={selectedClass} admissionNo={admissionNo} setSelectedClass={setSelectedClass} setAdmissionNo={setAdmissionNo} onUpdate={(status) => mutation.mutate({ path: `/api/admissions/applications/${application.id}/transition`, method: 'POST', body: { status } })} onEnroll={() => mutation.mutate({ path: `/api/admissions/applications/${application.id}/enroll`, method: 'POST', body: { admissionNo, classRoomId: selectedClass || application.classRoomId } })} />) : <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center"><p className="font-medium text-slate-800">Your admissions desk is quiet</p><p className="mt-1 text-sm text-slate-500">New applications will appear here for review.</p></div>}</CardContent></Card>
      </div>
    </div>
  );
}

function AdmissionFormsPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const canRead = auth.can('admissions.read');
  const canWrite = auth.can('admissions.write');
  const [schoolId, setSchoolId] = useState('');
  const [yearId, setYearId] = useState('');
  const [selectedFormId, setSelectedFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [sectionTitle, setSectionTitle] = useState('');
  const [field, setField] = useState({ sectionId: '', key: '', label: '', type: 'TEXT', isRequired: true, isSensitive: false });
  const [document, setDocument] = useState({ key: '', label: '', stage: 'APPLICATION', isRequired: true, isSensitive: false });
  useRequireAuth({ onRedirect: () => navigate({ to: '/login', search: { redirect: '/app/admissions/forms' } }) });
  const schools = useQuery({ queryKey: ['admission-form-schools'], queryFn: () => fetchJsonArray<SchoolLite>(auth.authFetch, '/api/schools'), enabled: canRead });
  const activeSchoolId = schoolId || schools.data?.[0]?.id || '';
  const years = useQuery({ queryKey: ['admission-form-years', activeSchoolId], queryFn: () => fetchJsonArray<{ id: string; name: string; isCurrent: boolean }>(auth.authFetch, `/api/academic-years?schoolId=${activeSchoolId}`), enabled: canRead && Boolean(activeSchoolId) });
  const activeYearId = yearId || years.data?.find((item) => item.isCurrent)?.id || years.data?.[0]?.id || '';
  const forms = useQuery({ queryKey: ['admission-forms', activeSchoolId, activeYearId], queryFn: () => fetchJsonArray<AdmissionFormLite>(auth.authFetch, `/api/admissions/forms?schoolId=${activeSchoolId}&academicYearId=${activeYearId}`), enabled: canRead && Boolean(activeSchoolId) && Boolean(activeYearId) });
  const activeForm = forms.data?.find((item) => item.id === selectedFormId) ?? forms.data?.[0];
  const call = async (path: string, body: unknown) => { const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'; const response = await auth.authFetch(`${apiBase}${path}`, { method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/json' }, body: JSON.stringify(body) }); const payload = await response.json().catch(() => undefined); if (!response.ok) throw new Error(payload?.message ?? 'Admission form update failed'); return payload; };
  const mutation = useMutation({ mutationFn: ({ path, body }: { path: string; body: unknown }) => call(path, body), onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['admission-forms'] }); } });
  if (!canRead) return <p className="text-sm text-muted-foreground">Admission form access denied.</p>;
  return <div className="mx-auto max-w-7xl space-y-8 pb-10">
    <section className="relative overflow-hidden rounded-[28px] bg-[#17233b] px-6 py-8 text-[#f6f3ea] shadow-2xl shadow-slate-900/10 md:px-10 md:py-10"><div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#d7a94b]/15 blur-3xl" /><div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end"><div className="max-w-2xl space-y-4"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#dfbd73]"><ClipboardList className="h-4 w-4" /> Admission form studio</div><h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Build the form your school actually needs.</h1><p className="max-w-xl text-sm leading-7 text-slate-300 md:text-base">Compose a clear parent experience from reusable sections, conditional-ready fields, and a document checklist—then preserve the exact version used by every application.</p></div><div className="flex flex-wrap gap-3"><label className="min-w-[210px] text-xs font-medium text-slate-300">School<select value={activeSchoolId} onChange={(event) => { setSchoolId(event.target.value); setYearId(''); }} className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white outline-none"><option value="" className="text-slate-900">Select school</option>{(schools.data ?? []).map((school) => <option key={school.id} value={school.id} className="text-slate-900">{school.name}</option>)}</select></label><label className="min-w-[170px] text-xs font-medium text-slate-300">Academic year<select value={activeYearId} onChange={(event) => setYearId(event.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white outline-none"><option value="" className="text-slate-900">Select year</option>{(years.data ?? []).map((year) => <option key={year.id} value={year.id} className="text-slate-900">{year.name}{year.isCurrent ? ' · Current' : ''}</option>)}</select></label></div></div></section>
    {mutation.isError ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{(mutation.error as Error).message}</div> : null}
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]"><Card className="overflow-hidden border-slate-200/80 shadow-sm"><CardHeader className="border-b border-slate-100 bg-[#fbfaf7]"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a47725]">Form versions</p><CardTitle>One source of truth per session</CardTitle><CardDescription>Published forms are immutable in practice: create the next version when policy changes.</CardDescription></CardHeader><CardContent className="space-y-4 pt-6"><div className="flex gap-2"><Input placeholder="2027–28 standard admission" value={formName} onChange={(event) => setFormName(event.target.value)} /><Button size="icon" aria-label="Create admission form" disabled={!canWrite || !activeSchoolId || !activeYearId || !formName || mutation.isPending} onClick={() => { mutation.mutate({ path: '/api/admissions/forms', body: { schoolId: activeSchoolId, academicYearId: activeYearId, name: formName } }); setFormName(''); }}><Plus className="h-4 w-4" /></Button></div><div className="space-y-2">{(forms.data ?? []).map((form) => <button type="button" key={form.id} onClick={() => setSelectedFormId(form.id)} className={`w-full rounded-2xl border px-4 py-3 text-left transition ${activeForm?.id === form.id ? 'border-[#b38b3d] bg-[#fbfaf7]' : 'border-slate-200 bg-white hover:bg-slate-50'}`}><div className="flex items-center justify-between gap-3"><span className="font-medium text-slate-900">{form.name}</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${form.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700' : form.status === 'ARCHIVED' ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-700'}`}>{form.status.toLowerCase()}</span></div><p className="mt-1 text-xs text-slate-500">Version {form.version} · {form.sections.length} sections · {form.documents.length} document rules</p></button>)}</div></CardContent></Card><Card className="overflow-hidden border-slate-200/80 shadow-sm"><CardHeader className="border-b border-slate-100 bg-[#17233b] text-[#f6f3ea]"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#dfbd73]">Builder canvas</p><CardTitle className="text-[#f6f3ea]">{activeForm?.name ?? 'Create a form to begin'}</CardTitle><CardDescription className="text-slate-300">{activeForm ? `Version ${activeForm.version} · ${activeForm.status.toLowerCase()}` : 'Sections, fields and evidence rules appear here.'}</CardDescription></div>{activeForm?.status === 'DRAFT' ? <Button disabled={!canWrite || mutation.isPending} onClick={() => mutation.mutate({ path: `/api/admissions/forms/${activeForm.id}/publish`, body: {} })}>Publish version</Button> : null}</div></CardHeader><CardContent className="space-y-6 pt-6">{activeForm ? <><div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-slate-200 p-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Sections</p><div className="mt-3 space-y-2">{activeForm.sections.map((section) => <div key={section.id} className="rounded-xl bg-slate-50 px-3 py-2.5"><div className="flex items-center justify-between"><span className="font-medium text-slate-800">{section.title}</span><span className="text-xs text-slate-500">{section.fields.length} fields</span></div>{section.fields.length ? <p className="mt-1 text-xs text-slate-500">{section.fields.map((item) => item.label).join(' · ')}</p> : null}</div>)}</div></div><div className="rounded-2xl border border-slate-200 p-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Document checklist</p><div className="mt-3 space-y-2">{activeForm.documents.map((item) => <div key={item.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-sm"><span>{item.label}</span><span className="text-xs text-slate-500">{item.isRequired ? 'Required' : 'Optional'} · {item.stage.toLowerCase()}</span></div>)}{!activeForm.documents.length ? <p className="text-sm text-slate-500">No evidence rules yet.</p> : null}</div></div></div>{activeForm.status === 'DRAFT' ? <div className="grid gap-4 md:grid-cols-3"><div className="space-y-2 rounded-2xl bg-[#fbfaf7] p-4"><p className="font-medium text-slate-900">Add section</p><Input placeholder="Student & family" value={sectionTitle} onChange={(event) => setSectionTitle(event.target.value)} /><Button className="w-full" disabled={!canWrite || !sectionTitle || mutation.isPending} onClick={async () => { const created = await call(`/api/admissions/forms/${activeForm.id}/sections`, { title: sectionTitle, sortOrder: activeForm.sections.length }); setSectionTitle(''); void queryClient.invalidateQueries({ queryKey: ['admission-forms'] }); if (created?.id) setField({ ...field, sectionId: created.id }); }}>Add section</Button></div><div className="space-y-2 rounded-2xl bg-[#fbfaf7] p-4"><p className="font-medium text-slate-900">Add field</p><select value={field.sectionId} onChange={(event) => setField({ ...field, sectionId: event.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="">Section</option>{activeForm.sections.map((section) => <option key={section.id} value={section.id}>{section.title}</option>)}</select><Input placeholder="Field key · motherTongue" value={field.key} onChange={(event) => setField({ ...field, key: event.target.value })} /><Input placeholder="Label · Mother tongue" value={field.label} onChange={(event) => setField({ ...field, label: event.target.value })} /><select value={field.type} onChange={(event) => setField({ ...field, type: event.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="TEXT">Text</option><option value="DATE">Date</option><option value="SELECT">Select</option><option value="BOOLEAN">Yes / No</option><option value="FILE">File</option><option value="TEXTAREA">Long text</option></select><div className="flex gap-4 text-xs text-slate-600"><label><input type="checkbox" checked={field.isRequired} onChange={(event) => setField({ ...field, isRequired: event.target.checked })} /> Required</label><label><input type="checkbox" checked={field.isSensitive} onChange={(event) => setField({ ...field, isSensitive: event.target.checked })} /> Sensitive</label></div><Button className="w-full" disabled={!canWrite || !field.sectionId || !field.key || !field.label || mutation.isPending} onClick={() => { mutation.mutate({ path: `/api/admissions/form-sections/${field.sectionId}/fields`, body: { ...field, sortOrder: 0 } }); setField({ ...field, key: '', label: '' }); }}>Add field</Button></div><div className="space-y-2 rounded-2xl bg-[#fbfaf7] p-4"><p className="font-medium text-slate-900">Add evidence rule</p><Input placeholder="Key · birthCertificate" value={document.key} onChange={(event) => setDocument({ ...document, key: event.target.value })} /><Input placeholder="Label · Birth certificate" value={document.label} onChange={(event) => setDocument({ ...document, label: event.target.value })} /><select value={document.stage} onChange={(event) => setDocument({ ...document, stage: event.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="APPLICATION">Application</option><option value="REVIEW">Review</option><option value="ENROLLMENT">Enrollment</option></select><div className="flex gap-4 text-xs text-slate-600"><label><input type="checkbox" checked={document.isRequired} onChange={(event) => setDocument({ ...document, isRequired: event.target.checked })} /> Required</label><label><input type="checkbox" checked={document.isSensitive} onChange={(event) => setDocument({ ...document, isSensitive: event.target.checked })} /> Sensitive</label></div><Button className="w-full" disabled={!canWrite || !document.key || !document.label || mutation.isPending} onClick={() => { mutation.mutate({ path: `/api/admissions/forms/${activeForm.id}/documents`, body: { ...document, schoolId: activeForm.schoolId, acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'] } }); setDocument({ ...document, key: '', label: '' }); }}>Add document rule</Button></div></div> : null}</> : <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-12 text-center text-sm text-slate-500">Create a draft form, then shape the parent experience one section at a time.</div>}</CardContent></Card></div>
  </div>;
}

function AdmissionMetric({ label, value, tone }: { label: string; value: number; tone: 'amber' | 'blue' | 'green' }) {
  const styles = { amber: 'bg-amber-50 text-amber-700', blue: 'bg-blue-50 text-blue-700', green: 'bg-emerald-50 text-emerald-700' }[tone];
  return <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"><div><p className="text-2xl font-semibold text-slate-900">{value}</p><p className="text-sm text-slate-600">{label}</p></div><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${styles}`}>Live</span></div>;
}

function AdmissionRow({ application, canWrite, classes, selectedClass, admissionNo, setSelectedClass, setAdmissionNo, onUpdate, onEnroll }: { application: AdmissionLite; canWrite: boolean; classes: ClassroomLite[]; selectedClass: string; admissionNo: string; setSelectedClass: (value: string) => void; setAdmissionNo: (value: string) => void; onUpdate: (status: string) => void; onEnroll: () => void }) {
  const statusClass: Record<string, string> = { SUBMITTED: 'bg-slate-100 text-slate-700', REVIEWING: 'bg-blue-50 text-blue-700', INFO_REQUESTED: 'bg-orange-50 text-orange-700', APPROVED: 'bg-amber-50 text-amber-700', WAITLISTED: 'bg-violet-50 text-violet-700', OFFERED: 'bg-cyan-50 text-cyan-700', FEE_PENDING: 'bg-orange-50 text-orange-700', READY_FOR_ENROLLMENT: 'bg-emerald-50 text-emerald-700', REJECTED: 'bg-red-50 text-red-700', ENROLLED: 'bg-emerald-100 text-emerald-800', DRAFT: 'bg-slate-100 text-slate-500', WITHDRAWN: 'bg-slate-100 text-slate-500' };
  const label = application.status.replace(/_/g, ' ').toLowerCase();
  return <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold text-slate-900">{application.firstName} {application.lastName ?? ''}</p><p className="mt-1 text-xs text-slate-500">Guardian: {application.guardianFirstName} {application.guardianLastName ?? ''} · {application.relationType}</p></div><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusClass[application.status] ?? 'bg-slate-100 text-slate-600'}`}>{label}</span></div><div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500"><span>{application.guardianPhoneE164 || application.guardianEmail || 'Contact not provided'}</span>{application.classRoomId ? <span>· class assigned</span> : null}</div>{canWrite && !['ENROLLED', 'REJECTED', 'WITHDRAWN'].includes(application.status) ? <div className="mt-4 flex flex-wrap gap-2">{application.status === 'SUBMITTED' ? <Button size="sm" variant="outline" onClick={() => onUpdate('REVIEWING')}>Start review</Button> : null}{['REVIEWING', 'INFO_REQUESTED'].includes(application.status) ? <><Button size="sm" variant="outline" onClick={() => onUpdate('APPROVED')}>Approve</Button><Button size="sm" variant="ghost" onClick={() => onUpdate('WAITLISTED')}>Waitlist</Button><Button size="sm" variant="ghost" onClick={() => onUpdate('REJECTED')}>Decline</Button></> : null}{application.status === 'APPROVED' ? <Button size="sm" variant="outline" onClick={() => onUpdate('OFFERED')}>Issue offer</Button> : null}{application.status === 'OFFERED' ? <Button size="sm" variant="outline" onClick={() => onUpdate('FEE_PENDING')}>Mark fees due</Button> : null}{application.status === 'FEE_PENDING' ? <Button size="sm" variant="outline" onClick={() => onUpdate('READY_FOR_ENROLLMENT')}>Final verification</Button> : null}{['APPROVED', 'READY_FOR_ENROLLMENT'].includes(application.status) ? <><Input className="h-9 w-32" placeholder="Admission no." value={admissionNo} onChange={(event) => setAdmissionNo(event.target.value)} /><select value={selectedClass || application.classRoomId || ''} onChange={(event) => setSelectedClass(event.target.value)} className="h-9 rounded-lg border border-slate-200 px-2 text-xs"><option value="">Choose class</option>{classes.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.section ?? 'Main'}</option>)}</select><Button size="sm" disabled={application.status !== 'READY_FOR_ENROLLMENT' || !admissionNo || !(selectedClass || application.classRoomId)} onClick={onEnroll}>Enroll student</Button></> : null}</div> : null}</div>;
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

const publicAdmissionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/apply/$schoolId',
  component: PublicAdmissionPage,
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

const studentRecordsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/students/records',
  beforeLoad: ({ location }) => {
    if (!getStoredSession()) throw redirect({ to: '/login', search: { redirect: location.href } });
  },
  component: StudentRecordsPage,
});

const tasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/tasks',
  beforeLoad: ({ location }) => {
    if (!getStoredSession()) throw redirect({ to: '/login', search: { redirect: location.href } });
  },
  component: TasksPage,
});

const approvalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/approvals',
  beforeLoad: ({ location }) => {
    if (!getStoredSession()) throw redirect({ to: '/login', search: { redirect: location.href } });
  },
  component: ApprovalsPage,
});

const documentReviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/documents/review',
  beforeLoad: ({ location }) => {
    if (!getStoredSession()) throw redirect({ to: '/login', search: { redirect: location.href } });
  },
  component: DocumentReviewPage,
});

const notificationSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/settings/notifications',
  beforeLoad: ({ location }) => {
    if (!getStoredSession()) throw redirect({ to: '/login', search: { redirect: location.href } });
  },
  component: NotificationSettingsPage,
});

const admissionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/admissions',
  beforeLoad: ({ location }) => {
    if (!getStoredSession()) throw redirect({ to: '/login', search: { redirect: location.href } });
  },
  component: AdmissionsPage,
});

const admissionFormsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/admissions/forms',
  beforeLoad: ({ location }) => {
    if (!getStoredSession()) throw redirect({ to: '/login', search: { redirect: location.href } });
  },
  component: AdmissionFormsPage,
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
  publicAdmissionRoute,
  appRoute,
  classesRoute,
  admissionsRoute,
  admissionFormsRoute,
  financeRoute,
  familiesRoute,
  studentsRoute,
  studentRecordsRoute,
  tasksRoute,
  approvalsRoute,
  documentReviewRoute,
  notificationSettingsRoute,
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
