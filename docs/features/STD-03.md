# STD-03 — Admission review, approval and seat allocation

- Priority: **P0**
- Current status: **Implemented**
- Source: School Management SaaS complete feature coverage research
- Specification maturity: **Detailed baseline — implementation evidence must update this file**

## Product intent

As a admissions, registrar or student-life administrator, I need admission review, approval and seat allocation so that the school can complete the related journey with clear ownership, reliable records and no disconnected re-entry. The feature is successful only when its output is useful to the next connected school operation, not merely when a screen can save a row.

## Outcome and success signals

### Desired outcome

The school should be able to complete **Admission review, approval and seat allocation** with less uncertainty, fewer handoffs and a trustworthy record that improves the next connected operation. This is an outcome hypothesis, not a claim that the current product already achieves it.

### Success signals to define before implementation

- **User outcome:** the primary persona completes the journey with the intended result and understands the next step.
- **Operational outcome:** the school reduces avoidable re-entry, unresolved follow-up, duplicate records or manual reconciliation for this journey.
- **Product signal:** define a baseline and target for completion rate, time-to-completion, recovery rate, unresolved blockers or downstream adoption before calling the feature successful.
- **Guardrails:** no increase in permission incidents, incorrect records, missed required evidence, notification failures or support burden.

If baseline data does not yet exist, the first slice must instrument or manually measure the smallest useful baseline. Do not invent a target or declare success from delivery alone.

## Stakeholder and decision map

| Stakeholder | Relationship | What they need from this feature | Decision / evidence responsibility |
|---|---|---|---|
| registrar, admissions or student-life administrator | Primary actor | A clear path to complete the job, recover from blockers and see the outcome | Supplies workflow evidence and validates usability |
| principal or campus administrator | Accountable decision owner | Safe defaults, visibility into risk and meaningful operational outcome | Owns scope, policy exceptions and go-live decision |
| student, guardians, family and downstream finance/academic staff | Affected/downstream users | Correct, timely and appropriately scoped records or notifications | Validate handoffs, access boundaries and consequences |
| Platform/security/compliance owner | Gatekeeper where applicable | Privacy, auditability, retention and recoverability | Approves sensitive data, documents and integrations |

Before implementation, identify the named school role who is accountable for the feature, the person who can approve policy exceptions, and the frontline user whose current process is being replaced. If any is unknown, keep it in Open questions rather than silently assuming the product owner is all three.

## Goals and non-goals

### Goals

- Help the primary persona complete the full journey from trigger to confirmed outcome.
- Make required information, documents, permissions, ownership and next actions visible at the moment they matter.
- Preserve progress, history and recovery when the journey spans multiple sessions, users or systems.
- Produce a connected source-of-truth record that downstream modules can safely consume.

### Non-goals for the first slice

- Do not force every advanced field, automation or external integration into the first save.
- Do not replace a policy decision with an arbitrary UI default.
- Do not create a second source of truth for data already owned by another module.
- Do not claim product success until the outcome signal and guardrails have been measured.

## User stories and journey moments

### Primary user story

As a **registrar, admissions or student-life administrator**, I want to complete **admission review, approval and seat allocation** with only the information required at each step, so that I can reach a reliable outcome without guessing, re-entering data or chasing invisible blockers.

### Reviewer or decision-owner story

As a **principal or campus administrator**, I want to see status, evidence, ownership, exceptions and downstream impact, so that I can approve, correct, delegate or stop the journey safely.

### Affected-user story

As an affected user such as **student, guardians, family and downstream finance/academic staff**, I want the resulting record or communication to be accurate, timely and limited to what I am allowed to see, so that the feature helps me rather than creating a new reconciliation task.

### Journey moments to design and verify

1. **Trigger:** the user knows why this task exists and what outcome is expected.
2. **Prepare:** the system shows context, prefilled source-of-truth data, mandatory fields, documents and estimated effort.
3. **Work:** the user can complete the task progressively, save, resume, delegate where allowed and understand terminology.
4. **Decision:** validation, review, approval or rejection explains what happened and who owns the next action.
5. **Confirm:** the system shows the final state, generated output, recipients, downstream updates and audit trail.
6. **Recover:** a failed, rejected, expired, duplicate or interrupted path offers a clear retry, correction or escalation without data loss.

At each moment, record the user’s likely question, the evidence needed to answer it, the emotion/friction risk and the product opportunity. A blank dashboard, unexplained status or silent failure is a product gap even when the underlying API works.

## Product validation hypothesis

**Hypothesis:** If the product gives the registrar, admissions or student-life administrator progressive guidance, trustworthy context, explicit evidence requirements and recovery at each journey moment, then completion and downstream correctness should improve without increasing support or access incidents.

**Smallest useful validation:** observe or replay the current process with representative school data, measure the baseline time/errors/blockers, and test the proposed first slice with a small set of realistic cases before adding advanced automation.

**Decision rule:** continue, change or stop the slice based on observed user outcome, operational correctness and guardrail evidence—not on feature count alone.

## Product quality requirements

- **Progressive disclosure:** ask for mandatory information first and defer optional enrichment without hiding what will be needed later.
- **Clarity:** use school language, explain unfamiliar terms, show why a field/document is needed and never leave a meaningful blank unexplained.
- **Continuity:** autosave or draft where the journey is long; preserve partial work and make the resume path obvious.
- **Accessibility and responsiveness:** usable with keyboard, assistive technology, readable contrast, clear focus/error states and mobile-sized touch targets.
- **Trust:** show source, last updated time, actor, status, next action and document/access boundaries where relevant.
- **Resilience:** handle retries, duplicate submissions, partial downstream failure, stale data and unavailable integrations explicitly.
- **Safety:** protect sensitive fields/documents, enforce server-side scope and avoid irreversible actions without confirmation and audit.

## Scope and operating model

This feature covers the complete web and backend journey for **Admission review, approval and seat allocation**:

- create or capture the minimum valid record;
- enrich it with optional information over time without blocking the first save;
- validate duplicates, references, dates, permissions and document requirements before publication or completion;
- expose the right action to the right persona at the right school/campus/class/record scope;
- retain history and make the resulting record available to connected features; and
- provide recovery for missing information, failed delivery, rejected evidence, correction and reversal.

The first release should optimise for a coherent school-office workflow. Advanced automation, external providers and high-volume optimisation are explicitly separated into later scope.

## Detailed data requirements

| Data area | Required for first valid save | Optional during enrichment | Later / advanced | Validation and ownership |
|---|---|---|---|---|
| Primary record | student identity, date of birth, gender and admission reference | display label, notes and secondary identifiers | history, bulk actions and automation | Owner is the responsible school role; unique within the stated school scope |
| People and scope | guardian, family, emergency contact and relationship records | alternate contact, relationship notes and delegation | family-wide, cross-campus or external identities | Tenant, school and campus scope must be derived from authorised context, never trusted from the browser alone |
| Operational details | academic placement, status and lifecycle dates | comments, tags and optional effective/expiry dates | rules, integrations and scheduled actions | Validate enumerations, date order, references and state transition |
| Evidence and output | identity, address, medical, transfer and consent documents | reviewer notes, version labels and supporting links | OCR, signatures, exports and retention automation | Store source metadata, file/access classification and audit actor when applicable |

Mandatory fields should be limited to what is needed to create a safe, actionable record. Optional fields must be clearly labelled and editable later. If a field does not apply, the UI and API should record **Not Applicable** rather than silently leaving an operationally meaningful blank.

## Documents and evidence

Identity, admission, transfer, consent, medical or family evidence required by the specific student journey; each requirement must identify required/optional and expiry.

For every applicable document requirement, capture category, file name, MIME type, size, storage reference, uploaded-by, uploaded-at, visibility, review status, reviewer note, expiry date and replacement/version relationship. The feature must distinguish **required evidence missing**, **file uploaded but not reviewed**, **verified**, **rejected**, **expired** and **not applicable**. A document link must open directly for an authorised user and must never rely on a public guessable storage path.

## Workflow and state transitions

Expected lifecycle: **Draft → Submitted → Under review → Needs information → Approved/Rejected → Active/Exited**.

- Each transition has one owning persona, a permission check, timestamp, actor and reason where the transition is corrective, rejecting, reversing or exceptional.
- A record cannot be published, activated, collected, issued or closed while blocking required fields, references or documents remain unresolved.
- “Needs information” or “Rejected” must preserve the submitted data and explain the next action; the user must be able to resume rather than re-enter everything.
- Reopening, cancellation, reversal or archival must be explicit and auditable. Existing downstream records must not be silently rewritten.
- Bulk actions must preview impact, report row-level failures and be retryable without creating duplicates.

## Permissions, privacy and audit

- Apply tenant, school, campus and record-level scope on the server for every read and write.
- Separate view, create, edit, approve/verify, export/download and administer permissions.
- Mask or restrict identity, health, finance, communication and security-sensitive fields according to persona.
- Record create, update, status transition, document access, export, correction, rejection and deletion/archive events.
- Never put secrets, private documents or sensitive medical/identity data in logs, URLs or client-side permission assumptions.

## Connected experience

This feature must connect to the source records that establish scope, the workflow/task or notification layer that creates follow-up work, the document service for evidence, audit history for accountability, and reporting for operational visibility. Define the handoff explicitly: what event is emitted, which record is updated, who is notified, and what happens when the downstream step fails.

## Acceptance criteria

### Core journey

1. An authorised user can start the feature with only the mandatory fields and sees the exact school/campus/record context before saving.
2. The server validates required fields, formats, references, uniqueness, date ordering and permission scope; invalid input returns field-level errors without losing valid draft data.
3. The user can save a draft, leave, return later and continue without re-entering completed information.
4. The user can add optional details and applicable documents later; required evidence is clearly separated from optional evidence.
5. The system shows the current state, owner, next action, blockers, last updated time and audit-relevant actor.
6. A permitted reviewer can approve, reject, verify, return for information, reverse or close the record according to the lifecycle above.
7. Every connected downstream action is either completed or visibly marked pending/failed with a recovery action; no silent partial success is allowed.
8. The final record is searchable and usable by connected modules without copying data into a second source of truth.

### UI and recovery states

- loading state with context and no misleading empty state;
- first-use empty state with the next useful action;
- field-level validation and server-error recovery;
- duplicate/conflict warning with a safe resolution path;
- document upload, review, expiry and access failure states where applicable;
- permission denied state that does not reveal restricted data;
- saved, unsaved, retrying and offline/interrupted submission feedback;
- responsive desktop and mobile layout for the intended persona.

### Backend and E2E proof

- API tests cover authorised access, wrong-tenant/wrong-school rejection, validation, idempotency, state transitions, document linkage and audit events.
- Browser E2E covers the happy path from first save through the connected outcome, plus a missing-document or rejected-information recovery path.
- Test data proves that a user cannot view or mutate a sibling school, campus or restricted record outside their scope.

## Pending items and later scope

Before marking this feature complete, resolve: implementation evidence, detailed field validation in code, permission tests, audit/event coverage, document upload/access behaviour, notification/retry handling, reporting implications, responsive UX and API/browser E2E proof. Later scope includes guardian self-service, bulk correction, family-wide views, reminders and policy-driven retention.

## Current evidence and next slice

The catalogue currently marks this feature **Implemented**. That status is a planning baseline, not completion proof. The next implementation slice should begin by mapping the mandatory fields and state transitions above to existing Prisma models, NestJS endpoints and portal routes, then update this file with concrete migrations, APIs, screens, permissions, tests and known gaps.

## Progress log

- 2026-10-30 — Imported from the research catalogue and assigned the initial repository-audit status.
- 2026-10-30 — Expanded this specification with detailed data requirements, document/evidence rules, lifecycle, permissions, connected experience, UI states, backend acceptance criteria and explicit pending items.
