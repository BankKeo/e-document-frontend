import type {
  ApprovalEvent,
  DataChangeEntry,
  DocumentHistoryEntry,
  InventoryEntry,
  LoginEvent,
  ProcurementEvent,
  UserActivityEvent,
} from "../types";

function ago(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

const NETWORK = "10.24.0.0/16";

export const MOCK_LOGIN_EVENTS: LoginEvent[] = [
  { id: "login_01", at: ago(4), actor: "Malina Phetxomphou", actorEmail: "malina@acme.gov", status: "Success", method: "Password", device: "MacBook Pro", browser: "Chrome 128", os: "macOS 15", location: "Vientiane, LA", ip: "10.24.0.18", reason: "" },
  { id: "login_02", at: ago(22), actor: "Kham Anoulack", actorEmail: "kham@acme.gov", status: "Success", method: "MFA", device: "ThinkPad T14", browser: "Edge 127", os: "Windows 11", location: "Vientiane, LA", ip: "172.16.3.41", reason: "" },
  { id: "login_03", at: ago(95), actor: "Aloun Sisavath", actorEmail: "aloun@acme.gov", status: "Failed", method: "Password", device: "iPhone 15", browser: "Safari", os: "iOS 18", location: "Vientiane, LA", ip: "10.24.0.92", reason: "Incorrect password" },
  { id: "login_04", at: ago(140), actor: "Anousone Vongsa", actorEmail: "anousone@acme.gov", status: "Success", method: "MFA", device: "Dell OptiPlex", browser: "Firefox 129", os: "Ubuntu 24.04", location: "Savannakhet, LA", ip: "172.16.9.7", reason: "" },
  { id: "login_05", at: ago(180), actor: "Bounthavy Philavong", actorEmail: "bounthavy@acme.gov", status: "Success", method: "SSO", device: "MacBook Pro", browser: "Safari", os: "macOS 14", location: "Vientiane, LA", ip: "10.24.0.31", reason: "" },
  { id: "login_06", at: ago(260), actor: "Viengkham Saysana", actorEmail: "viengkham@acme.gov", status: "Failed", method: "MFA", device: "ThinkPad T14", browser: "Chrome 127", os: "Windows 11", location: "Vientiane, LA", ip: "172.16.3.55", reason: "Invalid 2FA code" },
  { id: "login_07", at: ago(430), actor: "Malina Phetxomphou", actorEmail: "malina@acme.gov", status: "Success", method: "Session", device: "MacBook Pro", browser: "Chrome 128", os: "macOS 15", location: "Vientiane, LA", ip: "10.24.0.18", reason: "" },
  { id: "login_08", at: ago(960), actor: "Ketsana Oudomlith", actorEmail: "ketsana@acme.gov", status: "Failed", method: "Password", device: "Dell OptiPlex", browser: "Chrome 126", os: "Windows 10", location: "Vientiane, LA", ip: "172.16.9.33", reason: "Account disabled" },
  { id: "login_09", at: ago(1500), actor: "Phoutthasone Keomany", actorEmail: "phoutthasone@acme.gov", status: "Success", method: "MFA", device: "Galaxy Tab S9", browser: "Chrome 127", os: "Android 14", location: "Savannakhet, LA", ip: "172.16.9.71", reason: "" },
];

export const MOCK_ACTIVITY_EVENTS: UserActivityEvent[] = [
  { id: "act_01", at: ago(6), actor: "Malina Phetxomphou", actorEmail: "malina@acme.gov", module: "Administration", action: "Updated", target: "User · Ketsana Oudomlith", detail: "Changed role to Viewer", ip: "10.24.0.18" },
  { id: "act_02", at: ago(18), actor: "Kham Anoulack", actorEmail: "kham@acme.gov", module: "Procurement", action: "Created", target: "Purchase Requisition PR-2026-0142", detail: "Submitted for approval", ip: "172.16.3.41" },
  { id: "act_03", at: ago(31), actor: "Viengkham Saysana", actorEmail: "viengkham@acme.gov", module: "DMS", action: "Uploaded", target: "Document · quotation.pdf", detail: "Version 1.0", ip: "172.16.3.55" },
  { id: "act_04", at: ago(48), actor: "Anousone Vongsa", actorEmail: "anousone@acme.gov", module: "Procurement", action: "Approved", target: "Purchase Requisition PR-2026-0142", detail: "Level 2 approval", ip: "172.16.9.7" },
  { id: "act_05", at: ago(70), actor: "Phoutthasone Keomany", actorEmail: "phoutthasone@acme.gov", module: "Warehouse", action: "Adjusted", target: "Item · Concrete C40 (SKU-220)", detail: "+120 units", ip: "172.16.9.71" },
  { id: "act_06", at: ago(120), actor: "Malina Phetxomphou", actorEmail: "malina@acme.gov", module: "Auth", action: "Signed out", target: "Session", detail: "All sessions revoked", ip: "10.24.0.18" },
  { id: "act_07", at: ago(240), actor: "Aloun Sisavath", actorEmail: "aloun@acme.gov", module: "Procurement", action: "Published", target: "Tender RFQ-2026-011", detail: "Opened for bids", ip: "10.24.0.92" },
  { id: "act_08", at: ago(380), actor: "Bounthavy Philavong", actorEmail: "bounthavy@acme.gov", module: "Administration", action: "Exported", target: "Audit · login history", detail: "CSV download", ip: "10.24.0.31" },
  { id: "act_09", at: ago(640), actor: "Somsack Inthavong", actorEmail: "somsack@acme.gov", module: "DMS", action: "Downloaded", target: "Document · contract-v2.pdf", detail: "Version 2.1", ip: "172.16.4.12" },
];

export const MOCK_DOCUMENT_EVENTS: DocumentHistoryEntry[] = [
  { id: "doc_01", at: ago(15), actor: "Viengkham Saysana", actorEmail: "viengkham@acme.gov", document: "quotation.pdf", documentRef: "DOC-2026-0091", action: "Edited", version: "v1.1", summary: "Updated total amount", ip: "172.16.3.55" },
  { id: "doc_02", at: ago(40), actor: "Kham Anoulack", actorEmail: "kham@acme.gov", document: "required-spec.pdf", documentRef: "DOC-2026-0088", action: "Created", version: "v1.0", summary: "Uploaded for PR-2026-0142", ip: "172.16.3.41" },
  { id: "doc_03", at: ago(75), actor: "Malina Phetxomphou", actorEmail: "malina@acme.gov", document: "contract-moa.docx", documentRef: "DOC-2026-0085", action: "Approved", version: "v2.0", summary: "Approved final version", ip: "10.24.0.18" },
  { id: "doc_04", at: ago(150), actor: "Somsack Inthavong", actorEmail: "somsack@acme.gov", document: "contract-v2.pdf", documentRef: "DOC-2026-0085", action: "Downloaded", version: "v2.1", summary: "Downloaded by Legal", ip: "172.16.4.12" },
  { id: "doc_05", at: ago(260), actor: "Anousone Vongsa", actorEmail: "anousone@acme.gov", document: "budget-notes.xlsx", documentRef: "DOC-2026-0071", action: "Viewed", version: "v1.3", summary: "Opened for review", ip: "172.16.9.7" },
  { id: "doc_06", at: ago(420), actor: "Aloun Sisavath", actorEmail: "aloun@acme.gov", document: "tender-annex.pdf", documentRef: "DOC-2026-0066", action: "Edited", version: "v1.2", summary: "Added annex correction", ip: "10.24.0.92" },
  { id: "doc_07", at: ago(900), actor: "System", actorEmail: "sys@acme.gov", document: "obsolete-report.pdf", documentRef: "DOC-2026-0041", action: "Deleted", version: "v1.0", summary: "Purged per retention policy", ip: NETWORK },
];

export const MOCK_APPROVAL_EVENTS: ApprovalEvent[] = [
  { id: "apr_01", at: ago(48), actor: "Anousone Vongsa", actorEmail: "anousone@acme.gov", documentType: "Purchase Requisition", documentRef: "PR-2026-0142", requester: "Kham Anoulack", decision: "Approved", level: 2, comment: "Within budget allocation.", ip: "172.16.9.7" },
  { id: "apr_02", at: ago(52), actor: "Kham Anoulack", actorEmail: "kham@acme.gov", documentType: "Purchase Requisition", documentRef: "PR-2026-0142", requester: "Kham Anoulack", decision: "Requested", level: 1, comment: "Submitted for approval.", ip: "172.16.3.41" },
  { id: "apr_03", at: ago(90), actor: "Malina Phetxomphou", actorEmail: "malina@acme.gov", documentType: "Purchase Order", documentRef: "PO-2026-0311", requester: "Aloun Sisavath", decision: "Approved", level: 3, comment: "Approved with vendor confirmed.", ip: "10.24.0.18" },
  { id: "apr_04", at: ago(150), actor: "Anousone Vongsa", actorEmail: "anousone@acme.gov", documentType: "Stock Adjustment", documentRef: "ADJ-2026-077", requester: "Phoutthasone Keomany", decision: "Approved", level: 2, comment: "", ip: "172.16.9.7" },
  { id: "apr_05", at: ago(220), actor: "Kham Anoulack", actorEmail: "kham@acme.gov", documentType: "Document Approval", documentRef: "DOC-2026-0085", requester: "Viengkham Saysana", decision: "Approved", level: 1, comment: "Looks good.", ip: "172.16.3.41" },
  { id: "apr_06", at: ago(300), actor: "Anousone Vongsa", actorEmail: "anousone@acme.gov", documentType: "Purchase Requisition", documentRef: "PR-2026-0137", requester: "Latsamy Vongsak", decision: "Sent back", level: 2, comment: "Missing justification for unit price.", ip: "172.16.9.7" },
  { id: "apr_07", at: ago(520), actor: "Malina Phetxomphou", actorEmail: "malina@acme.gov", documentType: "Contract", documentRef: "CON-2026-0018", requester: "Aloun Sisavath", decision: "Rejected", level: 3, comment: "Refer back to Legal for the liquidated damages clause.", ip: "10.24.0.18" },
];

export const MOCK_PROCUREMENT_EVENTS: ProcurementEvent[] = [
  { id: "pro_01", at: ago(18), actor: "Kham Anoulack", actorEmail: "kham@acme.gov", reference: "PR-2026-0142", type: "Requisition", stage: "Submitted", detail: "Submitted for approval", ip: "172.16.3.41" },
  { id: "pro_02", at: ago(52), actor: "Anousone Vongsa", actorEmail: "anousone@acme.gov", reference: "PR-2026-0142", type: "Requisition", stage: "Approved", detail: "Level 2 approval", ip: "172.16.9.7" },
  { id: "pro_03", at: ago(180), actor: "Aloun Sisavath", actorEmail: "aloun@acme.gov", reference: "RFQ-2026-011", type: "Tender", stage: "Published", detail: "Opened for bids", ip: "10.24.0.92" },
  { id: "pro_04", at: ago(240), actor: "Kham Anoulack", actorEmail: "kham@acme.gov", reference: "PO-2026-0311", type: "Order", stage: "Issued", detail: "Purchase order issued to supplier", ip: "172.16.3.41" },
  { id: "pro_05", at: ago(360), actor: "Aloun Sisavath", actorEmail: "aloun@acme.gov", reference: "CON-2026-0018", type: "Contract", stage: "Signed", detail: "Contract awarded and signed", ip: "10.24.0.92" },
  { id: "pro_06", at: ago(620), actor: "Latsamy Vongsak", actorEmail: "latsamy@acme.gov", reference: "PR-2026-0137", type: "Requisition", stage: "Sent back", detail: "Returned for justification", ip: "10.24.0.88" },
  { id: "pro_07", at: ago(1300), actor: "Malina Phetxomphou", actorEmail: "malina@acme.gov", reference: "PR-2026-0130", type: "Requisition", stage: "Cancelled", detail: "Requirements changed", ip: "10.24.0.18" },
];

export const MOCK_INVENTORY_EVENTS: InventoryEntry[] = [
  { id: "inv_01", at: ago(12), actor: "Phoutthasone Keomany", actorEmail: "phoutthasone@acme.gov", item: "Portland Cement C40", sku: "SKU-220", warehouse: "Main Warehouse", type: "In", quantity: 200, balanceAfter: 840, reference: "GRN-2026-0345", ip: "172.16.9.71" },
  { id: "inv_02", at: ago(45), actor: "Somchai Keopaseuth", actorEmail: "somchai@acme.gov", item: "Rebar 12mm", sku: "SKU-114", warehouse: "Main Warehouse", type: "Out", quantity: -60, balanceAfter: 310, reference: "WO-2026-0208", ip: "172.16.9.77" },
  { id: "inv_03", at: ago(80), actor: "Phoutthasone Keomany", actorEmail: "phoutthasone@acme.gov", item: "Cement C40", sku: "SKU-220", warehouse: "Main Warehouse", type: "Adjustment", quantity: -40, balanceAfter: 640, reference: "ADJ-2026-077", ip: "172.16.9.71" },
  { id: "inv_04", at: ago(150), actor: "Somchai Keopaseuth", actorEmail: "somchai@acme.gov", item: "Paint Thinner 5L", sku: "SKU-442", warehouse: "Main Warehouse", type: "Transfer", quantity: -24, balanceAfter: 96, reference: "TRF-2026-055", ip: "172.16.9.77" },
  { id: "inv_05", at: ago(190), actor: "Sengphet Vongdara", actorEmail: "sengphet@acme.gov", item: "Paint Thinner 5L", sku: "SKU-442", warehouse: "Regional Depot", type: "Transfer", quantity: 24, balanceAfter: 124, reference: "TRF-2026-055", ip: "172.16.9.40" },
  { id: "inv_06", at: ago(260), actor: "Phoutthasone Keomany", actorEmail: "phoutthasone@acme.gov", item: "Bolt M12 x 60", sku: "SKU-501", warehouse: "Main Warehouse", type: "In", quantity: 500, balanceAfter: 1500, reference: "GRN-2026-0341", ip: "172.16.9.71" },
  { id: "inv_07", at: ago(400), actor: "Somchai Keopaseuth", actorEmail: "somchai@acme.gov", item: "Sand (m³)", sku: "SKU-301", warehouse: "Main Warehouse", type: "Out", quantity: -15, balanceAfter: 205, reference: "WO-2026-0200", ip: "172.16.9.77" },
];

export const MOCK_DATA_CHANGE_EVENTS: DataChangeEntry[] = [
  { id: "dch_01", at: ago(6), actor: "Malina Phetxomphou", actorEmail: "malina@acme.gov", entity: "User", entityId: "usr_10", record: "Ketsana Oudomlith", field: "Status", oldValue: "Active", newValue: "Disabled", ip: "10.24.0.18" },
  { id: "dch_02", at: ago(28), actor: "Kham Anoulack", actorEmail: "kham@acme.gov", entity: "Purchase Requisition", entityId: "PR-2026-0142", record: "PR-2026-0142", field: "Estimated amount", oldValue: "₭18,500,000", newValue: "₭20,150,000", ip: "172.16.3.41" },
  { id: "dch_03", at: ago(70), actor: "Anousone Vongsa", actorEmail: "anousone@acme.gov", entity: "User", entityId: "usr_11", record: "Aloun Sisavath", field: "Role", oldValue: "Viewer", newValue: "Procurement Officer", ip: "172.16.9.7" },
  { id: "dch_04", at: ago(130), actor: "Phoutthasone Keomany", actorEmail: "phoutthasone@acme.gov", entity: "Item", entityId: "SKU-220", record: "Portland Cement C40", field: "Reorder level", oldValue: "150", newValue: "200", ip: "172.16.9.71" },
  { id: "dch_05", at: ago(210), actor: "Aloun Sisavath", actorEmail: "aloun@acme.gov", entity: "Approval Rule", entityId: "rule_01", record: "Purchase Requisition rule", field: "Max amount", oldValue: "₭10,000,000", newValue: "₭15,000,000", ip: "10.24.0.92" },
  { id: "dch_06", at: ago(360), actor: "Malina Phetxomphou", actorEmail: "malina@acme.gov", entity: "Department", entityId: "dept_warehouse", record: "Warehouse & Inventory", field: "Head of department", oldValue: "—", newValue: "Phoutthasone Keomany", ip: "10.24.0.18" },
  { id: "dch_07", at: ago(520), actor: "Viengkham Saysana", actorEmail: "viengkham@acme.gov", entity: "Document", entityId: "DOC-2026-0088", record: "required-spec.pdf", field: "Classification", oldValue: "Internal", newValue: "Confidential", ip: "172.16.3.55" },
];