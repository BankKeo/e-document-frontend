"use client";

import * as React from "react";
import { Building2, ChevronRight, Crown, Loader2, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  useDepartmentsQuery,
  useEmployeesQuery,
  useOrganization,
  usePositionsQuery,
} from "../api/organization.queries";
import type { Department, Employee } from "../types";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

interface TreeContextValue {
  subDepts: (id: string) => Department[];
  allDepartments: Department[];
  employees: Employee[];
  employeesByDept: Map<string, Employee[]>;
  positionOf: (id: string) => string;
  expanded: Set<string>;
  toggle: (id: string) => void;
}

const TreeContext = React.createContext<TreeContextValue | null>(null);

function EmployeeRow({
  employee,
  isHead,
  positionLabel,
}: {
  employee: Employee;
  isHead?: boolean;
  positionLabel: string;
}) {
  return (
    <li
      className={cn(
        "flex items-center gap-2.5 rounded-lg border px-2.5 py-2",
        isHead && "border-primary/30 bg-primary/5"
      )}
    >
      <Avatar size="sm">
        <AvatarFallback className="text-[10px]">{initials(employee.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-medium">{employee.name}</p>
          {isHead ? <Crown className="size-3.5 shrink-0 text-amber-500" /> : null}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {positionLabel}
          {isHead ? " · Head of department" : ""}
        </p>
      </div>
      {isHead ? (
        <Badge variant="outline" className="ml-auto shrink-0">
          Manager
        </Badge>
      ) : null}
    </li>
  );
}

function DepartmentNode({ department }: { department: Department }) {
  const ctx = React.useContext(TreeContext)!;
  const sub = ctx.subDepts(department.id);
  const members = ctx.employeesByDept.get(department.id) ?? [];
  const head = members.find((entry) => entry.id === department.managerId);
  const expanded = ctx.expanded.has(department.id);

  return (
    <li>
      <button
        type="button"
        onClick={() => ctx.toggle(department.id)}
        className="flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition-colors hover:bg-muted/50"
        aria-expanded={expanded}
      >
        <ChevronRight
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-90"
          )}
        />
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Building2 className="size-4" />
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-2 text-sm font-medium">
            {department.name}
            <span className="text-xs font-normal text-muted-foreground">
              {department.code}
            </span>
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {head ? `Head: ${head.name}` : "No head assigned"} ·{" "}
            {members.length} member{members.length === 1 ? "" : "s"}
          </span>
        </span>
        {members.length > 0 ? (
          <Badge variant="secondary" className="ml-auto shrink-0">
            {members.length}
          </Badge>
        ) : null}
      </button>

      {expanded ? (
        <ul className="mt-1 ml-[19px] flex flex-col gap-1 border-l pl-4">
          {sub.map((child) => (
            <DepartmentNode key={child.id} department={child} />
          ))}
          {members
            .slice()
            .sort((a, b) => Number(b.id === department.managerId) - Number(a.id === department.managerId))
            .map((member) => (
              <EmployeeRow
                key={member.id}
                employee={member}
                isHead={member.id === department.managerId}
                positionLabel={ctx.positionOf(member.positionId)}
              />
            ))}
        </ul>
      ) : null}
    </li>
  );
}

export function HierarchyPage() {
  const { data: org } = useOrganization();
  const { data: departments } = useDepartmentsQuery();
  const { data: employees } = useEmployeesQuery();
  const { data: positions } = usePositionsQuery();
  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set());

  const positionNames = React.useMemo(
    () => new Map((positions ?? []).map((entry) => [entry.id, entry.title])),
    [positions]
  );
  const employeesByDept = React.useMemo(() => {
    const map = new Map<string, Employee[]>();
    for (const employee of employees ?? []) {
      const list = map.get(employee.departmentId) ?? [];
      list.push(employee);
      map.set(employee.departmentId, list);
    }
    return map;
  }, [employees]);

  const topLevel = React.useMemo(
    () => (departments ?? []).filter((entry) => entry.parentId === null),
    [departments]
  );

  const context: TreeContextValue = {
    subDepts: (id) => (departments ?? []).filter((entry) => entry.parentId === id),
    allDepartments: departments ?? [],
    employees: employees ?? [],
    employeesByDept,
    positionOf: (id) => positionNames.get(id) ?? "—",
    expanded,
    toggle: (id) => {
      setExpanded((current) => {
        const next = new Set(current);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
  };

  React.useEffect(() => {
    if (departments && expanded.size === 0 && topLevel.length) {
      const id = window.setTimeout(
        () => setExpanded(new Set(topLevel.map((entry) => entry.id))),
        0
      );
      return () => window.clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departments]);

  if (!departments || !employees) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Building hierarchy…
      </div>
    );
  }

  return (
    <TreeContext.Provider value={context}>
      <div className="grid gap-4">
        <Card>
          <CardContent className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{org?.name ?? "Organization"}</p>
              <p className="text-xs text-muted-foreground">
                {departments.length} departments · {employees.length} employees ·
                expand a department to see its team
              </p>
            </div>
          </CardContent>
        </Card>

        <ul className="flex flex-col gap-1">
          {topLevel.map((department) => (
            <DepartmentNode key={department.id} department={department} />
          ))}
        </ul>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <UserRound className="size-3.5" />
          Employees report to the Head of their department, shown in the tree
          above.
        </p>
      </div>
    </TreeContext.Provider>
  );
}