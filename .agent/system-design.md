# ERP UX/UI System Design & Implementation Specification

## 1. Project Context

Build a modern enterprise ERP web application consisting of:

1. Electronic Document Management System (e-DMS)
2. Procurement Management System (PMS)
3. Warehouse & Inventory Management System (WMS / IMS)

The application must feel like a **premium modern enterprise SaaS product**, not a traditional government/legacy ERP.

The visual direction should be:

- Minimal
- Modern
- Premium
- Luxury
- Professional
- Clean
- Calm
- Highly usable
- Information-dense without feeling cluttered
- Enterprise-grade
- Responsive
- Accessible

The UI should communicate:

> "A modern enterprise operating system."

Avoid making the interface look like an old accounting system, traditional ERP, admin template, or overly colorful dashboard.

---

# 2. Technology Requirements

Use:

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- shadcn/ui
- Lucide React icons
- React Hook Form
- Zod
- TanStack Query where appropriate
- Server Components by default
- Client Components only when interaction requires them

Follow modern Next.js architecture and best practices.

Do NOT introduce unnecessary UI libraries.

Prefer shadcn/ui primitives and compose them into reusable components.

---

# 3. Core UX Philosophy

The application should prioritize:

### Clarity

Users should immediately understand:

- Where they are
- What they can do
- What requires attention
- What has changed
- What needs approval
- What is pending

### Hierarchy

Important information should visually dominate secondary information.

Use:

```text
Page
 ├── Context / Breadcrumb
 ├── Page Title
 ├── Description
 ├── Primary Action
 ├── KPI / Summary
 ├── Main Content
 └── Secondary Information
```

Avoid putting too many competing elements above the fold.

---

# 4. Visual Direction

Design the application with a restrained luxury aesthetic.

## Color Philosophy

Use a mostly neutral palette.

Base:

- White
- Off-white
- Slate
- Zinc
- Neutral gray
- Charcoal

Use one restrained primary accent color.

Do NOT use:

- excessive gradients
- neon colors
- rainbow dashboards
- excessive blue
- excessive shadows
- colorful cards everywhere

Color should communicate meaning rather than decoration.

Example semantic colors:

```text
Success → Green
Warning → Amber
Error → Red
Info → Blue
Neutral → Gray
Primary → Brand Accent
```

Keep semantic colors subtle.

Prefer:

```text
soft background
+
dark text
+
thin border
+
small accent
```

instead of:

```text
bright background
+
huge colorful card
+
heavy shadow
```

---

# 5. Typography

Use a modern professional typography system.

Typography hierarchy:

```text
Display
Page Title
Section Title
Card Title
Body
Secondary Text
Caption
Metadata
```

Recommended visual behavior:

- Page titles: strong but not oversized
- Body text: highly readable
- Metadata: muted
- Numbers: clear and prominent
- Tables: compact but readable

Avoid extremely large typography.

Use font weight and spacing to establish hierarchy rather than excessive font size.

---

# 6. Layout

Use a modern enterprise application layout.

```text
┌──────────────────────────────────────────────────────────┐
│ Sidebar │ Top Navigation                                │
│         ├───────────────────────────────────────────────┤
│         │ Breadcrumb                                     │
│         │                                                │
│         │ Page Title                         Actions     │
│         │ Description                                    │
│         │                                                │
│         │ KPI / Summary                                  │
│         │                                                │
│         │ Main Content                                   │
│         │                                                │
│         │                                                │
└──────────────────────────────────────────────────────────┘
```

The layout must support:

- Collapsible sidebar
- Responsive navigation
- Mobile navigation
- Sticky header when appropriate
- Maximum content width
- Consistent page padding
- Consistent spacing

Do not make every page full-width unless the content requires it.

---

# 7. Sidebar Navigation

Create a premium collapsible sidebar.

Navigation structure:

```text
Dashboard

WORKSPACE

e-DMS
  Documents
  My Tasks
  Workflows
  Forms
  Meetings

PROCUREMENT
  Dashboard
  Procurement Plans
  Purchase Requisitions
  Suppliers
  Tenders
  Contracts
  Deliveries

WAREHOUSE
  Dashboard
  Inventory
  Inbound
  Outbound
  Warehouses
  Stock Transfers
  Assets

ANALYTICS

Administration
  Users
  Roles & Permissions
  Organization
  System Settings
  Audit Logs
```

Rules:

- Use Lucide icons
- Keep icons visually consistent
- Highlight the active route subtly
- Avoid excessive nested navigation
- Support collapsed mode
- Show tooltip when collapsed
- Group navigation logically
- Do not use large colorful icons

---

# 8. Top Navigation

Top navigation should contain:

```text
Breadcrumbs

Search

Notifications

Help

User Profile
```

Example:

```text
Procurement / Purchase Requisitions

                      Search   🔔   Help   User
```

User profile menu:

```text
My Profile
Preferences
Security
Sign Out
```

---

# 9. Global Search

Create a global command/search experience.

Use a command palette similar to modern SaaS applications.

Users should be able to search:

- Documents
- Suppliers
- Purchase Requisitions
- Contracts
- Inventory Items
- Assets
- Users

Support keyboard shortcut:

```text
⌘ K
```

or

```text
Ctrl K
```

Search should provide categorized results.

Example:

```text
Search "ABC"

Documents
  ABC Contract 2026

Suppliers
  ABC Trading

Purchase Requests
  PR-2026-00231

Inventory
  ABC Printer Toner
```

---

# 10. Dashboard UX

Do NOT create a dashboard containing dozens of charts.

Use a focused executive dashboard.

Example:

```text
Good morning, Malina

Here's what's happening across your organization.

[ Pending Approvals ] [ Active PRs ] [ Low Stock ] [ Documents ]

------------------------------------------------------------

Attention Required

┌─────────────────────────────────────────────────────────┐
│ 12 documents waiting for approval                       │
│ 5 purchase requisitions require review                  │
│ 3 contracts expiring soon                               │
│ 8 inventory items below reorder level                   │
└─────────────────────────────────────────────────────────┘

------------------------------------------------------------

Procurement Overview

[ Chart ]

------------------------------------------------------------

Recent Activity

Timeline / Activity Feed
```

Dashboard priorities:

1. Actions requiring attention
2. Important KPIs
3. Trends
4. Recent activity

---

# 11. KPI Cards

Use minimal KPI cards.

Example:

```text
┌─────────────────────────┐
│ Pending Approvals       │
│                         │
│ 24                      │
│ ↑ 8.2% from last month  │
└─────────────────────────┘
```

Rules:

- No giant icons
- No excessive gradients
- No huge colored backgrounds
- Use subtle borders
- Use typography for emphasis
- Use small trend indicators

---

# 12. Data Table Design

Tables are extremely important for ERP.

Create a reusable enterprise DataTable.

Required features:

- Sorting
- Filtering
- Search
- Pagination
- Column visibility
- Row selection
- Bulk actions
- Export
- Density control
- Sticky header
- Responsive behavior

Example:

```text
Purchase Requisitions

Search...     Filter     Columns     Export     + New PR

┌────┬──────────┬──────────┬──────────┬──────────┬────────┐
│ □  │ PR No.   │ Requester│ Amount   │ Status   │ Date   │
├────┼──────────┼──────────┼──────────┼──────────┼────────┤
│ □  │ PR-00123 │ John     │ $12,500  │ Pending  │ Sep 20 │
│ □  │ PR-00124 │ Anna     │ $8,200   │ Approved │ Sep 21 │
└────┴──────────┴──────────┴──────────┴──────────┴────────┘
```

Status should use subtle badges.

---

# 13. Forms

Forms should feel extremely clean.

Use:

```text
Label
Input
Helper Text
Validation
```

Avoid putting everything inside cards.

For complex forms:

```text
General Information

Supplier Information

Items

Delivery

Attachments

Approval
```

Use sections with clear hierarchy.

---

# 14. Multi-Step Forms

For complicated processes use a stepper.

Example Purchase Requisition:

```text
1. Request
      ↓
2. Items
      ↓
3. Budget
      ↓
4. Attachments
      ↓
5. Review
      ↓
6. Submit
```

The user must always understand:

- Current step
- Completed steps
- Remaining steps
- What information is required

---

# 15. Detail Pages

Use a consistent detail page pattern.

Example:

```text
← Purchase Requisitions

PR-2026-00123

Pending Approval                         [Approve] [Reject]

Requester: John Smith
Department: Finance
Created: September 24, 2026

------------------------------------------------

Overview
...

Items
...

Documents
...

Approval Timeline
...

Activity
...
```

Use tabs when the detail page contains many independent sections.

Example:

```text
Overview
Items
Documents
Approvals
Activity
```

---

# 16. Approval UX

Approval is a core concept throughout the ERP.

Create a reusable approval component.

Example:

```text
Approval Progress

✓ Submitted
│
✓ Department Review
│
● Finance Approval
│
○ Director Approval
│
○ Completed
```

Each approval step should display:

- Approver
- Role
- Date
- Status
- Comment

Actions:

```text
Approve
Reject
Request Changes
Delegate
```

Dangerous actions require confirmation.

---

# 17. Activity Timeline

Create a reusable activity timeline.

Example:

```text
Today

● 10:42 AM
John approved PR-00123

● 09:31 AM
Anna uploaded quotation.pdf

Yesterday

● 04:21 PM
Finance requested changes
```

Use subtle timeline indicators.

---

# 18. e-DMS UX

Documents should feel like a modern document platform.

Main page:

```text
Documents

Search documents...

All Documents
My Documents
Shared With Me
Pending Review
Archived

────────────────────────────

Folders

Contracts
Policies
Procurement
Finance
HR

────────────────────────────

Recent Documents
```

Document detail:

```text
Contract_2026_001.pdf

[Preview] [Download] [Share] [More]

Document Information
Version
Owner
Department
Created
Modified
Classification

Approval
Version History
Activity
```

---

# 19. Document Preview

Create a professional document preview interface.

```text
┌────────────────────────────────────────────────────────┐
│ Contract.pdf                    Download  Share  More   │
├───────────────┬────────────────────────────────────────┤
│ Pages         │                                        │
│               │            Document Preview             │
│  1            │                                        │
│  2            │                                        │
│  3            │                                        │
└───────────────┴────────────────────────────────────────┘
```

Support:

- PDF
- Images
- Office documents where possible
- Zoom
- Page navigation
- Download
- Version history

---

# 20. Workflow Builder

Create a visual workflow builder.

Style:

- Minimal
- Professional
- Similar to modern workflow products
- Clear node hierarchy

Nodes:

```text
Start
Approval
Review
Condition
Notification
Task
End
```

Example:

```text
       ┌─────────┐
       │  Start  │
       └────┬────┘
            │
       ┌────▼─────┐
       │ Approval │
       └────┬─────┘
            │
       ┌────▼─────┐
       │ Condition│
       └──┬────┬──┘
          │    │
        Yes     No
          │    │
          ▼    ▼
       Approved Reject
```

Use React Flow if a visual node editor is required.

---

# 21. Procurement UX

Procurement should emphasize process visibility.

Dashboard:

```text
Procurement

[ Total Spend ]
[ Active PR ]
[ Pending Approval ]
[ Active Tender ]

Procurement Pipeline

Planning
   ↓
PR
   ↓
Tender
   ↓
Evaluation
   ↓
Contract
   ↓
Delivery
```

Users should be able to visually understand where every procurement process is.

---

# 22. Supplier Management

Supplier list:

```text
Suppliers

Search suppliers...      Filter       + Add Supplier

Supplier
Category
Status
Performance
Active Contracts
Last Activity
```

Supplier detail:

```text
ABC Trading Co.

Verified Supplier                       Active

Overview
Contacts
Documents
Contracts
Purchase Orders
Performance
Activity
```

---

# 23. Purchase Requisition UX

Make PR creation extremely simple.

```text
New Purchase Requisition

Request Information
────────────────────

Department
Requester
Required Date
Purpose

Items
────────────────────

Item        Qty     Estimated Price

+ Add Item

Budget
────────────────────

Budget Code
Available Budget
Requested Amount

Attachments
────────────────────

Upload supporting documents

                    Save Draft
                    Submit Request
```

---

# 24. Tender UX

Tender page should communicate the entire tender lifecycle.

```text
Tender #T-2026-001

Office Equipment Procurement

Status: Evaluation

Timeline

Published
   ✓
Bid Submission
   ✓
Bid Opening
   ✓
Technical Evaluation
   ●
Financial Evaluation
   ○
Award
   ○

Bidders

Evaluation

Documents

Activity
```

---

# 25. WMS UX

Warehouse UI should prioritize operational speed.

Avoid overly decorative UI.

Warehouse dashboard:

```text
Warehouse

[ Total Stock ]
[ Low Stock ]
[ Pending Receiving ]
[ Pending Issue ]

────────────────────────

Inbound
12 deliveries

Outbound
8 requests

Low Stock
14 items

────────────────────────

Recent Inventory Activity
```

---

# 26. Inventory Table

```text
Inventory

Search SKU / Item...

SKU
Item
Warehouse
Location
Available
Reserved
Reorder Level
Status
```

Example:

```text
PRT-001
HP Laser Printer Toner
Main Warehouse
A-02-03
42
8
20
In Stock
```

Use color only for meaningful status.

---

# 27. Warehouse Operations

Receiving:

```text
Receive Goods

Purchase Order
Supplier

Expected Items

Item        Expected    Received

Printer     20          [ 20 ]
Toner       50          [ 48 ]

[Scan Barcode]

Damaged Items

[Confirm Receiving]
```

Picking:

```text
Pick Order

Order #OUT-00123

Location      Item       Qty

A-01-02       Printer    5
B-02-03       Toner     10

[Start Picking]

[Scan Item]

[Confirm]
```

The UI should work well on tablets and warehouse devices.

---

# 28. Asset Management UX

Asset list:

```text
Assets

Asset ID
Asset Name
Category
Location
Custodian
Condition
Status
```

Asset detail:

```text
Asset #AST-00123

MacBook Pro 16"

Assigned To
Malina Phetxomphou

Location
IT Department

Status
Active

Purchase Information
Warranty
Maintenance
Transfer History
Documents
```

---

# 29. Empty States

Never show blank pages.

Create meaningful empty states.

Example:

```text
No purchase requisitions yet

Create your first purchase requisition
to start the procurement process.

[ Create Purchase Requisition ]
```

Avoid overly illustrated cartoon-style empty states.

Keep them minimal and premium.

---

# 30. Loading States

Use skeleton loading.

Do not show generic:

```text
Loading...
```

unless necessary.

Example:

```text
┌──────────────┐
│ ▬▬▬▬▬▬▬▬▬▬ │
│ ▬▬▬▬▬▬     │
│ ▬▬▬▬▬▬▬▬   │
└──────────────┘
```

Use shadcn Skeleton.

---

# 31. Error States

Errors must explain:

1. What happened
2. Why it happened if known
3. What the user can do

Example:

```text
Unable to load purchase requisitions

Something went wrong while retrieving the data.

[ Try Again ]
```

Do not expose technical stack traces to users.

---

# 32. Confirmation Dialogs

Use confirmation dialogs for destructive operations.

Example:

```text
Delete Supplier?

This action cannot be undone.
All supplier-related information will remain
in the audit history.

Cancel       Delete Supplier
```

For dangerous operations require stronger confirmation when appropriate.

---

# 33. Toast Notifications

Use toast notifications for lightweight feedback.

Examples:

```text
✓ Purchase requisition created

✓ Supplier updated

✓ Document uploaded

✓ Workflow published
```

Don't use toast messages for information users need to study or act on.

---

# 34. Responsive Design

The application must work across:

```text
Desktop
Laptop
Tablet
Mobile
```

Desktop:

```text
Sidebar + Content
```

Tablet:

```text
Collapsed Sidebar + Content
```

Mobile:

```text
Top Bar
Content
Bottom / Drawer Navigation
```

Tables on mobile should transform intelligently rather than simply overflowing.

---

# 35. Accessibility

Follow WCAG principles.

Ensure:

- Keyboard navigation
- Visible focus states
- Proper labels
- Semantic HTML
- Sufficient contrast
- Screen reader support
- Accessible dialogs
- Accessible dropdowns
- Accessible tables
- Accessible forms

Never rely on color alone to communicate status.

---

# 36. Dark Mode

Support dark mode.

Dark mode should not simply invert colors.

Use a carefully designed dark neutral palette.

Example:

```text
Background → near-black
Surface → dark charcoal
Border → subtle gray
Text → off-white
Secondary Text → muted gray
Accent → restrained brand color
```

Maintain the same visual hierarchy as light mode.

---

# 37. Component Architecture

Create reusable components instead of designing every page independently.

Recommended structure:

```text
components/
│
├── ui/
│   ├── Button
│   ├── Input
│   ├── Select
│   ├── Dialog
│   ├── Sheet
│   ├── Tabs
│   ├── Badge
│   ├── Tooltip
│   └── ...
│
├── layout/
│   ├── AppShell
│   ├── Sidebar
│   ├── Topbar
│   ├── Breadcrumbs
│   └── MobileNavigation
│
├── data-table/
│   ├── DataTable
│   ├── DataTableToolbar
│   ├── DataTablePagination
│   ├── DataTableFilter
│   └── DataTableColumns
│
├── dashboard/
│   ├── KpiCard
│   ├── ActivityTimeline
│   ├── AttentionPanel
│   └── ChartCard
│
├── workflow/
│   ├── ApprovalTimeline
│   ├── WorkflowStatus
│   └── WorkflowBuilder
│
├── documents/
│   ├── DocumentCard
│   ├── DocumentPreview
│   ├── DocumentUploader
│   └── DocumentVersionHistory
│
├── procurement/
│   ├── SupplierStatus
│   ├── ProcurementPipeline
│   ├── PurchaseRequestSummary
│   └── TenderTimeline
│
└── warehouse/
    ├── StockStatus
    ├── InventorySummary
    ├── WarehouseLocation
    ├── ReceivingForm
    └── PickingForm
```

---

# 38. Design Tokens

Create centralized design tokens.

Do not hardcode random values throughout the application.

Define:

```text
Colors
Spacing
Radius
Typography
Shadows
Borders
Transitions
Z-index
```

Use Tailwind/shadcn conventions.

Keep border radius relatively restrained.

Avoid excessive rounded cards.

Preferred:

```text
rounded-md
rounded-lg
```

Avoid making every component:

```text
rounded-full
```

---

# 39. Cards

Cards should be used intentionally.

Good:

```text
KPI
Summary
Dashboard widgets
Important grouped information
```

Avoid:

```text
Card inside card inside card
```

The page should breathe.

Use borders and spacing instead of shadows wherever possible.

---

# 40. Tables vs Cards

Use:

### Tables

For:

- Suppliers
- Documents
- PRs
- Contracts
- Inventory
- Assets
- Users

Use:

### Cards

For:

- KPIs
- Summaries
- Alerts
- Dashboard insights

Do not convert every data table into cards.

---

# 41. UX Rules

Follow these rules throughout the entire application:

1. One primary action per page.
2. Keep secondary actions visually secondary.
3. Never overwhelm the user with options.
4. Use progressive disclosure.
5. Keep forms short where possible.
6. Preserve user input.
7. Always show system status.
8. Use confirmation for destructive actions.
9. Make approval status obvious.
10. Make search and filtering powerful.
11. Keep navigation predictable.
12. Avoid unnecessary animations.
13. Prefer subtle transitions.
14. Never sacrifice usability for visual aesthetics.
15. Maintain consistency across all modules.

---

# 42. Animation

Use subtle animations only.

Good:

- Dialog transition
- Dropdown transition
- Sidebar transition
- Hover transition
- Skeleton loading
- Page transition where appropriate

Avoid:

- Large animated backgrounds
- Excessive bouncing
- Decorative animations
- Slow transitions

The application should feel:

> Fast, precise and expensive.

---

# 43. AI Implementation Rules

When implementing UI:

1. Inspect the existing code before modifying it.
2. Reuse existing components.
3. Do not duplicate components.
4. Follow the established design tokens.
5. Follow shadcn/ui conventions.
6. Keep components composable.
7. Keep business logic separate from UI.
8. Do not put API calls directly everywhere.
9. Use typed interfaces.
10. Validate forms with Zod.
11. Handle loading states.
12. Handle empty states.
13. Handle errors.
14. Handle permissions.
15. Handle responsive behavior.
16. Ensure accessibility.

---

# 44. Important: Do Not Overdesign

The UI must NOT become:

- Dribbble-style concept UI
- Dashboard with excessive charts
- Glassmorphism everywhere
- Excessive gradients
- Excessive shadows
- Excessive rounded cards
- Huge typography
- Excessive animations
- Colorful admin template

The goal is:

> Minimal + Premium + Enterprise + Functional.

Think:

```text
Apple
+
Linear
+
Notion
+
Stripe
+
Modern enterprise software
```

but do NOT copy any company's UI directly.

---

# 45. Implementation Strategy

Do NOT implement all modules at once.

Implement in this order:

## Phase 1 — Design System

Build:

```text
AppShell
Sidebar
Topbar
Typography
Colors
Buttons
Inputs
Dialogs
Sheets
Tabs
Badges
Tables
Forms
Toast
Command Menu
Empty States
Loading States
Error States
```

## Phase 2 — Core Application

Build:

```text
Dashboard
Users
Roles
Organization
Notifications
Audit Logs
```

## Phase 3 — e-DMS

Build:

```text
Documents
Document Detail
Document Preview
Upload
Version History
Workflow
Tasks
Meetings
```

## Phase 4 — PMS

Build:

```text
Procurement Dashboard
Suppliers
Procurement Plans
Purchase Requisitions
Tender
Contracts
Deliveries
```

## Phase 5 — WMS

Build:

```text
Warehouse Dashboard
Inventory
Inbound
Outbound
Stock Transfer
Stock Count
Assets
```

## Phase 6 — Analytics

Build:

```text
Procurement Analytics
Inventory Analytics
Document Analytics
Executive Dashboard
```

---

# 46. Definition of Done

A page is NOT complete when the UI looks good.

Every feature must include:

```text
✓ Desktop UI
✓ Tablet UI
✓ Mobile UI
✓ Loading state
✓ Empty state
✓ Error state
✓ Validation
✓ Permission handling
✓ Accessibility
✓ Responsive behavior
✓ Keyboard navigation
✓ API integration
✓ Type safety
✓ Error handling
✓ Success feedback
```

---

# 47. Final Instruction to the AI Agent

Before writing code:

1. Inspect the existing Next.js project.
2. Inspect package.json.
3. Inspect the current shadcn configuration.
4. Inspect Tailwind configuration.
5. Inspect the existing component structure.
6. Identify reusable components.
7. Do not replace working infrastructure unnecessarily.
8. Create a UI architecture plan.
9. Create the design tokens.
10. Implement the shared AppShell first.
11. Implement the reusable components.
12. Implement one module at a time.
13. After each module, verify consistency with the design system.
14. Do not create duplicated UI patterns.
15. Do not invent unnecessary dependencies.

When implementing each page, first define:

```text
Page Purpose
↓
User Roles
↓
Primary User Actions
↓
Information Hierarchy
↓
Layout
↓
Components
↓
States
↓
Responsive Behavior
↓
Accessibility
↓
Implementation
```

The final product should feel like a **premium enterprise operating platform**, with a consistent design language across e-DMS, PMS and WMS.

The user should feel that all three systems are part of **one unified ERP platform**, not three separate applications.
