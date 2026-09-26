# DMS Metadata Module UX/UI — Implementation Notes (Mock-first)

Covers DMS-META-001 … DMS-META-008. All metadata management flows run against
an in-memory mock so the UX can be reviewed before the backend is wired up.

---

## 1. Routes

| Route                          | Features                                  |
| ------------------------------ | ----------------------------------------- |
| `/dms/metadata`                | document metadata table + edit dialog (all 8 fields) |
| `/dms/metadata/vocabularies`   | numbering, types, categories, departments, authors, confidentiality, tags |

Shared sub-navigation (`MetadataNav`).

---

## 2. Architecture

```
src/features/dms-metadata/
├── types/                          # MetaRecord, DocumentType, Category, Author,
│                                   #   TagDefinition, ConfidentialityLevel, NumberingScheme
├── schemas/metadata.schemas.ts     # zod schemas (record fields + vocabularies)
├── mock/
│   ├── data.ts                     # 8 metadata records + vocabularies
│   └── service.ts                  # metadataService (swap point)
├── api/metadata.queries.ts         # react-query hooks
└── components/
    ├── metadata-nav.tsx            # module sub-navigation
    ├── metadata-page.tsx           # document metadata table (001–008)
    ├── meta-record-dialog.tsx      # edit metadata incl. tag toggle chips
    └── vocabulary-page.tsx         # vocabulary management (001–008 catalogs)
```

---

## 3. Feature Walkthrough

The **metadata page** shows every document with all eight fields and an edit
dialog; the **vocabularies page** manages the source lists they draw from.

| # | Field | Where it lives |
|---|-------|----------------|
| 001 | **Document Number** | Doc ref column (`DOC-2026-0001`); numbering scheme editor in Vocabularies (prefix, include-year, next counter + live preview) |
| 002 | **Document Type** | Column + CRUD table (Plan, Contract, Report, …) |
| 003 | **Category** | Column + CRUD table (Procurement, Legal, Technical, …) |
| 004 | **Department** | Column + reference list with per-department document counts (managed in Organization) |
| 005 | **Author** | Column + CRUD authors (name, email, department) |
| 006 | **Creation Date** | Column with a creation-year filter (All / 2026 / 2025) |
| 007 | **Confidentiality Level** | Badge column + read-only policy list (Internal / Confidential / Public) with filter |
| 008 | **Tags** | Toggle-chip editor in the metadata dialog + CRUD tag list with usage counts |

Edit metadata: type, category, department, author, confidentiality (selects) and
tag chips; saving updates the record and tag counts.

---

## 4. Sandbox Notes

- `doc_8` in metadata is read-only (mirrors the pre-trashed document in the DMS
  module).
- Numbering scheme is isolated to this module; it records the "next" counter so
  the preview changes as you type.
- All stores reset on full page reload.

---

## 5. Mock → Real Backend Swap

`metadataService` (`src/features/dms-metadata/mock/service.ts`) is the single
seam:

| Mock method                | Expected endpoint                      |
| -------------------------- | -------------------------------------- |
| `listMetaRecords` / `updateMetaRecord` | `GET/PUT /dms/metadata`        |
| `listDocumentTypes` / CRUD | `/dms/metadata/types`                  |
| `listCategories` / CRUD    | `/dms/metadata/categories`             |
| `listAuthors` / CRUD       | `/dms/metadata/authors`                |
| `listDepartments`          | `/organization/departments` (reused)   |
| `listConfidentialityLevels` | `/dms/metadata/confidentiality`        |
| `listTags` / `addTag` / `deleteTag` | `/dms/metadata/tags`          |
| `getNumberingScheme` / `saveNumberingScheme` | `/dms/metadata/numbering`  |

---

## 6. Commands

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run build       # production build (all routes compile)
```

Verified green: `lint`, `typecheck`, `build` (Next 16, Turbopack). Routes smoke
tested: `/dms/metadata`, `/dms/metadata/vocabularies` (200).