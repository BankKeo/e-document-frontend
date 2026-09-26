# DMS Document Module UX/UI — Implementation Notes (Mock-first)

Covers DMS-DOC-001 … DMS-DOC-009. All flows run against an in-memory mock
document store so the UX can be reviewed before the backend is wired up.

---

## 1. Routes

| Route                       | Features                                   |
| --------------------------- | ------------------------------------------ |
| `/dms/documents`            | list + all document actions (Active/Archived/Trash views) |
| `/dms/documents/[id]`       | DMS-DOC-003 detail: content, versions, share |

The existing "Documents" sidebar item now opens the real module.

---

## 2. Architecture

```
src/features/dms-document/
├── types/              # DmsDocument, DocumentVersion, classification/status
├── schemas/document.schemas.ts  # create/edit form schema
├── mock/
│   ├── data.ts         # 8 documents with 1–3 versioned files each
│   └── service.ts      # documentService (swap point)
├── api/document.queries.ts  # react-query hooks
├── utils.ts            # downloadText, formatBytes
└── components/
    ├── document-list-page.tsx    # Active/Archived/Trash views + row actions
    ├── document-form-dialog.tsx  # DMS-DOC-001 / DMS-DOC-004
    ├── upload-version-dialog.tsx # DMS-DOC-002
    ├── document-detail.tsx       # DMS-DOC-003
    └── share-dialog.tsx          # DMS-DOC-007
```

---

## 3. Feature Walkthrough

### DMS-DOC-001 — Create Document
"New document" dialog: title, category, classification (Internal/Confidential/
Public), description/content. A document starts at **v1.0**, gets a generated
reference (DOC-2026-XXXX), and is owned by the current user.

### DMS-DOC-002 — Upload Document
"Upload version" picks a file and records name + size, goes to the next patch
version (v1.0 → v1.1), with an optional change note. The new version becomes the
latest, and download/preview use it.

### DMS-DOC-003 — View Document
Detail page: header (badges, ref, latest version), **Content** preview (latest
version), **Sharing** card, **Details** card, and full **version history**
table. Unknown ids show a graceful not-found state.

### DMS-DOC-004 — Edit Document
Edit dialog re-uses Create: editing the content creates a **new version**;
metadata-only edits keep the version. Email/file fields immutable.

### DMS-DOC-005 — Delete Document
Soft-delete moves the document to **Trash** (hidden from Active/Archived). A
document in the trash can be **Delete forever** or **Restore**.

### DMS-DOC-006 — Download Document
Downloads the latest version's content as a text file (client-side blob), both
from the list row menu and the detail page.

### DMS-DOC-007 — Share Document
Share dialog: add/remove people (by email) and copy a mock share link —
populated from `sharedWith`, shown on the detail page.

### DMS-DOC-008 — Archive Document
Active → Archived, kept for record. The list's **Archived** view shows it; it is
absent from the Active view.

### DMS-DOC-009 — Restore Document
Restores either archived or trashed documents back to **Active**.

---

## 4. Sandbox Notes

- Documents are soft-deleted (trash) and versioned; the mock store keeps state
  until a full page reload.
- Demo niceties: `doc_7` is pre-trashed (`doc_7`), `doc_4` is pre-archived; the
  owner is the demo user Malina.

---

## 5. Mock → Real Backend Swap

`documentService` (`src/features/dms-document/mock/service.ts`) is the single
seam:

| Mock method           | Expected endpoint                       |
| --------------------- | --------------------------------------- |
| `listDocuments` / `getDocument` | `GET /dms/documents[/:id]`     |
| `createDocument`      | `POST /dms/documents`                   |
| `updateDocument`      | `PUT /dms/documents/:id`                |
| `uploadVersion`       | `POST /dms/documents/:id/versions`      |
| `deleteDocument`      | `POST /dms/documents/:id/delete` (soft) |
| `deleteForever`       | `DELETE /dms/documents/:id`             |
| `archiveDocument` / `restoreDocument` | `POST /dms/documents/:id/archive` / `/restore` |
| `downloadContent`     | `GET /dms/documents/:id/download`       |
| `shareDocument` / `unshareDocument` | `POST /dms/documents/:id/share` |

---

## 6. Commands

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run build       # production build (all routes compile)
```

Verified green: `lint`, `typecheck`, `build` (Next 16, Turbopack). Routes smoke
tested: `/dms/documents`, `/dms/documents/doc_1` (200).