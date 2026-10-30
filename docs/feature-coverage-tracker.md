# GPS School Management SaaS — Feature Index

Last audited: 2026-10-30

This is the roll-up index for the feature catalogue. Each feature has its own living specification file under [docs/features](/Users/ankush.kalia/projects/gps/docs/features). Update the individual file when that feature moves forward; update this index only when the roll-up status changes.

## Status contract

- **Implemented** — usable vertical slice exists and is connected to relevant records.
- **Partial** — foundation exists but workflow, permissions, integrations, form detail or E2E coverage is incomplete.
- **Planned** — captured and ready for discovery/implementation.
- **Blocked** — waiting on an external decision, provider or infrastructure capability.

## Roll-up

- 165 catalogue features imported from the research review.
- 50 initially marked Implemented.
- 38 initially marked Partial.
- 77 initially marked Planned.
- No feature is considered complete merely because a model or CRUD endpoint exists.
- All 165 feature specs now have the detailed baseline contract below; implementation status remains unchanged until code evidence is added.

## Delivery principles

- Build connected journeys, not isolated screens.
- Every form gets a field-level inventory: label, type, requiredness, visibility, sensitivity, source of truth, validation, owner, and output record.
- Every feature gets persona intent, state transitions, permissions, audit history, connected dependencies, UI states and E2E acceptance.
- Every feature also gets outcome signals, a stakeholder/decision map, goals and non-goals, role-specific user stories, journey moments, a validation hypothesis and product-quality guardrails.
- Parent, staff, school admin, principal, accountant and platform admin experiences must be treated as distinct surfaces.
- Progress is updated in the feature file as implementation produces evidence.

## Detailed specification contract

Every feature file is required to answer these questions before implementation begins:

- **Intent and scope:** Which persona is trying to achieve what outcome, and what is explicitly in and out of scope?
- **Data inventory:** Which fields/records are mandatory for the first valid save, which are optional enrichment, which are later scope, and who owns each value?
- **Validation:** What formats, uniqueness rules, date ordering, references, duplicate handling and `Not Applicable` behaviour apply?
- **Documents and evidence:** Which documents are required, optional or not applicable; how are file metadata, access, review, expiry, replacement and verification handled?
- **Workflow:** What are the states, allowed transitions, owners, blockers, rejection/recovery paths, reversal rules and bulk-action safeguards?
- **Permissions and privacy:** Which persona can view, create, edit, approve, verify, export/download or administer each part, at tenant/school/campus/record scope?
- **Connected experience:** Which source records, notifications/tasks, audit events and reports consume the output, and what happens when a downstream action fails?
- **Acceptance:** What must work in the core journey, validation/error/recovery/loading/empty states, backend contract tests and browser E2E journey?
- **Pending work:** What evidence is still missing before the feature can move from Planned/Partial to complete, and what is deliberately deferred?

The catalogue also guards against feature-factory delivery. Every feature must name the outcome it is expected to improve, the accountable decision owner, the frontline user and affected downstream users, the smallest useful validation, and the guardrails that must not regress. A feature can be technically complete and still remain Partial until those product signals are evidenced.

The individual file is the source of truth for that feature. When implementation progresses, replace baseline language with concrete Prisma/migration, NestJS API, portal, permissions, document, notification, audit, reporting and E2E evidence. Do not mark a feature complete solely because a table, endpoint or screen exists.

## Catalogue

### Platform & onboarding

| ID | Feature | Priority | Status | Spec |
|---|---|---:|---|---|
| PLT-01 | Multi-tenant school registration and provisioning | P0 | Implemented | [Open feature spec](features/PLT-01.md) |
| PLT-02 | Guided school setup wizard and completion checklist | P0 | Partial | [Open feature spec](features/PLT-02.md) |
| PLT-03 | School profile, branding, contact details and settings | P0 | Partial | [Open feature spec](features/PLT-03.md) |
| PLT-04 | Campus, branch and school-group management | P0 | Implemented | [Open feature spec](features/PLT-04.md) |
| PLT-05 | Academic year, term and holiday calendar setup | P0 | Implemented | [Open feature spec](features/PLT-05.md) |
| PLT-06 | Bulk import of students, guardians, teachers and staff | P0 | Implemented | [Open feature spec](features/PLT-06.md) |
| PLT-07 | Import preview, validation, duplicate detection and error correction | P0 | Implemented | [Open feature spec](features/PLT-07.md) |
| PLT-08 | Reusable import templates and field mapping | P0 | Partial | [Open feature spec](features/PLT-08.md) |
| PLT-09 | Guided onboarding for each user role | P1 | Planned | [Open feature spec](features/PLT-09.md) |
| PLT-10 | Subscription plans, trials, billing, renewal and usage limits | P0 | Partial | [Open feature spec](features/PLT-10.md) |
| PLT-11 | Platform-wide super-admin dashboard | P0 | Implemented | [Open feature spec](features/PLT-11.md) |
| PLT-12 | School activation, suspension and reactivation | P0 | Implemented | [Open feature spec](features/PLT-12.md) |
| PLT-13 | School data export and tenant offboarding | P0 | Partial | [Open feature spec](features/PLT-13.md) |
| PLT-14 | Onboarding progress, data migration assistance and support requests | P1 | Planned | [Open feature spec](features/PLT-14.md) |

### Student lifecycle & admissions

| ID | Feature | Priority | Status | Spec |
|---|---|---:|---|---|
| STD-01 | Admission enquiries and follow-up pipeline | P1 | Planned | [Open feature spec](features/STD-01.md) |
| STD-02 | Online and offline admission applications | P0 | Implemented | [Open feature spec](features/STD-02.md) |
| STD-03 | Admission review, approval and seat allocation | P0 | Implemented | [Open feature spec](features/STD-03.md) |
| STD-04 | Student profile and guardian relationships | P0 | Implemented | [Open feature spec](features/STD-04.md) |
| STD-05 | Student documents, photos and medical information | P0 | Partial | [Open feature spec](features/STD-05.md) |
| STD-06 | Admission number and roll number generation | P0 | Implemented | [Open feature spec](features/STD-06.md) |
| STD-07 | Class, section and campus allocation | P0 | Implemented | [Open feature spec](features/STD-07.md) |
| STD-08 | Student ID card generation and printing | P1 | Planned | [Open feature spec](features/STD-08.md) |
| STD-09 | Student status and complete academic history | P0 | Implemented | [Open feature spec](features/STD-09.md) |
| STD-10 | Bulk promotion and section reshuffling | P0 | Implemented | [Open feature spec](features/STD-10.md) |
| STD-11 | Academic-year rollover and next-year preparation | P0 | Implemented | [Open feature spec](features/STD-11.md) |
| STD-12 | Graduation, school completion and alumni records | P0 | Implemented | [Open feature spec](features/STD-12.md) |
| STD-13 | Transfer, withdrawal and leaving workflows | P0 | Implemented | [Open feature spec](features/STD-13.md) |
| STD-14 | Transfer, school-leaving, bonafide and character certificates | P0 | Partial | [Open feature spec](features/STD-14.md) |
| STD-15 | Certificate templates, approvals, serial numbers and verification | P1 | Partial | [Open feature spec](features/STD-15.md) |
| STD-16 | Student re-admission and inter-campus transfers | P1 | Partial | [Open feature spec](features/STD-16.md) |
| STD-17 | Student well-being concerns and follow-up records | P1 | Planned | [Open feature spec](features/STD-17.md) |
| STD-18 | Student achievements and extracurricular portfolio | P1 | Planned | [Open feature spec](features/STD-18.md) |

### Academics

| ID | Feature | Priority | Status | Spec |
|---|---|---:|---|---|
| ACD-01 | Classes, grades, sections and class teachers | P0 | Implemented | [Open feature spec](features/ACD-01.md) |
| ACD-02 | Subject and curriculum management | P0 | Implemented | [Open feature spec](features/ACD-02.md) |
| ACD-03 | Teacher-to-class and subject assignments | P0 | Implemented | [Open feature spec](features/ACD-03.md) |
| ACD-04 | Timetable creation and publication | P0 | Implemented | [Open feature spec](features/ACD-04.md) |
| ACD-05 | Teacher, classroom and period conflict detection | P1 | Partial | [Open feature spec](features/ACD-05.md) |
| ACD-06 | Homework, assignments and digital diary | P1 | Partial | [Open feature spec](features/ACD-06.md) |
| ACD-07 | Exams, assessments and mark entry | P1 | Partial | [Open feature spec](features/ACD-07.md) |
| ACD-08 | Configurable grading scales and report cards | P1 | Planned | [Open feature spec](features/ACD-08.md) |
| ACD-09 | Student performance history and academic reports | P1 | Planned | [Open feature spec](features/ACD-09.md) |
| ACD-10 | Lesson plans and syllabus progress tracking | P1 | Planned | [Open feature spec](features/ACD-10.md) |
| ACD-11 | Online quizzes, learning resources and LMS | P2 | Planned | [Open feature spec](features/ACD-11.md) |
| ACD-12 | Online classes and assessment sessions | P2 | Planned | [Open feature spec](features/ACD-12.md) |
| ACD-13 | Hall tickets and examination seating plans | P1 | Planned | [Open feature spec](features/ACD-13.md) |
| ACD-14 | Multiple boards, streams, electives and grading formats | P1 | Planned | [Open feature spec](features/ACD-14.md) |

### Attendance & leave

| ID | Feature | Priority | Status | Spec |
|---|---|---:|---|---|
| ATT-01 | Daily class-wise student attendance | P0 | Implemented | [Open feature spec](features/ATT-01.md) |
| ATT-02 | Attendance correction and approval | P0 | Implemented | [Open feature spec](features/ATT-02.md) |
| ATT-03 | Attendance history, percentages and reports | P0 | Implemented | [Open feature spec](features/ATT-03.md) |
| ATT-04 | Teacher and non-teaching staff attendance | P1 | Partial | [Open feature spec](features/ATT-04.md) |
| ATT-05 | Student and staff leave requests and approvals | P1 | Partial | [Open feature spec](features/ATT-05.md) |
| ATT-06 | Parent absence notifications | P1 | Planned | [Open feature spec](features/ATT-06.md) |
| ATT-07 | Half-day, late, excused and other attendance statuses | P0 | Implemented | [Open feature spec](features/ATT-07.md) |
| ATT-08 | Attendance registers and exportable reports | P0 | Implemented | [Open feature spec](features/ATT-08.md) |
| ATT-09 | Biometric and RFID integrations | P2 | Planned | [Open feature spec](features/ATT-09.md) |
| ATT-10 | Attendance anomaly and repeated-absence alerts | P1 | Planned | [Open feature spec](features/ATT-10.md) |

### Finance

| ID | Feature | Priority | Status | Spec |
|---|---|---:|---|---|
| FIN-01 | Fee heads, structures and class-wise fee plans | P0 | Implemented | [Open feature spec](features/FIN-01.md) |
| FIN-02 | Student-specific fee adjustments | P0 | Implemented | [Open feature spec](features/FIN-02.md) |
| FIN-03 | Installments, due dates and billing schedules | P0 | Implemented | [Open feature spec](features/FIN-03.md) |
| FIN-04 | Cash, cheque, UPI and other payment recording | P0 | Implemented | [Open feature spec](features/FIN-04.md) |
| FIN-05 | Online payment gateway integration | P1 | Partial | [Open feature spec](features/FIN-05.md) |
| FIN-06 | Receipts, invoices and payment history | P0 | Implemented | [Open feature spec](features/FIN-06.md) |
| FIN-07 | Discounts, concessions, scholarships and sibling benefits | P1 | Implemented | [Open feature spec](features/FIN-07.md) |
| FIN-08 | Partial payments, overdue dues and late fees | P0 | Implemented | [Open feature spec](features/FIN-08.md) |
| FIN-09 | Fee reminders and defaulter reports | P1 | Implemented | [Open feature spec](features/FIN-09.md) |
| FIN-10 | Refunds, reversals and payment reconciliation | P1 | Partial | [Open feature spec](features/FIN-10.md) |
| FIN-11 | Expenses, vendors, purchase bills and approvals | P1 | Planned | [Open feature spec](features/FIN-11.md) |
| FIN-12 | Accounting ledger and financial statements | P2 | Planned | [Open feature spec](features/FIN-12.md) |
| FIN-13 | Budget planning and budget-versus-actual reporting | P2 | Planned | [Open feature spec](features/FIN-13.md) |
| FIN-14 | Financial clearance for student transfers and exits | P1 | Partial | [Open feature spec](features/FIN-14.md) |

### Teachers, employees & HR

| ID | Feature | Priority | Status | Spec |
|---|---|---:|---|---|

### Transport

| ID | Feature | Priority | Status | Spec |
|---|---|---:|---|---|
| TRN-01 | Vehicles, capacities and registration records | P0 | Implemented | [Open feature spec](features/TRN-01.md) |
| TRN-02 | Drivers, conductors and licence documents | P0 | Implemented | [Open feature spec](features/TRN-02.md) |
| TRN-03 | Routes, stops, schedules and route sequencing | P0 | Implemented | [Open feature spec](features/TRN-03.md) |
| TRN-04 | Student pickup and drop-off assignments | P0 | Implemented | [Open feature spec](features/TRN-04.md) |
| TRN-05 | Transport fee integration | P1 | Partial | [Open feature spec](features/TRN-05.md) |
| TRN-06 | Route capacity and allocation conflicts | P1 | Partial | [Open feature spec](features/TRN-06.md) |
| TRN-07 | Daily boarding and drop-off records | P1 | Planned | [Open feature spec](features/TRN-07.md) |
| TRN-08 | Vehicle maintenance and document-expiry alerts | P1 | Planned | [Open feature spec](features/TRN-08.md) |
| TRN-09 | GPS tracking and stop-based parent alerts | P2 | Planned | [Open feature spec](features/TRN-09.md) |
| TRN-10 | Route delays, breakdowns and emergency notifications | P1 | Planned | [Open feature spec](features/TRN-10.md) |
| TRN-11 | Field-trip vehicle allocation | P1 | Planned | [Open feature spec](features/TRN-11.md) |

### Communication

| ID | Feature | Priority | Status | Spec |
|---|---|---:|---|---|
| COM-01 | School circulars and announcements | P0 | Implemented | [Open feature spec](features/COM-01.md) |
| COM-02 | Audience targeting by campus, role, class or section | P0 | Implemented | [Open feature spec](features/COM-02.md) |
| COM-03 | Email, SMS and WhatsApp notifications | P1 | Planned | [Open feature spec](features/COM-03.md) |
| COM-04 | In-app notification inbox and read status | P0 | Implemented | [Open feature spec](features/COM-04.md) |
| COM-05 | Attendance, fee and timetable-triggered alerts | P1 | Partial | [Open feature spec](features/COM-05.md) |
| COM-06 | Parent-teacher messaging | P1 | Planned | [Open feature spec](features/COM-06.md) |
| COM-07 | Parent-teacher meeting scheduling | P1 | Planned | [Open feature spec](features/COM-07.md) |
| COM-08 | Event invitations, RSVP and consent forms | P1 | Planned | [Open feature spec](features/COM-08.md) |
| COM-09 | Notification preferences and delivery status | P1 | Planned | [Open feature spec](features/COM-09.md) |
| COM-10 | Emergency broadcasts | P1 | Planned | [Open feature spec](features/COM-10.md) |
| COM-11 | Multilingual notices and communication templates | P1 | Planned | [Open feature spec](features/COM-11.md) |

### Library, inventory & facilities

| ID | Feature | Priority | Status | Spec |
|---|---|---:|---|---|
| OPS-01 | Library catalogue, copies and categories | P1 | Planned | [Open feature spec](features/OPS-01.md) |
| OPS-02 | Book issue, return, renewal and fines | P1 | Planned | [Open feature spec](features/OPS-02.md) |
| OPS-03 | Barcode-based inventory operations | P2 | Planned | [Open feature spec](features/OPS-03.md) |
| OPS-04 | School assets and asset assignment | P1 | Planned | [Open feature spec](features/OPS-04.md) |
| OPS-05 | Consumable stock and stock movements | P1 | Planned | [Open feature spec](features/OPS-05.md) |
| OPS-06 | Purchase requisitions, vendors and purchase orders | P2 | Planned | [Open feature spec](features/OPS-06.md) |
| OPS-07 | Classroom, lab, auditorium and sports-ground booking | P1 | Planned | [Open feature spec](features/OPS-07.md) |
| OPS-08 | Maintenance requests and resolution tracking | P1 | Planned | [Open feature spec](features/OPS-08.md) |
| OPS-09 | Laboratory equipment and consumables | P2 | Planned | [Open feature spec](features/OPS-09.md) |
| OPS-10 | Canteen and meal management | P2 | Planned | [Open feature spec](features/OPS-10.md) |
| OPS-11 | Hostel rooms, beds and student allocation | P2 | Planned | [Open feature spec](features/OPS-11.md) |
| OPS-12 | Hostel attendance, visitors and gate passes | P2 | Planned | [Open feature spec](features/OPS-12.md) |
| OPS-13 | Mess plans, meal booking and hostel charges | P2 | Planned | [Open feature spec](features/OPS-13.md) |

### Documents & certificates

| ID | Feature | Priority | Status | Spec |
|---|---|---:|---|---|
| DOC-01 | Multiple attachments on every supported entity | P0 | Implemented | [Open feature spec](features/DOC-01.md) |
| DOC-02 | Images, PDF, Word, Excel and other approved formats | P0 | Implemented | [Open feature spec](features/DOC-02.md) |
| DOC-03 | Document categories, metadata and version history | P0 | Implemented | [Open feature spec](features/DOC-03.md) |
| DOC-04 | Private access, permissions and download controls | P0 | Partial | [Open feature spec](features/DOC-04.md) |
| DOC-05 | Document review and verification status | P1 | Partial | [Open feature spec](features/DOC-05.md) |
| DOC-06 | Expiry dates and document renewal reminders | P1 | Planned | [Open feature spec](features/DOC-06.md) |
| DOC-07 | Certificate templates and generated PDFs | P1 | Planned | [Open feature spec](features/DOC-07.md) |
| DOC-08 | Digital signatures or authorized approval workflows | P1 | Planned | [Open feature spec](features/DOC-08.md) |
| DOC-09 | Document audit history | P0 | Partial | [Open feature spec](features/DOC-09.md) |
| DOC-10 | Bulk document upload and profile-photo management | P1 | Planned | [Open feature spec](features/DOC-10.md) |

### Security & governance

| ID | Feature | Priority | Status | Spec |
|---|---|---:|---|---|
| SEC-01 | Role-based access control | P0 | Implemented | [Open feature spec](features/SEC-01.md) |
| SEC-02 | Granular module and action permissions | P0 | Implemented | [Open feature spec](features/SEC-02.md) |
| SEC-03 | Campus-, class- and record-level access restrictions | P0 | Partial | [Open feature spec](features/SEC-03.md) |
| SEC-04 | Secure authentication and account recovery | P0 | Implemented | [Open feature spec](features/SEC-04.md) |
| SEC-05 | Audit logs for sensitive operations | P0 | Implemented | [Open feature spec](features/SEC-05.md) |
| SEC-06 | Controlled access to student health and identity records | P0 | Partial | [Open feature spec](features/SEC-06.md) |
| SEC-07 | Account deactivation and access revocation | P0 | Partial | [Open feature spec](features/SEC-07.md) |
| SEC-08 | Session management and login history | P1 | Planned | [Open feature spec](features/SEC-08.md) |
| SEC-09 | Configurable retention and archival policies | P1 | Planned | [Open feature spec](features/SEC-09.md) |
| SEC-10 | Security incident and access-review reports | P1 | Planned | [Open feature spec](features/SEC-10.md) |
| SEC-11 | Data export, portability and deletion workflows | P0 | Partial | [Open feature spec](features/SEC-11.md) |

### Reporting & analytics

| ID | Feature | Priority | Status | Spec |
|---|---|---:|---|---|
| REP-01 | Student, class and staff directory reports | P0 | Partial | [Open feature spec](features/REP-01.md) |
| REP-02 | Attendance and absence reports | P0 | Partial | [Open feature spec](features/REP-02.md) |
| REP-03 | Fees collected, outstanding dues and receipts | P0 | Partial | [Open feature spec](features/REP-03.md) |
| REP-04 | Admission and enrollment reports | P1 | Planned | [Open feature spec](features/REP-04.md) |
| REP-05 | Promotion, graduation and transfer reports | P1 | Planned | [Open feature spec](features/REP-05.md) |
| REP-06 | Academic performance and exam analytics | P1 | Planned | [Open feature spec](features/REP-06.md) |
| REP-07 | Transport occupancy and route reports | P1 | Planned | [Open feature spec](features/REP-07.md) |
| REP-08 | HR, leave and payroll reports | P1 | Planned | [Open feature spec](features/REP-08.md) |
| REP-09 | School-group and campus comparison | P1 | Planned | [Open feature spec](features/REP-09.md) |
| REP-10 | Configurable report builder | P2 | Planned | [Open feature spec](features/REP-10.md) |
| REP-11 | Scheduled report delivery | P2 | Planned | [Open feature spec](features/REP-11.md) |
| REP-12 | Dashboards tailored to each persona | P0 | Partial | [Open feature spec](features/REP-12.md) |

### Workflow & engagement

| ID | Feature | Priority | Status | Spec |
|---|---|---:|---|---|
| WFL-01 | Configurable approval workflows | P1 | Partial | [Open feature spec](features/WFL-01.md) |
| WFL-02 | Centralized tasks, assignments and due dates | P1 | Partial | [Open feature spec](features/WFL-02.md) |
| WFL-03 | Pending-action inbox and reminders | P1 | Partial | [Open feature spec](features/WFL-03.md) |
| WFL-04 | Custom forms and electronic consent | P1 | Planned | [Open feature spec](features/WFL-04.md) |
| WFL-05 | Visitor registration, check-in and gate passes | P1 | Planned | [Open feature spec](features/WFL-05.md) |
| WFL-06 | Event and field-trip planning | P1 | Planned | [Open feature spec](features/WFL-06.md) |
| WFL-07 | Incident reporting and safety follow-up | P1 | Planned | [Open feature spec](features/WFL-07.md) |
| WFL-08 | Student well-being concerns and intervention tracking | P1 | Planned | [Open feature spec](features/WFL-08.md) |
| WFL-09 | Staff handover and substitution workflows | P1 | Planned | [Open feature spec](features/WFL-09.md) |
| WFL-10 | Lost-and-found tracking | P2 | Planned | [Open feature spec](features/WFL-10.md) |
| WFL-11 | Student clubs, sports, houses and competitions | P1 | Planned | [Open feature spec](features/WFL-11.md) |
| WFL-12 | Digital achievements and student portfolios | P1 | Planned | [Open feature spec](features/WFL-12.md) |
| WFL-13 | Alumni directory and engagement | P2 | Planned | [Open feature spec](features/WFL-13.md) |
| WFL-14 | AI assistant for approved school information | P2 | Planned | [Open feature spec](features/WFL-14.md) |
| WFL-15 | AI-assisted operational insights | P2 | Planned | [Open feature spec](features/WFL-15.md) |
| WFL-16 | Multilingual user interface and notifications | P1 | Planned | [Open feature spec](features/WFL-16.md) |
| WFL-17 | Low-bandwidth and mobile-responsive web experience | P0 | Implemented | [Open feature spec](features/WFL-17.md) |

### Integrations & operations

| ID | Feature | Priority | Status | Spec |
|---|---|---:|---|---|
| INT-01 | Payment gateway integration | P1 | Partial | [Open feature spec](features/INT-01.md) |
| INT-02 | Email, SMS and WhatsApp providers | P1 | Partial | [Open feature spec](features/INT-02.md) |
| INT-03 | Biometric and RFID device integration | P2 | Planned | [Open feature spec](features/INT-03.md) |
| INT-04 | GPS and vehicle tracking integration | P2 | Planned | [Open feature spec](features/INT-04.md) |
| INT-05 | Data import and export integrations | P0 | Implemented | [Open feature spec](features/INT-05.md) |
| INT-06 | External APIs and event webhooks | P2 | Planned | [Open feature spec](features/INT-06.md) |
| INT-07 | Integration status, failures and retry visibility | P1 | Partial | [Open feature spec](features/INT-07.md) |
| INT-08 | Automated database backup and recovery procedures | P0 | Partial | [Open feature spec](features/INT-08.md) |
| INT-09 | School data migration and exit export | P0 | Partial | [Open feature spec](features/INT-09.md) |
| INT-10 | System health, tenant usage and subscription reporting | P1 | Planned | [Open feature spec](features/INT-10.md) |

## Current connected delivery queue

1. Unified action centre for admissions, missing documents, fees, expiring records, approvals and setup tasks.
2. Admission completion: real document storage, parent status tracking, fee handoff, guardian access and enrollment checklist.
3. Academic-year rollover with promotion preview, exceptions, graduation and historical preservation.
4. Student exits and certificates with clearance, approvals, serial verification and generated PDFs.
5. Document lifecycle with private storage, versions, expiry reminders and audit.
6. Attendance-to-parent engagement and notification delivery reliability.
7. Staff onboarding, leave, substitutes and restricted support records.
8. Library, assets, maintenance, events and visitor safety workflows.
9. Persona dashboards and operational reporting.
10. Provider integrations, retries, webhooks, backups and tenant health.

## E2E journey ledger

| Journey | Required connected path | State |
|---|---|---|
| School onboarding | provision → campus → academic year → classes → staff/student imports → setup checklist | Partial |
| Parent admission | public start → verification → autosave → documents → submit → review → offer/fees → enrollment | Partial |
| Office admission | staff entry → same state machine → documents → review → enrollment | Partial |
| Academic year | prepare → copy → promote → exceptions → publish → historical enrollment retained | Partial |
| Finance | fee plan → assignment → invoice → reminder/delivery → payment → receipt → ledger → clearance | Partial |
| Student exit | request → approvals → clearance → certificate → exit record | Partial |
| Staff onboarding | invite/import → profile/documents → role/scope → checklist → active record | Partial |
| Attendance | roster → mark/correct/approve → percentage → alert → report | Partial |
| Transport | vehicle/driver/route → capacity → assignment → boarding/incident → parent update | Partial |
| Documents | upload → metadata/version → permission → review → expiry → renewal/audit | Partial |

