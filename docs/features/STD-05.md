# STD-05 — Student documents, photos and medical information

- Priority: **P0**
- Current status: **Partial — foundation slice shipped**
- Source: School Management SaaS complete feature coverage research

## Product intent

As a admissions or student-life administrator, I need student documents, photos and medical information so that the school can complete this part of its operation without disconnected spreadsheets or re-entering the same information.

## Outcome and success signals

### Desired outcome

The school should be able to complete **Student documents, photos and medical information** with less uncertainty, fewer handoffs and a trustworthy record that improves the next connected operation. This is an outcome hypothesis, not a claim that the current product already achieves it.

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

As a **registrar, admissions or student-life administrator**, I want to complete **student documents, photos and medical information** with only the information required at each step, so that I can reach a reliable outcome without guessing, re-entering data or chasing invisible blockers.

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

This slice covers the student evidence checklist, document review lifecycle, student photo reference and restricted medical/care profile. It intentionally does not select a binary storage provider; the existing document metadata service remains the integration boundary.

## Detailed data requirements

| Area | Required now | Optional / later | Sensitivity and source of truth |
|---|---|---|---|
| Document checklist | `key`, `label`, required flag, lifecycle status | expiry date, review note, linked document metadata | School-controlled checklist; the `Document` record remains the file metadata source of truth |
| Document review | status, reviewer and verification timestamp when verified | rejection reason, expiry reminders and escalation policy | Restricted to student read/write permissions |
| Student photo | Existing student `profilePhotoKey` | Crop history, consent, replacement history | Sensitive student profile asset; binary storage adapter still pending |
| Medical profile | None forced at record creation; authorized staff can capture care context | allergies, conditions, medication, diet, restrictions, emergency instructions, contacts, doctor details and consent version | Highly sensitive; stored in a restricted student-linked record |

The product deliberately allows the school to create a checklist requirement before a file exists. A required record can therefore move from `REQUIRED` to `PENDING`, `VERIFIED`, `REJECTED`, `EXPIRED` or `NOT_APPLICABLE` as evidence is collected and reviewed.

## Documents and evidence

Each applicable evidence item stores its checklist key, label, required flag, linked document metadata, review status, reviewer note and expiry date. The portal must distinguish missing, uploaded/pending review, verified, rejected, expired and not-applicable evidence. Files remain behind the existing object-storage metadata boundary and must be opened only through an authorised document access path.

## Workflow and state transitions

- Admissions/registrar staff define the checklist and collect evidence.
- Authorised student-life or school administrators review, verify, reject or mark a requirement not applicable.
- A rejection preserves the linked record and review note so the parent/office user knows what to replace.
- Verification records the reviewer and timestamp; expiry must return the requirement to an actionable state without deleting the historical evidence.
- Medical information is restricted to authorised staff and must not be exposed through general student directory responses.

## Definition of done

- [x] Field and data inventory is documented, including requiredness, sensitivity, source of truth and validation.
- [x] State transitions and ownership are explicit; a document requirement can exist before its file and verification metadata is retained with the record.
- [x] Backend model, API and permissions are implemented for the tenant and school/student record scope.
- [x] Portal experience includes the main checklist and restricted medical-profile happy paths, plus loading and empty states.
- [ ] Connected records, notifications, audit history and reporting implications are handled.
- [ ] API and browser E2E coverage proves the intended persona journey.

## Acceptance criteria

- An authorised staff user can select a school and student, see the existing checklist, and add a required or optional document requirement without uploading a file first.
- A document metadata record can be linked only when it belongs to the same tenant, represents the selected student and is not deleted.
- Staff can review a pending document as verified, rejected, expired or not applicable, with reviewer, timestamp and note retained.
- A medical profile can be loaded and saved without appearing in ordinary student list or directory payloads.
- Invalid or unauthorized requests return a clear error without exposing the student, document or medical data.
- The portal shows loading, empty, unavailable, permission-denied and save/retry states, and makes required evidence visually distinct from optional evidence.
- API and browser E2E tests prove tenant/school isolation, document-review recovery and restricted medical-profile access.

## Permissions, privacy and audit

Student document records use the existing student read/write permissions and remain tenant/school scoped. Medical fields are restricted to authorised staff and should receive a separate narrower permission before parent self-service is enabled. Document creation, review, rejection, expiry and medical-profile changes should emit audit events in the completion slice.

## Connected experience

Connects now to student and generic document metadata records. The student record remains available alongside guardian/family, enrollment and finance context. Follow-up work should connect missing-document state to admissions/enrollment gates, notifications, audit history and family/guardian access rules.

## Current evidence and next slice

Shipped in the 2026-10-30 slice:

- Prisma models and migration for `StudentDocumentRecord` and `StudentMedicalProfile`.
- Student API endpoints for listing/creating document requirements, reviewing document records, and reading/upserting the restricted medical profile.
- Portal route `/app/students/records` with school/student selection, evidence checklist, review action, requirement creation, and a restricted care-information form.
- Existing generic document metadata remains the storage boundary. A provider-specific binary upload/presigned-download adapter is intentionally not selected yet.

Remaining to reach complete: direct file upload/download UX, document/photo consent and storage policy, explicit audit events, reminders for missing/expiring evidence, guardian-family visibility rules, and API/browser E2E coverage.

## Pending items and later scope

Direct upload/download, photo consent and replacement history, missing/expiring-document reminders, audit events, guardian/family visibility rules, reporting, and API/browser E2E remain pending. Provider-specific storage, OCR, signatures and retention automation are later scope.

## Progress log

- 2026-10-30 — Imported from the research catalogue and assigned an initial repository-audit status.
- 2026-10-30 — Added the document checklist lifecycle, student medical/care profile, portal experience, Prisma migration `20261030170000_student_records_documents`, and API/portal build verification. Kept status Partial because binary storage, reminders, audit and E2E remain.

