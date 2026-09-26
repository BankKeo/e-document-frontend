# DMS Versioning Module UX/UI — Implementation Notes (Mock-first)

Covers DMS-VER-001 … DMS-VER-005. All flows run against the shared in-memory
document mock store so the UX can be reviewed before the backend is wired up.

---

## 1. Routes

| Route                     | Features                                  |
| ------------------------- | ----------------------------------------- |
| `/dms/versioning`         | Version history hub: KPIs, document filter, history table, and all version actions |

The existing "Documents" detail page links to `/dms/versioning` from its
**Version history** section header.

---

## 2. Architecture

```
src/features/dms-versioning/
├── types/              # VersionRegistryRow, VersionComparison, DiffLine
├── api/versioning.queries.ts  # react-query hooks
├── mock/service.ts     # versioningService (swap point)
├── utils.ts            # diffLines, formatBytes
└── components/
    ├── versioning-page.tsx        # DMS-VER-005 hub + row actions
    ├── create-version-dialog.tsx  # DMS-VER-001
    ├── view-version-dialog.tsx    # DMS-VER-002
    ├── compare-versions-dialog.tsx# DMS-VER-003 (side-by-side diff)
    └── restore-version-dialog.tsx # DMS-VER-004
```

The versioning registry is derived from the document mock store
(`src/features/dms-document/mock/service.ts`), so documents created or edited
in `/dms/documents` appear here immediately and stay in sync.

---

## 3. Feature Walkthrough

### DMS-VER-001 — Create Version
"Create version" dialog: pick a document, choose a file, add an optional change
note. The next minor version is shown before saving. The new version becomes the
current one; older versions keep their history.

### DMS-VER-002 — View Versions
Row action (eye icon) opens a read-only detail: version number, relative
position (e.g. "2 of 3"), actor, timestamp, file name/size, change note, and a
content preview.

### DMS-VER-003 — Compare Versions
Side-by-side diff between any two versions of the same document. Select an
"earlier" and a "later" version; the dialog renders a line-level diff
(added/removed highlighting) plus added/removed counts and the file change.

### DMS-VER-004 — Restore Version
Row action (restore icon) on a superseded version. Confirmation dialog explains
that restoring copies that version's file and content into a **new** current
version, keeping the history immutable. After confirm a new version with a
"Restored from vX.Y" note is prepended.

### DMS-VER-005 — Version History
The hub lists every version across all versioned documents, newest first, with a
document filter and search. KPI cards summarize documents versioned, total
versions, restored count, and latest activity. Each row is marked **Current** or
shown as "n of total".

---

## 4. Sandbox Notes

- The registry reads from the shared document store; state persists until a full
  page reload.
- `doc_2` has three versions, so it is the richest target for the compare demo.
- Restore is disabled on the current version; compare is disabled for documents
  with a single version.

---

## 5. Mock → Real Backend Swap

`versioningService` (`src/features/dms-versioning/mock/service.ts`) is the single
seam. The react-query layer in `api/versioning.queries.ts` stays unchanged.

| Mock method          | Expected endpoint                                  |
| -------------------- | -------------------------------------------------- |
| `listVersionRegistry` | `GET /dms/documents/versions` (or paginated history endpoint) |
| `listDocuments`       | `GET /dms/documents`                               |
| `getDocument`         | `GET /dms/documents/:id`                           |
| `createVersion`       | `POST /dms/documents/:id/versions`                 |
| `compareVersions`     | `GET /dms/documents/:id/compare?left=:a&right=:b`  |
| `restoreVersion`      | `POST /dms/documents/:id/versions/:versionId/restore` |

Backend authorization remains authoritative; the UI hides actions only for
usability.

---

## 6. Commands

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run build       # production build (all routes compile)
```

Verified green: `lint`, `typecheck`, `build`. Route smoke tested:
`/dms/versioning` (200).