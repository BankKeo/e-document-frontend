# DMS Workspace Modules UX/UI — Implementation Notes (Mock-first)

Covers WF-001…WF-016 (workflow designer + nodes), FORM-001…012 (e-forms),
AI-001…014 (capture + OCR + AI), MEET-001…010 (meetings), and TASK-001…010
(tasks). All flows run against in-memory mock services.

---

## 1. Routes

| Route                     | Features                                        |
| ------------------------- | ----------------------------------------------- |
| `/dms/workflows` `[id]`   | WF-001…016 workflow designer + nodes            |
| `/dms/forms` `[id]`       | FORM-001…012 e-forms builder                    |
| `/dms/capture` `[id]`     | AI-001…014 document capture + OCR + AI           |
| `/dms/meetings` `[id]`    | MEET-001…010 meetings                           |
| `/dms/tasks` `[id]`       | TASK-001…010 tasks (Kanban board)               |

---

## 2. Architecture

```
src/features/dms-{workflow,form,capture,meeting,task}/
├── types/
├── mock/{data,service}.ts
├── api/*.queries.ts
├── schemas/*.schemas.ts    # (workflow, form)
├── utils.ts
└── components/
```

---

## 3. Feature Notes

### Workflow Designer + Nodes (WF)
Workflow definitions with an ordered node sequence. List page supports create,
edit, delete, publish/unpublish (WF-001…004), and version snapshots (WF-005).
Detail page renders the flow (WF-010 Start → … → WF-016 End) and allows editing.
Node types: Approval, Review, Conditional, Parallel, Notification (WF-011…015).

### E-Forms (FORM)
Form template list with create, publish/archive, and delete. The builder
(FORM-002) offers a field palette (Text, Number, Date, Dropdown, Checkbox,
File Upload, Signature — FORM-003…009), per-field label/placeholder/required,
condition text (FORM-010), and validation on save (FORM-011). A live preview
records a test submission (FORM-012).

### Capture + OCR + AI (AI)
Capture queue with KPIs and an upload dialog describing the automatic pipeline
(AI-001). Detail page shows the AI pipeline stepper (AI-002…AI-012): run OCR,
classify, see extracted text with inline search (AI-004, AI-014), edit extracted
fields to mark them manually corrected (AI-013), and review confidence scores
(AI-012).

### Meetings (MEET)
Schedule with date/time/room/attendees (MEET-001…003), agenda (MEET-004),
materials (MEET-005), minutes editing (MEET-006), attendee count and list
(MEET-003/007), decisions (MEET-008), and action items (MEET-009). History via
the list (MEET-010).

### Tasks (TASK)
Kanban board grouped by Open / In progress / Done / Overdue. Create and assign
(TASK-001/002), priority and due date (TASK-003/004), status changes (TASK-005),
comments (TASK-006), attachments (TASK-007), reminder request (TASK-008), and
overdue escalation flag (TASK-009). Detail page shows the full record.

---

## 4. Mock → Real Backend Swap

Each `dms-*/mock/service.ts` is the single seam; react-query layers stay
unchanged. Endpoint conventions:

| Module   | Expected base path                                  |
| -------- | --------------------------------------------------- |
| Workflow | `GET/POST /dms/workflows[/:id]` + `/versions`        |
| Forms    | `GET/POST /dms/forms[/:id]` + `/submissions`         |
| Capture  | `GET/POST /dms/capture[/:id]` + `/ocr`, `/classify`  |
| Meetings | `GET/POST /dms/meetings[/:id]` + `/minutes`          |
| Tasks    | `GET/POST /dms/tasks[/:id]` + `/comments`            |

Backend authorization remains authoritative.

---

## 5. Commands

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run build       # production build (all routes compile)
```

Verified green: `lint`, `typecheck`, `build`.