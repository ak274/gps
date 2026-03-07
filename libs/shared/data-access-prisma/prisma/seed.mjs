import { PrismaClient, Prisma, MembershipStatus, UserStatus, TenantStatus, Gender, EnrollmentStatus, AttendanceStatus, PaymentMethod, PaymentStatus } from '../src/generated/client/index.js';

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = 'Pass@12345';
const DEFAULT_PASSWORD_HASH = '$2b$10$cJ6x0ziEvnzoku7FMz4VtOWMrjrFR8TC8IBdHyfS7Ty9BBWFsQZCO';

const ALL_SCOPES = [
  'academics.rollover.write',
  'admissions.read',
  'admissions.write',
  'attendance.records.read',
  'attendance.records.write',
  'attendance.sessions.read',
  'attendance.sessions.write',
  'attendance.teachers.read',
  'attendance.teachers.write',
  'auth.read',
  'billing.feePlans.read',
  'billing.feePlans.write',
  'billing.invoices.read',
  'billing.invoices.write',
  'billing.payments.read',
  'billing.payments.write',
  'classrooms.read',
  'classrooms.write',
  'communications.messages.read',
  'communications.messages.write',
  'communications.notifications.read',
  'communications.notifications.write',
  'documents.read',
  'documents.write',
  'enrollments.read',
  'enrollments.write',
  'exams.read',
  'exams.write',
  'guardians.read',
  'guardians.write',
  'homework.read',
  'homework.write',
  'rbac.assignments.read',
  'rbac.assignments.write',
  'rbac.permissions.read',
  'rbac.roles.read',
  'rbac.roles.write',
  'schools.read',
  'schools.write',
  'staff.read',
  'staff.write',
  'students.exit.approve',
  'students.exit.read',
  'students.exit.request',
  'students.lifecycle.read',
  'students.lifecycle.write',
  'students.read',
  'students.write',
  'subjects.read',
  'subjects.write',
  'teachers.read',
  'teachers.write',
  'tenants.read',
  'tenants.write',
  'timetable.read',
  'timetable.write',
  'transport.assignments.read',
  'transport.assignments.write',
  'transport.routes.read',
  'transport.routes.write',
  'transport.stops.read',
  'transport.stops.write',
  'transport.vehicles.read',
  'transport.vehicles.write',
];

const ROLE_SCOPE_MAP = {
  super_admin: ALL_SCOPES,
  admin: ALL_SCOPES,
  tenant_admin: ALL_SCOPES,
  school_admin: ALL_SCOPES.filter((scope) => !scope.startsWith('tenants.')),
  teacher: [
    'auth.read',
    'students.read',
    'guardians.read',
    'teachers.read',
    'classrooms.read',
    'subjects.read',
    'enrollments.read',
    'attendance.records.read',
    'attendance.records.write',
    'attendance.sessions.read',
    'attendance.sessions.write',
    'homework.read',
    'homework.write',
    'exams.read',
    'exams.write',
    'timetable.read',
    'communications.messages.read',
    'communications.messages.write',
    'communications.notifications.read',
  ],
  student: [
    'auth.read',
    'students.read',
    'attendance.records.read',
    'homework.read',
    'timetable.read',
    'exams.read',
    'communications.notifications.read',
  ],
  parent: [
    'auth.read',
    'students.read',
    'guardians.read',
    'attendance.records.read',
    'billing.invoices.read',
    'billing.payments.read',
    'homework.read',
    'communications.notifications.read',
    'communications.messages.read',
  ],
  accountant: [
    'auth.read',
    'schools.read',
    'students.read',
    'billing.feePlans.read',
    'billing.feePlans.write',
    'billing.invoices.read',
    'billing.invoices.write',
    'billing.payments.read',
    'billing.payments.write',
  ],
  transport_staff: [
    'auth.read',
    'schools.read',
    'students.read',
    'transport.vehicles.read',
    'transport.vehicles.write',
    'transport.routes.read',
    'transport.routes.write',
    'transport.stops.read',
    'transport.stops.write',
    'transport.assignments.read',
    'transport.assignments.write',
    'communications.notifications.read',
    'communications.messages.read',
  ],
  staff: ['auth.read', 'schools.read', 'staff.read', 'communications.notifications.read'],
};

const DEMO_USERS = [
  { email: 'superadmin@gps.local', firstName: 'Super', lastName: 'Admin' },
  { email: 'solo.admin@gps.local', firstName: 'Solo', lastName: 'Admin' },
  { email: 'solo.teacher1@gps.local', firstName: 'Anita', lastName: 'Sharma' },
  { email: 'solo.teacher2@gps.local', firstName: 'Rohit', lastName: 'Verma' },
  { email: 'solo.parent1@gps.local', firstName: 'Neha', lastName: 'Singh' },
  { email: 'solo.parent2@gps.local', firstName: 'Amit', lastName: 'Singh' },
  { email: 'solo.student@gps.local', firstName: 'Ria', lastName: 'Singh' },
  { email: 'solo.accountant@gps.local', firstName: 'Kiran', lastName: 'Mehta' },
  { email: 'solo.driver@gps.local', firstName: 'Mahesh', lastName: 'Yadav' },
  { email: 'solo.helper@gps.local', firstName: 'Suresh', lastName: 'Pal' },
  { email: 'solo.peon@gps.local', firstName: 'Ramesh', lastName: 'Kumar' },
  { email: 'multi.admin@gps.local', firstName: 'Multi', lastName: 'Admin' },
  { email: 'multi.schooladmin1@gps.local', firstName: 'School', lastName: 'AdminOne' },
  { email: 'multi.schooladmin2@gps.local', firstName: 'School', lastName: 'AdminTwo' },
  { email: 'multi.teacher1@gps.local', firstName: 'Pooja', lastName: 'Nair' },
  { email: 'multi.teacher2@gps.local', firstName: 'Sameer', lastName: 'Das' },
  { email: 'multi.parent1@gps.local', firstName: 'Ishita', lastName: 'Rao' },
  { email: 'multi.parent2@gps.local', firstName: 'Vikram', lastName: 'Rao' },
  { email: 'multi.student@gps.local', firstName: 'Arjun', lastName: 'Rao' },
  { email: 'multi.accountant@gps.local', firstName: 'Bhavna', lastName: 'Shah' },
  { email: 'multi.driver@gps.local', firstName: 'Rafiq', lastName: 'Ali' },
  { email: 'multi.helper@gps.local', firstName: 'Omkar', lastName: 'Jadhav' },
  { email: 'multi.peon@gps.local', firstName: 'Ganesh', lastName: 'Pawar' },
];

const DEMO_TENANTS = [
  {
    code: 'GPSSOLO',
    name: 'GPS Solo Tenant',
    schools: [
      {
        code: 'SOLO_MAIN',
        name: 'Solo Public School',
        board: 'CBSE',
        campuses: [{ code: 'MAIN', name: 'Main Campus', city: 'Noida', state: 'UP' }],
      },
    ],
    admins: ['solo.admin@gps.local'],
    schoolAdmins: [],
  },
  {
    code: 'GPSMULTI',
    name: 'GPS Multi Tenant',
    schools: [
      {
        code: 'MPS_NORTH',
        name: 'Metro Public School North',
        board: 'CBSE',
        campuses: [
          { code: 'MAIN', name: 'North Main Campus', city: 'Delhi', state: 'Delhi' },
          { code: 'EAST', name: 'North East Campus', city: 'Delhi', state: 'Delhi' },
        ],
      },
      {
        code: 'MPS_SOUTH',
        name: 'Metro Public School South',
        board: 'ICSE',
        campuses: [{ code: 'MAIN', name: 'South Campus', city: 'Gurugram', state: 'Haryana' }],
      },
    ],
    admins: ['multi.admin@gps.local'],
    schoolAdmins: [
      { email: 'multi.schooladmin1@gps.local', schoolCode: 'MPS_NORTH' },
      { email: 'multi.schooladmin2@gps.local', schoolCode: 'MPS_SOUTH' },
    ],
  },
];

function dateOnly(value) {
  return new Date(`${value}T00:00:00.000Z`);
}

function timeOnly(value) {
  return new Date(`1970-01-01T${value}:00.000Z`);
}

async function ensureUser(profile) {
  return prisma.user.upsert({
    where: { email: profile.email.toLowerCase() },
    update: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      status: UserStatus.ACTIVE,
      passwordHash: DEFAULT_PASSWORD_HASH,
    },
    create: {
      email: profile.email.toLowerCase(),
      firstName: profile.firstName,
      lastName: profile.lastName,
      status: UserStatus.ACTIVE,
      passwordHash: DEFAULT_PASSWORD_HASH,
    },
  });
}

async function ensurePermission(scope) {
  return prisma.permission.upsert({
    where: { key: scope },
    update: {
      name: scope,
      description: `Permission for ${scope}`,
      deletedAt: null,
      deletedById: null,
    },
    create: {
      key: scope,
      name: scope,
      description: `Permission for ${scope}`,
    },
  });
}

async function ensureRole(tenantId, roleKey) {
  return prisma.role.upsert({
    where: { tenantId_key: { tenantId, key: roleKey } },
    update: {
      name: roleKey,
      description: `${roleKey} role`,
      isSystem: true,
      deletedAt: null,
      deletedById: null,
    },
    create: {
      tenantId,
      key: roleKey,
      name: roleKey,
      description: `${roleKey} role`,
      isSystem: true,
    },
  });
}

async function ensureMembership(tenantId, userId) {
  return prisma.userTenant.upsert({
    where: { tenantId_userId: { tenantId, userId } },
    update: {
      status: MembershipStatus.ACTIVE,
      joinedAt: new Date(),
      deletedAt: null,
      deletedById: null,
    },
    create: {
      tenantId,
      userId,
      status: MembershipStatus.ACTIVE,
      joinedAt: new Date(),
    },
  });
}

async function ensureRoleAssignments(userTenantId, roleIds) {
  for (const roleId of roleIds) {
    await prisma.userRoleAssignment.upsert({
      where: { userTenantId_roleId: { userTenantId, roleId } },
      update: {
        deletedAt: null,
        deletedById: null,
      },
      create: {
        userTenantId,
        roleId,
      },
    });
  }
}

async function ensureSchool(tenantId, schoolInput) {
  return prisma.school.upsert({
    where: {
      tenantId_code: {
        tenantId,
        code: schoolInput.code,
      },
    },
    update: {
      name: schoolInput.name,
      board: schoolInput.board,
      contactEmail: `office@${schoolInput.code.toLowerCase()}.gps.local`,
      contactPhone: '+919999000000',
      deletedAt: null,
      deletedById: null,
    },
    create: {
      tenantId,
      code: schoolInput.code,
      name: schoolInput.name,
      board: schoolInput.board,
      contactEmail: `office@${schoolInput.code.toLowerCase()}.gps.local`,
      contactPhone: '+919999000000',
    },
  });
}

async function ensureCampus(tenantId, school, campusInput) {
  return prisma.campus.upsert({
    where: {
      schoolId_code: {
        schoolId: school.id,
        code: campusInput.code,
      },
    },
    update: {
      name: campusInput.name,
      city: campusInput.city,
      state: campusInput.state,
      addressLine1: `${campusInput.name} Road`,
      postalCode: '110001',
      deletedAt: null,
      deletedById: null,
    },
    create: {
      tenantId,
      schoolId: school.id,
      code: campusInput.code,
      name: campusInput.name,
      city: campusInput.city,
      state: campusInput.state,
      addressLine1: `${campusInput.name} Road`,
      postalCode: '110001',
    },
  });
}

async function ensureAcademicYear(tenantId, schoolId, name, startsOn, endsOn, isCurrent) {
  await prisma.academicYear.updateMany({
    where: { schoolId, isCurrent: true, name: { not: name } },
    data: { isCurrent: false },
  });

  return prisma.academicYear.upsert({
    where: { schoolId_name: { schoolId, name } },
    update: {
      startsOn,
      endsOn,
      isCurrent,
      deletedAt: null,
      deletedById: null,
    },
    create: {
      tenantId,
      schoolId,
      name,
      startsOn,
      endsOn,
      isCurrent,
    },
  });
}

async function ensureTerm(tenantId, schoolId, academicYearId, name, startsOn, endsOn) {
  return prisma.term.upsert({
    where: { academicYearId_name: { academicYearId, name } },
    update: {
      startsOn,
      endsOn,
      deletedAt: null,
      deletedById: null,
    },
    create: {
      tenantId,
      schoolId,
      academicYearId,
      name,
      startsOn,
      endsOn,
    },
  });
}

async function ensureStaffProfile(input) {
  const existing = await prisma.staffProfile.findFirst({
    where: {
      schoolId: input.schoolId,
      userId: input.userId,
    },
  });

  if (existing) {
    return prisma.staffProfile.update({
      where: { id: existing.id },
      data: {
        tenantId: input.tenantId,
        campusId: input.campusId,
        employeeCode: input.employeeCode,
        designation: input.designation,
        employmentType: input.employmentType,
        joinedOn: input.joinedOn,
        deletedAt: null,
        deletedById: null,
      },
    });
  }

  return prisma.staffProfile.create({
    data: input,
  });
}

async function ensureTeacherProfile(tenantId, staffProfileId, specialization) {
  return prisma.teacherProfile.upsert({
    where: { staffProfileId },
    update: {
      tenantId,
      specialization,
      experienceYears: 5,
      deletedAt: null,
      deletedById: null,
    },
    create: {
      tenantId,
      staffProfileId,
      specialization,
      experienceYears: 5,
    },
  });
}

async function ensureSubject(tenantId, schoolId, code, name) {
  return prisma.subject.upsert({
    where: { schoolId_code: { schoolId, code } },
    update: {
      tenantId,
      name,
      deletedAt: null,
      deletedById: null,
    },
    create: {
      tenantId,
      schoolId,
      code,
      name,
    },
  });
}

async function ensureClassRoom(input) {
  return prisma.classRoom.upsert({
    where: { academicYearId_name: { academicYearId: input.academicYearId, name: input.name } },
    update: {
      campusId: input.campusId,
      gradeLevel: input.gradeLevel,
      section: input.section,
      capacity: input.capacity,
      homeRoomTeacherId: input.homeRoomTeacherId,
      deletedAt: null,
      deletedById: null,
    },
    create: input,
  });
}

async function ensureClassroomSubject(tenantId, classRoomId, subjectId, teacherId) {
  return prisma.classroomSubject.upsert({
    where: { classRoomId_subjectId: { classRoomId, subjectId } },
    update: {
      tenantId,
      teacherId,
      deletedAt: null,
      deletedById: null,
    },
    create: {
      tenantId,
      classRoomId,
      subjectId,
      teacherId,
    },
  });
}

async function ensureGuardian(input) {
  const existing = await prisma.guardian.findFirst({
    where: {
      schoolId: input.schoolId,
      userId: input.userId,
    },
  });

  if (existing) {
    return prisma.guardian.update({
      where: { id: existing.id },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        phoneE164: input.phoneE164,
        email: input.email,
        relationNote: input.relationNote,
        deletedAt: null,
        deletedById: null,
      },
    });
  }

  return prisma.guardian.create({ data: input });
}

async function ensureStudent(input) {
  return prisma.student.upsert({
    where: { schoolId_admissionNo: { schoolId: input.schoolId, admissionNo: input.admissionNo } },
    update: {
      firstName: input.firstName,
      lastName: input.lastName,
      gender: input.gender,
      campusId: input.campusId,
      joinedOn: input.joinedOn,
      currentStatus: EnrollmentStatus.ACTIVE,
      deletedAt: null,
      deletedById: null,
    },
    create: input,
  });
}

async function ensureEnrollment(tenantId, studentId, classRoomId, academicYearId, enrolledOn) {
  return prisma.enrollment.upsert({
    where: { studentId_academicYearId: { studentId, academicYearId } },
    update: {
      classRoomId,
      status: EnrollmentStatus.ACTIVE,
      enrolledOn,
      leftOn: null,
      deletedAt: null,
      deletedById: null,
    },
    create: {
      tenantId,
      studentId,
      classRoomId,
      academicYearId,
      enrolledOn,
      status: EnrollmentStatus.ACTIVE,
    },
  });
}

async function ensureTimetable(input) {
  const existing = await prisma.timetableEntry.findFirst({
    where: {
      classRoomId: input.classRoomId,
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
    },
  });

  if (existing) {
    return prisma.timetableEntry.update({
      where: { id: existing.id },
      data: {
        subjectId: input.subjectId,
        teacherId: input.teacherId,
        endTime: input.endTime,
        location: input.location,
        deletedAt: null,
        deletedById: null,
      },
    });
  }

  return prisma.timetableEntry.create({ data: input });
}

async function ensureTransportVehicle(tenantId, schoolId, vehicleNumber) {
  return prisma.transportVehicle.upsert({
    where: { schoolId_vehicleNumber: { schoolId, vehicleNumber } },
    update: {
      tenantId,
      vehicleType: 'BUS',
      capacity: 40,
      deletedAt: null,
      deletedById: null,
    },
    create: {
      tenantId,
      schoolId,
      vehicleNumber,
      vehicleType: 'BUS',
      capacity: 40,
    },
  });
}

async function ensureTransportRoute(tenantId, schoolId, code, name, vehicleId) {
  return prisma.transportRoute.upsert({
    where: { schoolId_code: { schoolId, code } },
    update: {
      tenantId,
      name,
      vehicleId,
      deletedAt: null,
      deletedById: null,
    },
    create: {
      tenantId,
      schoolId,
      code,
      name,
      vehicleId,
    },
  });
}

async function ensureTransportStop(tenantId, routeId, sequenceNo, name) {
  return prisma.transportStop.upsert({
    where: { routeId_sequenceNo: { routeId, sequenceNo } },
    update: {
      tenantId,
      name,
      deletedAt: null,
      deletedById: null,
    },
    create: {
      tenantId,
      routeId,
      sequenceNo,
      name,
    },
  });
}

async function ensureFeeData(tenantId, schoolId, academicYearId, studentIds) {
  const feePlan = await prisma.feePlan.upsert({
    where: { schoolId_academicYearId_name: { schoolId, academicYearId, name: 'Standard Fee Plan' } },
    update: {
      currencyCode: 'INR',
      isActive: true,
      deletedAt: null,
      deletedById: null,
    },
    create: {
      tenantId,
      schoolId,
      academicYearId,
      name: 'Standard Fee Plan',
      currencyCode: 'INR',
      isActive: true,
    },
  });

  const tuition = await prisma.feeItem.upsert({
    where: { feePlanId_code: { feePlanId: feePlan.id, code: 'TUITION' } },
    update: {
      name: 'Tuition Fee',
      amount: new Prisma.Decimal('22000.00'),
      meta: { period: 'quarterly' },
      deletedAt: null,
      deletedById: null,
    },
    create: {
      tenantId,
      feePlanId: feePlan.id,
      code: 'TUITION',
      name: 'Tuition Fee',
      amount: new Prisma.Decimal('22000.00'),
      meta: { period: 'quarterly' },
    },
  });

  const transport = await prisma.feeItem.upsert({
    where: { feePlanId_code: { feePlanId: feePlan.id, code: 'TRANSPORT' } },
    update: {
      name: 'Transport Fee',
      amount: new Prisma.Decimal('5000.00'),
      meta: { period: 'quarterly' },
      deletedAt: null,
      deletedById: null,
    },
    create: {
      tenantId,
      feePlanId: feePlan.id,
      code: 'TRANSPORT',
      name: 'Transport Fee',
      amount: new Prisma.Decimal('5000.00'),
      meta: { period: 'quarterly' },
    },
  });

  const targetStudentId = studentIds[0];
  if (!targetStudentId) return;

  await prisma.studentFeePlan.upsert({
    where: { studentId_feePlanId: { studentId: targetStudentId, feePlanId: feePlan.id } },
    update: {
      deletedAt: null,
      deletedById: null,
    },
    create: {
      tenantId,
      studentId: targetStudentId,
      feePlanId: feePlan.id,
    },
  });

  const invoice = await prisma.invoice.upsert({
    where: { schoolId_invoiceNumber: { schoolId, invoiceNumber: `${schoolId.slice(0, 6)}-INV-0001` } },
    update: {
      status: 'ISSUED',
      subTotal: new Prisma.Decimal('27000.00'),
      totalAmount: new Prisma.Decimal('27000.00'),
      balanceAmount: new Prisma.Decimal('17000.00'),
      deletedAt: null,
      deletedById: null,
    },
    create: {
      tenantId,
      schoolId,
      studentId: targetStudentId,
      invoiceNumber: `${schoolId.slice(0, 6)}-INV-0001`,
      issueDate: dateOnly('2026-04-05'),
      dueDate: dateOnly('2026-04-20'),
      status: 'ISSUED',
      subTotal: new Prisma.Decimal('27000.00'),
      taxAmount: new Prisma.Decimal('0.00'),
      totalAmount: new Prisma.Decimal('27000.00'),
      balanceAmount: new Prisma.Decimal('17000.00'),
      currencyCode: 'INR',
    },
  });

  await prisma.invoiceLine.deleteMany({ where: { invoiceId: invoice.id } });
  await prisma.invoiceLine.createMany({
    data: [
      {
        tenantId,
        invoiceId: invoice.id,
        feeItemId: tuition.id,
        description: 'Tuition Fee',
        quantity: 1,
        unitAmount: new Prisma.Decimal('22000.00'),
        lineTotal: new Prisma.Decimal('22000.00'),
      },
      {
        tenantId,
        invoiceId: invoice.id,
        feeItemId: transport.id,
        description: 'Transport Fee',
        quantity: 1,
        unitAmount: new Prisma.Decimal('5000.00'),
        lineTotal: new Prisma.Decimal('5000.00'),
      },
    ],
  });

  const payment = await prisma.payment.upsert({
    where: { schoolId_receiptNumber: { schoolId, receiptNumber: `${schoolId.slice(0, 6)}-RCPT-0001` } },
    update: {
      amount: new Prisma.Decimal('10000.00'),
      method: PaymentMethod.UPI,
      status: PaymentStatus.COMPLETED,
      deletedAt: null,
      deletedById: null,
    },
    create: {
      tenantId,
      schoolId,
      studentId: targetStudentId,
      receiptNumber: `${schoolId.slice(0, 6)}-RCPT-0001`,
      paidAt: new Date('2026-04-10T10:00:00.000Z'),
      amount: new Prisma.Decimal('10000.00'),
      method: PaymentMethod.UPI,
      status: PaymentStatus.COMPLETED,
    },
  });

  await prisma.paymentAllocation.upsert({
    where: { paymentId_invoiceId: { paymentId: payment.id, invoiceId: invoice.id } },
    update: {
      amount: new Prisma.Decimal('10000.00'),
      deletedAt: null,
      deletedById: null,
    },
    create: {
      tenantId,
      paymentId: payment.id,
      invoiceId: invoice.id,
      amount: new Prisma.Decimal('10000.00'),
    },
  });
}

async function tableExists(tableName) {
  const rows = await prisma.$queryRawUnsafe(
    'SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = $1 AND table_name = $2) AS "exists"',
    'public',
    tableName,
  );
  return Boolean(rows?.[0]?.exists);
}

async function seedTenantData(tenant, usersByEmail, rolesByTenantAndKey) {
  const tenantRow = await prisma.tenant.upsert({
    where: { code: tenant.code },
    update: {
      name: tenant.name,
      status: TenantStatus.ACTIVE,
      deletedAt: null,
      deletedById: null,
    },
    create: {
      code: tenant.code,
      name: tenant.name,
      status: TenantStatus.ACTIVE,
      timeZone: 'Asia/Kolkata',
      countryCode: 'IN',
    },
  });

  const schoolRows = [];
  for (const school of tenant.schools) {
    const schoolRow = await ensureSchool(tenantRow.id, school);
    schoolRows.push(schoolRow);
    for (const campus of school.campuses) {
      await ensureCampus(tenantRow.id, schoolRow, campus);
    }
  }

  const ay = new Map();
  for (const school of schoolRows) {
    const year = await ensureAcademicYear(
      tenantRow.id,
      school.id,
      '2026-2027',
      dateOnly('2026-04-01'),
      dateOnly('2027-03-31'),
      true,
    );
    ay.set(school.id, year);
    await ensureTerm(tenantRow.id, school.id, year.id, 'Term 1', dateOnly('2026-04-01'), dateOnly('2026-09-30'));
    await ensureTerm(tenantRow.id, school.id, year.id, 'Term 2', dateOnly('2026-10-01'), dateOnly('2027-03-31'));
  }

  const superAdminMembership = await ensureMembership(tenantRow.id, usersByEmail.get('superadmin@gps.local').id);
  await ensureRoleAssignments(superAdminMembership.id, [rolesByTenantAndKey.get(`${tenantRow.id}:super_admin`).id]);

  for (const adminEmail of tenant.admins) {
    const membership = await ensureMembership(tenantRow.id, usersByEmail.get(adminEmail).id);
    await ensureRoleAssignments(membership.id, [
      rolesByTenantAndKey.get(`${tenantRow.id}:admin`).id,
      rolesByTenantAndKey.get(`${tenantRow.id}:tenant_admin`).id,
    ]);
  }

  const defaultSchool = schoolRows[0];
  const defaultCampus = await prisma.campus.findFirst({
    where: { schoolId: defaultSchool.id, deletedAt: null },
    orderBy: [{ name: 'asc' }],
  });

  const schoolPrefix = tenant.code.toLowerCase().includes('solo') ? 'solo' : 'multi';
  const teacherUser1 = usersByEmail.get(`${schoolPrefix}.teacher1@gps.local`);
  const teacherUser2 = usersByEmail.get(`${schoolPrefix}.teacher2@gps.local`);
  const accountantUser = usersByEmail.get(`${schoolPrefix}.accountant@gps.local`);
  const driverUser = usersByEmail.get(`${schoolPrefix}.driver@gps.local`);
  const helperUser = usersByEmail.get(`${schoolPrefix}.helper@gps.local`);
  const peonUser = usersByEmail.get(`${schoolPrefix}.peon@gps.local`);
  const parent1User = usersByEmail.get(`${schoolPrefix}.parent1@gps.local`);
  const parent2User = usersByEmail.get(`${schoolPrefix}.parent2@gps.local`);
  const studentUser = usersByEmail.get(`${schoolPrefix}.student@gps.local`);

  const teacherMembership1 = await ensureMembership(tenantRow.id, teacherUser1.id);
  const teacherMembership2 = await ensureMembership(tenantRow.id, teacherUser2.id);
  const accountantMembership = await ensureMembership(tenantRow.id, accountantUser.id);
  const driverMembership = await ensureMembership(tenantRow.id, driverUser.id);
  const helperMembership = await ensureMembership(tenantRow.id, helperUser.id);
  const peonMembership = await ensureMembership(tenantRow.id, peonUser.id);
  const parentMembership1 = await ensureMembership(tenantRow.id, parent1User.id);
  const parentMembership2 = await ensureMembership(tenantRow.id, parent2User.id);
  const studentMembership = await ensureMembership(tenantRow.id, studentUser.id);

  await ensureRoleAssignments(teacherMembership1.id, [rolesByTenantAndKey.get(`${tenantRow.id}:teacher`).id]);
  await ensureRoleAssignments(teacherMembership2.id, [rolesByTenantAndKey.get(`${tenantRow.id}:teacher`).id]);
  await ensureRoleAssignments(accountantMembership.id, [rolesByTenantAndKey.get(`${tenantRow.id}:accountant`).id]);
  await ensureRoleAssignments(driverMembership.id, [rolesByTenantAndKey.get(`${tenantRow.id}:transport_staff`).id]);
  await ensureRoleAssignments(helperMembership.id, [rolesByTenantAndKey.get(`${tenantRow.id}:transport_staff`).id]);
  await ensureRoleAssignments(peonMembership.id, [rolesByTenantAndKey.get(`${tenantRow.id}:staff`).id]);
  await ensureRoleAssignments(parentMembership1.id, [rolesByTenantAndKey.get(`${tenantRow.id}:parent`).id]);
  await ensureRoleAssignments(parentMembership2.id, [rolesByTenantAndKey.get(`${tenantRow.id}:parent`).id]);
  await ensureRoleAssignments(studentMembership.id, [rolesByTenantAndKey.get(`${tenantRow.id}:student`).id]);

  const teacherStaff1 = await ensureStaffProfile({
    tenantId: tenantRow.id,
    schoolId: defaultSchool.id,
    campusId: defaultCampus?.id ?? null,
    userId: teacherUser1.id,
    employeeCode: `${defaultSchool.code}-T001`,
    designation: 'Teacher',
    employmentType: 'FULL_TIME',
    joinedOn: dateOnly('2022-06-01'),
  });
  const teacherStaff2 = await ensureStaffProfile({
    tenantId: tenantRow.id,
    schoolId: defaultSchool.id,
    campusId: defaultCampus?.id ?? null,
    userId: teacherUser2.id,
    employeeCode: `${defaultSchool.code}-T002`,
    designation: 'Teacher',
    employmentType: 'FULL_TIME',
    joinedOn: dateOnly('2023-06-01'),
  });

  const driverStaff = await ensureStaffProfile({
    tenantId: tenantRow.id,
    schoolId: defaultSchool.id,
    campusId: defaultCampus?.id ?? null,
    userId: driverUser.id,
    employeeCode: `${defaultSchool.code}-DRV001`,
    designation: 'Driver',
    employmentType: 'CONTRACT',
    joinedOn: dateOnly('2021-01-10'),
  });
  await ensureStaffProfile({
    tenantId: tenantRow.id,
    schoolId: defaultSchool.id,
    campusId: defaultCampus?.id ?? null,
    userId: helperUser.id,
    employeeCode: `${defaultSchool.code}-HLP001`,
    designation: 'Bus Helper',
    employmentType: 'CONTRACT',
    joinedOn: dateOnly('2021-01-10'),
  });
  await ensureStaffProfile({
    tenantId: tenantRow.id,
    schoolId: defaultSchool.id,
    campusId: defaultCampus?.id ?? null,
    userId: peonUser.id,
    employeeCode: `${defaultSchool.code}-PEO001`,
    designation: 'Peon',
    employmentType: 'FULL_TIME',
    joinedOn: dateOnly('2020-04-01'),
  });
  await ensureStaffProfile({
    tenantId: tenantRow.id,
    schoolId: defaultSchool.id,
    campusId: defaultCampus?.id ?? null,
    userId: accountantUser.id,
    employeeCode: `${defaultSchool.code}-ACC001`,
    designation: 'Accountant',
    employmentType: 'FULL_TIME',
    joinedOn: dateOnly('2020-04-01'),
  });

  const teacher1 = await ensureTeacherProfile(tenantRow.id, teacherStaff1.id, 'Mathematics');
  const teacher2 = await ensureTeacherProfile(tenantRow.id, teacherStaff2.id, 'Science');

  const math = await ensureSubject(tenantRow.id, defaultSchool.id, 'MATH', 'Mathematics');
  const sci = await ensureSubject(tenantRow.id, defaultSchool.id, 'SCI', 'Science');
  const eng = await ensureSubject(tenantRow.id, defaultSchool.id, 'ENG', 'English');

  const currentYear = ay.get(defaultSchool.id);
  const class5A = await ensureClassRoom({
    tenantId: tenantRow.id,
    schoolId: defaultSchool.id,
    campusId: defaultCampus?.id ?? null,
    academicYearId: currentYear.id,
    name: 'Grade 5A',
    gradeLevel: '5',
    section: 'A',
    capacity: 35,
    homeRoomTeacherId: teacher1.id,
  });
  const class6A = await ensureClassRoom({
    tenantId: tenantRow.id,
    schoolId: defaultSchool.id,
    campusId: defaultCampus?.id ?? null,
    academicYearId: currentYear.id,
    name: 'Grade 6A',
    gradeLevel: '6',
    section: 'A',
    capacity: 35,
    homeRoomTeacherId: teacher2.id,
  });

  await ensureClassroomSubject(tenantRow.id, class5A.id, math.id, teacher1.id);
  await ensureClassroomSubject(tenantRow.id, class5A.id, sci.id, teacher2.id);
  await ensureClassroomSubject(tenantRow.id, class5A.id, eng.id, teacher1.id);
  await ensureClassroomSubject(tenantRow.id, class6A.id, math.id, teacher1.id);
  await ensureClassroomSubject(tenantRow.id, class6A.id, sci.id, teacher2.id);
  await ensureClassroomSubject(tenantRow.id, class6A.id, eng.id, teacher2.id);

  const guardian1 = await ensureGuardian({
    tenantId: tenantRow.id,
    schoolId: defaultSchool.id,
    userId: parent1User.id,
    firstName: parent1User.firstName,
    lastName: parent1User.lastName,
    phoneE164: '+919800000001',
    email: parent1User.email,
    relationNote: 'Primary Guardian',
  });
  const guardian2 = await ensureGuardian({
    tenantId: tenantRow.id,
    schoolId: defaultSchool.id,
    userId: parent2User.id,
    firstName: parent2User.firstName,
    lastName: parent2User.lastName,
    phoneE164: '+919800000002',
    email: parent2User.email,
    relationNote: 'Secondary Guardian',
  });

  const students = [];
  for (let i = 1; i <= 8; i += 1) {
    const admissionNo = `${defaultSchool.code}-STU${String(i).padStart(3, '0')}`;
    const student = await ensureStudent({
      tenantId: tenantRow.id,
      schoolId: defaultSchool.id,
      campusId: defaultCampus?.id ?? null,
      admissionNo,
      firstName: `Student${i}`,
      lastName: schoolPrefix.toUpperCase(),
      dateOfBirth: dateOnly(`2014-0${(i % 9) + 1}-10`),
      gender: i % 2 === 0 ? Gender.FEMALE : Gender.MALE,
      joinedOn: dateOnly('2026-04-01'),
      currentStatus: EnrollmentStatus.ACTIVE,
    });
    students.push(student);
    await ensureEnrollment(
      tenantRow.id,
      student.id,
      i <= 4 ? class5A.id : class6A.id,
      currentYear.id,
      dateOnly('2026-04-01'),
    );
    await prisma.studentGuardian.upsert({
      where: {
        studentId_guardianId: {
          studentId: student.id,
          guardianId: i <= 4 ? guardian1.id : guardian2.id,
        },
      },
      update: {
        relationType: 'PARENT',
        isPrimary: true,
        deletedAt: null,
        deletedById: null,
      },
      create: {
        tenantId: tenantRow.id,
        studentId: student.id,
        guardianId: i <= 4 ? guardian1.id : guardian2.id,
        relationType: 'PARENT',
        isPrimary: true,
      },
    });
  }

  const attendanceSession = await prisma.attendanceSession.create({
    data: {
      tenantId: tenantRow.id,
      classRoomId: class5A.id,
      subjectId: math.id,
      periodNo: 1,
      attendanceOn: dateOnly('2026-04-15'),
      markedByStaffId: teacherStaff1.id,
    },
  });
  for (const student of students.slice(0, 4)) {
    await prisma.attendanceRecord.upsert({
      where: {
        attendanceSessionId_studentId: {
          attendanceSessionId: attendanceSession.id,
          studentId: student.id,
        },
      },
      update: {
        status: AttendanceStatus.PRESENT,
        remarks: null,
      },
      create: {
        tenantId: tenantRow.id,
        attendanceSessionId: attendanceSession.id,
        studentId: student.id,
        status: AttendanceStatus.PRESENT,
      },
    });
  }

  await ensureTimetable({
    tenantId: tenantRow.id,
    schoolId: defaultSchool.id,
    classRoomId: class5A.id,
    subjectId: math.id,
    teacherId: teacher1.id,
    dayOfWeek: 1,
    startTime: timeOnly('09:00'),
    endTime: timeOnly('09:45'),
    location: 'Room 101',
  });
  await ensureTimetable({
    tenantId: tenantRow.id,
    schoolId: defaultSchool.id,
    classRoomId: class5A.id,
    subjectId: sci.id,
    teacherId: teacher2.id,
    dayOfWeek: 1,
    startTime: timeOnly('10:00'),
    endTime: timeOnly('10:45'),
    location: 'Lab 1',
  });

  const vehicle = await ensureTransportVehicle(tenantRow.id, defaultSchool.id, `${defaultSchool.code}-BUS-01`);
  const route = await ensureTransportRoute(tenantRow.id, defaultSchool.id, 'R1', 'Route 1', vehicle.id);
  const stop1 = await ensureTransportStop(tenantRow.id, route.id, 1, 'Sector 10');
  await ensureTransportStop(tenantRow.id, route.id, 2, 'Sector 14');
  for (const student of students.slice(0, 3)) {
    await prisma.studentTransportAssignment.upsert({
      where: {
        studentId_academicYearId: {
          studentId: student.id,
          academicYearId: currentYear.id,
        },
      },
      update: {
        routeId: route.id,
        stopId: stop1.id,
        startsOn: dateOnly('2026-04-01'),
        endsOn: null,
        deletedAt: null,
        deletedById: null,
      },
      create: {
        tenantId: tenantRow.id,
        studentId: student.id,
        routeId: route.id,
        stopId: stop1.id,
        academicYearId: currentYear.id,
        startsOn: dateOnly('2026-04-01'),
      },
    });
  }

  await ensureFeeData(tenantRow.id, defaultSchool.id, currentYear.id, students.map((s) => s.id));

  const hasSchoolAssignmentsTable = await tableExists('user_tenant_school_assignments');
  if (hasSchoolAssignmentsTable && tenant.schoolAdmins.length > 0) {
    for (const assignment of tenant.schoolAdmins) {
      const user = usersByEmail.get(assignment.email);
      const membership = await ensureMembership(tenantRow.id, user.id);
      await ensureRoleAssignments(membership.id, [rolesByTenantAndKey.get(`${tenantRow.id}:school_admin`).id]);
      const targetSchool = schoolRows.find((school) => school.code === assignment.schoolCode);
      if (targetSchool) {
        await prisma.userTenantSchoolAssignment.upsert({
          where: {
            userTenantId_schoolId: {
              userTenantId: membership.id,
              schoolId: targetSchool.id,
            },
          },
          update: {
            canManageAllCampuses: true,
            deletedAt: null,
            deletedById: null,
          },
          create: {
            tenantId: tenantRow.id,
            userTenantId: membership.id,
            schoolId: targetSchool.id,
            canManageAllCampuses: true,
          },
        });
      }
    }
  }

  if (driverStaff?.id) {
    await prisma.teacherAttendance.upsert({
      where: {
        teacherId_attendanceOn: {
          teacherId: teacher1.id,
          attendanceOn: dateOnly('2026-04-15'),
        },
      },
      update: {
        tenantId: tenantRow.id,
        schoolId: defaultSchool.id,
        status: AttendanceStatus.PRESENT,
        deletedAt: null,
        deletedById: null,
      },
      create: {
        tenantId: tenantRow.id,
        schoolId: defaultSchool.id,
        teacherId: teacher1.id,
        attendanceOn: dateOnly('2026-04-15'),
        status: AttendanceStatus.PRESENT,
      },
    });
  }
}

async function main() {
  const usersByEmail = new Map();
  for (const user of DEMO_USERS) {
    const row = await ensureUser(user);
    usersByEmail.set(user.email, row);
  }

  for (const scope of ALL_SCOPES) {
    await ensurePermission(scope);
  }

  const permissions = await prisma.permission.findMany({
    where: {
      key: { in: ALL_SCOPES },
      deletedAt: null,
    },
  });
  const permissionByKey = new Map(permissions.map((permission) => [permission.key, permission]));

  const rolesByTenantAndKey = new Map();
  for (const tenantInput of DEMO_TENANTS) {
    const tenant = await prisma.tenant.upsert({
      where: { code: tenantInput.code },
      update: {
        name: tenantInput.name,
        status: TenantStatus.ACTIVE,
        deletedAt: null,
        deletedById: null,
      },
      create: {
        code: tenantInput.code,
        name: tenantInput.name,
        status: TenantStatus.ACTIVE,
        timeZone: 'Asia/Kolkata',
        countryCode: 'IN',
      },
    });

    for (const [roleKey, scopes] of Object.entries(ROLE_SCOPE_MAP)) {
      const role = await ensureRole(tenant.id, roleKey);
      rolesByTenantAndKey.set(`${tenant.id}:${roleKey}`, role);

      const permissionIds = scopes
        .map((scope) => permissionByKey.get(scope))
        .filter(Boolean)
        .map((permission) => permission.id);

      await prisma.rolePermission.deleteMany({
        where: {
          roleId: role.id,
          permissionId: { notIn: permissionIds },
        },
      });

      for (const permissionId of permissionIds) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId,
            },
          },
          update: {
            deletedAt: null,
            deletedById: null,
          },
          create: {
            roleId: role.id,
            permissionId,
          },
        });
      }
    }
  }

  for (const tenant of DEMO_TENANTS) {
    await seedTenantData(tenant, usersByEmail, rolesByTenantAndKey);
  }

  const creds = DEMO_USERS.map((user) => `${user.email} / ${DEFAULT_PASSWORD}`);
  console.log('Seed complete.');
  console.log('Demo tenants: GPSSOLO, GPSMULTI');
  console.log('Default password for all users:', DEFAULT_PASSWORD);
  console.log('Credentials:');
  for (const line of creds) {
    console.log(`- ${line}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
