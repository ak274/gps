# GPS SaaS Product Blueprint

## Product definition

GPS is a multi-tenant school operations platform. It helps a Super Admin provision institutions, helps school teams bring in and organize their existing data, and gives each school a natural operating workspace for academics, people, finance, communication and compliance.

GPS is not a collection of CRUD screens. It uses workflows where people need coordination, review, approval or progress tracking, and fast operational tools for repeatable daily work.

## Operating hierarchy

```text
GPS Platform
└── Super Admin
    └── Institution / Organization
        └── School
            └── Campus
                └── Academic Year
                    ├── Classes and Sections
                    ├── Staff and Teachers
                    ├── Students and Guardians
                    └── Academic and Operational Records
```

The current Prisma model already supports the important foundation: tenants, schools, campuses, memberships, school assignments, roles, academic years, staff, students, guardians, classrooms and enrollments.

## Role model

| Role | Scope | Primary outcome |
| --- | --- | --- |
| Super Admin | Entire GPS platform | Provision and support institutions and schools |
| School Admin | One or more schools | Make the school operational and manage its configuration |
| Campus Admin | Assigned campus | Run campus-level operations |
| Academic Admin | School or campus | Maintain academic structure and assignments |
| HR / Staff Admin | School or campus | Onboard and maintain staff |
| Admission Staff | School or campus | Process applicants and enroll students |
| Accountant | School or campus | Configure fees and collect payments |
| Teacher | Assigned classes and sections | Run teaching and classroom activities |
| Parent / Guardian | Linked students | Follow children and act on school communication |
| Student | Own academic scope | Access assigned learning and school information |

Authorization must combine role with scope. A role alone is not enough; access is constrained by platform, institution, school, campus, class or individual-student scope.

## Product north star

### School readiness

The first product outcome is:

> A Super Admin creates a school, the school team imports and organizes its data, and GPS guides the team until the school is ready to operate.

The school readiness state is based on meaningful operational prerequisites rather than record counts:

- School profile and campus configuration complete
- Academic year and terms configured
- Classes, sections and subjects configured
- Staff invited and assigned
- Students and guardians imported or enrolled
- Teachers linked to classes and subjects
- Fee structure configured when required
- Attendance setup ready
- Required compliance documents available

## Core workflows

### 1. Platform school provisioning

Owner: Super Admin

```text
Create institution or select existing institution
→ Create basic school account
→ Create initial campus
→ Assign school administrator
→ Send invitation
→ Track provisioning status
```

The Super Admin creates only the minimum viable account. The school team owns the operational setup.

### 2. School readiness onboarding

Owner: School Admin

```text
School profile
→ Campuses
→ Academic year and terms
→ Classes, sections and subjects
→ Staff and teacher setup
→ Student and guardian data
→ Fees and attendance readiness
→ Launch review
```

This is a guided checklist with progress, ownership, outstanding actions and a final readiness state. It is not a forced wizard: administrators can move between areas and complete work in the order that fits their school.

### 3. Bulk data import

Owner: School Admin or delegated staff

```text
Upload CSV or Excel
→ Detect columns
→ Map source fields to GPS fields
→ Preview transformed records
→ Validate errors and duplicates
→ Correct or download error report
→ Run import
→ Review results and history
```

The import engine must support saved mapping templates, dry runs, relationship mapping, partial success, error correction, import history and auditability. The school should be able to bring data in its existing format rather than prepare it manually for GPS.

Initial import types:

- Staff and teachers
- Students
- Guardians and student relationships
- Classes and sections
- Subjects and teacher assignments
- Fee plans
- Transport records

### 4. Staff onboarding

Owner: School Admin or HR / Staff Admin

- Invite staff individually or in bulk
- Import existing staff
- Assign role, school and campus scope
- Collect profile and employment information
- Upload required documents
- Assign teachers to subjects, classes and sections
- Track pending invitations and incomplete records

### 5. Student admission and enrollment

Owner: Admission Staff

This is a stateful workflow because it involves review, documents, decisions and enrollment. Student records should not be treated as complete merely because a row exists.

### 6. Daily operations

Attendance, payment recording, homework, routine announcements and directory updates should remain fast operational tools. They can expose attention queues and history without becoming long multi-step workflows.

## Product areas

1. Platform Administration
2. School Command Center
3. People: staff, teachers, students and guardians
4. Academic Operations
5. Admissions and Student Lifecycle
6. Finance and Fee Collection
7. Communication
8. Documents and Compliance
9. Reports and Insights

Every area should expose an overview, attention items, primary records, actions, history and relevant reports. The shared shell should make the current institution, school and campus context obvious.

## School command center

The dashboard should answer “what needs attention?” rather than only display totals.

Examples:

- 18 students are missing guardian information
- 4 staff invitations are pending
- 2 teachers have not completed their profiles
- 3 sections have no assigned class teacher
- Attendance is incomplete for one campus
- 6 certificates expire this month
- An import contains 11 records requiring review

Important health indicators include onboarding completion, data completeness, attendance completion, fee collection status, pending admissions, expiring documents, unresolved import errors and active users by role.

## Boundaries: workflow versus operational tool

Use a workflow when the feature includes ownership, state transitions, review, approval, due dates, notifications or an important audit trail.

Use an operational tool when the action is frequent, low-risk and naturally completed in one focused interaction.

| Workflow-driven | Operational |
| --- | --- |
| School provisioning | Taking attendance |
| School onboarding | Recording a payment |
| Staff onboarding | Adding homework |
| Bulk import | Updating a phone number |
| Admissions | Searching students |
| Promotion and exit | Viewing a timetable |
| Document renewal | Sending a routine notice |

## First implementation slice

The first vertical slice should connect these existing foundations:

1. Super Admin school and campus visibility
2. Basic school provisioning and school-admin assignment
3. School readiness summary endpoint
4. Portal readiness dashboard with actionable setup items
5. Import capability contract and first staff/student import flow

Before adding more feature pages, the portal should make the organization, school and campus context explicit and the API should expose readiness as a product concept rather than deriving it only in browser local storage.

## Product quality rules

- No important state should exist only in local storage.
- Every import must be previewable before it changes school data.
- Every role must see only its permitted scope.
- Every important workflow must have an owner, state and history.
- Daily actions should be quick and low-friction.
- Empty states should explain the next useful action.
- Dashboards should surface decisions and exceptions, not just counts.
- Destructive changes require confirmation and audit history.
- School administrators remain in control of their data and setup sequence.

