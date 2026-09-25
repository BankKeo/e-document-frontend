import type {
  ApprovalRule,
  Department,
  Employee,
  Organization,
  Position,
} from "../types";

export const MOCK_ORG: Organization = {
  id: "org_01",
  name: "Acme Public Administration",
  code: "APA",
  sector: "Public Administration",
  establishedYear: 2001,
  address: "Ban Wattay, Vientiane Capital, LA",
  phone: "+856 21 260 888",
  email: "info@acme.gov",
  taxId: "AP-2001-001145",
  motto: "Serving citizens with transparency.",
};

export const MOCK_DEPARTMENTS: Department[] = [
  { id: "dept_exec", name: "Executive Office", code: "EXEC", parentId: null, managerId: "emp_001", description: "Leadership, strategy, and corporate governance.", memberCount: 4 },
  { id: "dept_finance", name: "Finance", code: "FIN", parentId: "dept_exec", managerId: "emp_003", description: "Budgeting, treasury, and accounting.", memberCount: 5 },
  { id: "dept_proc", name: "Procurement", code: "PROC", parentId: "dept_exec", managerId: "emp_002", description: "Sourcing, tenders, and contract management.", memberCount: 6 },
  { id: "dept_warehouse", name: "Warehouse & Inventory", code: "WH", parentId: "dept_proc", managerId: "emp_004", description: "Receiving, storage, and stock control.", memberCount: 5 },
  { id: "dept_hr", name: "Human Resources", code: "HR", parentId: "dept_exec", managerId: "emp_006", description: "People operations and development.", memberCount: 3 },
  { id: "dept_it", name: "IT", code: "IT", parentId: "dept_exec", managerId: "emp_007", description: "Systems, infrastructure, and support.", memberCount: 3 },
  { id: "dept_legal", name: "Legal", code: "LEG", parentId: "dept_exec", managerId: "emp_005", description: "Legal counsel and compliance.", memberCount: 2 },
];

export const MOCK_POSITIONS: Position[] = [
  { id: "pos_ceo", title: "Chief Executive", departmentId: "dept_exec", grade: "G1", description: "Overall leadership of the organization." },
  { id: "pos_admin", title: "Administrative Officer", departmentId: "dept_exec", grade: "G4", description: "Executive office administration." },
  { id: "pos_receptionist", title: "Receptionist", departmentId: "dept_exec", grade: "G5", description: "Front desk and visitor services." },
  { id: "pos_fin_manager", title: "Finance Manager", departmentId: "dept_finance", grade: "G2", description: "Leads the finance function." },
  { id: "pos_accountant", title: "Accountant", departmentId: "dept_finance", grade: "G4", description: "Accounting and reporting." },
  { id: "pos_ap_clerk", title: "Accounts Payable Clerk", departmentId: "dept_finance", grade: "G5", description: "Processes supplier payments." },
  { id: "pos_proc_specialist", title: "Procurement Specialist", departmentId: "dept_proc", grade: "G3", description: "Runs tenders and sourcing." },
  { id: "pos_proc_officer", title: "Procurement Officer", departmentId: "dept_proc", grade: "G4", description: "Assists with requisitions and purchase orders." },
  { id: "pos_tender_coord", title: "Tender Coordinator", departmentId: "dept_proc", grade: "G4", description: "Coordinates tender submissions." },
  { id: "pos_doc_controller", title: "Document Controller", departmentId: "dept_proc", grade: "G4", description: "Manages procurement documents." },
  { id: "pos_wh_manager", title: "Warehouse Manager", departmentId: "dept_warehouse", grade: "G3", description: "Runs warehouse operations." },
  { id: "pos_stores_officer", title: "Stores Officer", departmentId: "dept_warehouse", grade: "G5", description: "Stock custody and issue." },
  { id: "pos_hr_partner", title: "HR Business Partner", departmentId: "dept_hr", grade: "G3", description: "People operations partner." },
  { id: "pos_it_admin", title: "IT Administrator", departmentId: "dept_it", grade: "G3", description: "Systems administration." },
  { id: "pos_legal_counsel", title: "Legal Counsel", departmentId: "dept_legal", grade: "G2", description: "Provides legal advice." },
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: "emp_001", employeeCode: "EMP-001", name: "Malina Phetxomphou", email: "malina@acme.gov", departmentId: "dept_exec", positionId: "pos_ceo", managerId: null, employmentType: "Permanent", status: "Active", joinedAt: "2024-01-12", phone: "+856 20 5555 0101" },
  { id: "emp_002", employeeCode: "EMP-002", name: "Kham Anoulack", email: "kham@acme.gov", departmentId: "dept_proc", positionId: "pos_proc_specialist", managerId: "emp_001", employmentType: "Permanent", status: "Active", joinedAt: "2024-03-04", phone: "+856 20 5555 0102" },
  { id: "emp_003", employeeCode: "EMP-003", name: "Anousone Vongsa", email: "anousone@acme.gov", departmentId: "dept_finance", positionId: "pos_fin_manager", managerId: "emp_001", employmentType: "Permanent", status: "Active", joinedAt: "2024-02-19", phone: "+856 20 5555 0103" },
  { id: "emp_004", employeeCode: "EMP-004", name: "Phoutthasone Keomany", email: "phoutthasone@acme.gov", departmentId: "dept_warehouse", positionId: "pos_wh_manager", managerId: "emp_002", employmentType: "Permanent", status: "Active", joinedAt: "2024-04-22", phone: "+856 20 5555 0104" },
  { id: "emp_005", employeeCode: "EMP-005", name: "Somsack Inthavong", email: "somsack@acme.gov", departmentId: "dept_legal", positionId: "pos_legal_counsel", managerId: "emp_001", employmentType: "Contract", status: "Active", joinedAt: "2024-05-30" },
  { id: "emp_006", employeeCode: "EMP-006", name: "Manichanh Soulivong", email: "manichanh@acme.gov", departmentId: "dept_hr", positionId: "pos_hr_partner", managerId: "emp_001", employmentType: "Permanent", status: "Active", joinedAt: "2024-07-01" },
  { id: "emp_007", employeeCode: "EMP-007", name: "Bounthavy Philavong", email: "bounthavy@acme.gov", departmentId: "dept_it", positionId: "pos_it_admin", managerId: "emp_001", employmentType: "Permanent", status: "Active", joinedAt: "2024-02-01" },
  { id: "emp_008", employeeCode: "EMP-008", name: "Viengkham Saysana", email: "viengkham@acme.gov", departmentId: "dept_proc", positionId: "pos_doc_controller", managerId: "emp_002", employmentType: "Permanent", status: "Active", joinedAt: "2024-06-11" },
  { id: "emp_009", employeeCode: "EMP-009", name: "Thongdy Phommasane", email: "thongdy@acme.gov", departmentId: "dept_exec", positionId: "pos_receptionist", managerId: "emp_001", employmentType: "Permanent", status: "Active", joinedAt: "2025-02-09" },
  { id: "emp_010", employeeCode: "EMP-010", name: "Aloun Sisavath", email: "aloun@acme.gov", departmentId: "dept_proc", positionId: "pos_tender_coord", managerId: "emp_002", employmentType: "Contract", status: "Active", joinedAt: "2025-01-19" },
  { id: "emp_011", employeeCode: "EMP-011", name: "Ketsana Oudomlith", email: "ketsana@acme.gov", departmentId: "dept_finance", positionId: "pos_ap_clerk", managerId: "emp_003", employmentType: "Permanent", status: "Terminated", joinedAt: "2024-09-05" },
  { id: "emp_012", employeeCode: "EMP-012", name: "Sengphet Vongdara", email: "sengphet@acme.gov", departmentId: "dept_warehouse", positionId: "pos_stores_officer", managerId: "emp_004", employmentType: "Contract", status: "On Leave", joinedAt: "2024-08-14" },
  { id: "emp_013", employeeCode: "EMP-013", name: "Bounmee Rattanavong", email: "bounmee@acme.gov", departmentId: "dept_finance", positionId: "pos_accountant", managerId: "emp_003", employmentType: "Permanent", status: "Active", joinedAt: "2025-03-17" },
  { id: "emp_014", employeeCode: "EMP-014", name: "Somchai Keopaseuth", email: "somchai@acme.gov", departmentId: "dept_warehouse", positionId: "pos_stores_officer", managerId: "emp_004", employmentType: "Permanent", status: "Active", joinedAt: "2025-04-02" },
  { id: "emp_015", employeeCode: "EMP-015", name: "Latsamy Vongsak", email: "latsamy@acme.gov", departmentId: "dept_proc", positionId: "pos_proc_officer", managerId: "emp_002", employmentType: "Contract", status: "Active", joinedAt: "2025-05-20" },
  { id: "emp_016", employeeCode: "EMP-016", name: "Phonesavanh Chanthavong", email: "phonesavanh@acme.gov", departmentId: "dept_hr", positionId: "pos_admin", managerId: "emp_006", employmentType: "Permanent", status: "Active", joinedAt: "2025-06-08" },
];

export const MOCK_APPROVAL_RULES: ApprovalRule[] = [
  { id: "rule_01", documentType: "Purchase Requisition", module: "Procurement", limitKind: "amount", minAmount: 0, maxAmount: 10_000, level: 1, approver: "Procurement Officer", alternateApprover: "Department Manager", enabled: true },
  { id: "rule_02", documentType: "Purchase Requisition", module: "Procurement", limitKind: "amount", minAmount: 10_000, maxAmount: 100_000, level: 2, approver: "Department Manager", alternateApprover: "Finance Manager", enabled: true },
  { id: "rule_03", documentType: "Purchase Requisition", module: "Procurement", limitKind: "amount", minAmount: 100_000, level: 3, approver: "Director", alternateApprover: "Finance Manager", enabled: true },
  { id: "rule_04", documentType: "Purchase Order", module: "Procurement", limitKind: "any", level: 2, approver: "Finance Manager", alternateApprover: "Director", enabled: true },
  { id: "rule_05", documentType: "Contract", module: "Procurement", limitKind: "any", level: 3, approver: "Director", alternateApprover: "Admin", enabled: true },
  { id: "rule_06", documentType: "Document Approval", module: "DMS", limitKind: "any", level: 1, approver: "Department Manager", alternateApprover: "Editor", enabled: true },
  { id: "rule_07", documentType: "Stock Adjustment", module: "Warehouse", limitKind: "amount", minAmount: 0, maxAmount: 5_000, level: 1, approver: "Warehouse Manager", alternateApprover: "Department Manager", enabled: true },
  { id: "rule_08", documentType: "Stock Adjustment", module: "Warehouse", limitKind: "amount", minAmount: 5_000, level: 2, approver: "Finance Manager", alternateApprover: "Director", enabled: true },
  { id: "rule_09", documentType: "Write-off", module: "Warehouse", limitKind: "any", level: 3, approver: "Admin", alternateApprover: "Director", enabled: false },
  { id: "rule_10", documentType: "Procurement Plan", module: "Procurement", limitKind: "any", level: 2, approver: "Director", alternateApprover: "Finance Manager", enabled: true },
];

export const MOCK_DOCUMENT_TYPES = [
  "Purchase Requisition",
  "Purchase Order",
  "Procurement Plan",
  "Contract",
  "Document Approval",
  "Stock Adjustment",
  "Write-off",
];

export const MOCK_APPROVERS = [
  "Procurement Officer",
  "Department Manager",
  "Finance Manager",
  "Director",
  "Warehouse Manager",
  "Admin",
  "Editor",
];