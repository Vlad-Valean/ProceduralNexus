const BASE_URL = "http://localhost:8081";

export type OrganizationRow = {
  id: number;
  name: string;
  ownerEmail: string | null;
  employees: number;
  createdAt: string | null;
};

export type EmployeeRow = {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  roles: string[];
};

export type OrganizationDetail = {
  id: number;
  name: string;
  ownerEmail: string | null;
  ownerFirstName: string | null;
  ownerLastName: string | null;
  employees: number;
  createdAt: string | null;
  employeesList: EmployeeRow[];
};

export type OrgResponseDto = {
  id: number;
  name: string;
  ownerEmail?: string | null;
  ownerFirstname?: string | null;
  ownerLastname?: string | null;
  membersCount?: number;
  createdAt?: string | null;
};

type ProfileResponseDto = {
  id: string;
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
  roles?: string[];
};

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

function toOrganizationRow(o: OrgResponseDto): OrganizationRow {
  return {
    id: Number(o.id),
    name: o.name ?? "-",
    ownerEmail: o.ownerEmail ?? null,
    employees: Number(o.membersCount ?? 0),
    createdAt: o.createdAt ?? null,
  };
}

export async function fetchOrganizations(token: string): Promise<OrganizationRow[]> {
  const res = await fetch(`${BASE_URL}/organizations`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    throw new Error(`Failed to load organizations (${res.status})`);
  }

  const data: unknown = await res.json();

  const list: OrgResponseDto[] = Array.isArray(data) ? (data as OrgResponseDto[]) : [];

  return list.map(toOrganizationRow);
}

export async function fetchOrganization(token: string, id: number): Promise<OrgResponseDto> {
  const res = await fetch(`${BASE_URL}/organizations/${id}`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    throw new Error(`Failed to load organization (${res.status})`);
  }

  const data: unknown = await res.json();
  return data as OrgResponseDto;
}

export async function fetchOrganizationMembers(token: string, id: number): Promise<EmployeeRow[]> {
  const res = await fetch(`${BASE_URL}/organizations/${id}/members`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    throw new Error(`Failed to load organization members (${res.status})`);
  }

  const data: unknown = await res.json();
  const list: ProfileResponseDto[] = Array.isArray(data) ? (data as ProfileResponseDto[]) : [];

  return list.map((p) => ({
    id: String(p.id),
    firstname: p.firstname ?? null,
    lastname: p.lastname ?? null,
    email: p.email ?? null,
    roles: Array.isArray(p.roles) ? p.roles : [],
  }));
}

export async function buildOrganizationDetail(token: string, id: number): Promise<OrganizationDetail> {
  const [org, members] = await Promise.all([
    fetchOrganization(token, id),
    fetchOrganizationMembers(token, id),
  ]);

  return {
    id: Number(org.id),
    name: org.name ?? "-",
    ownerEmail: org.ownerEmail ?? null,
    ownerFirstName: org.ownerFirstname ?? null,
    ownerLastName: org.ownerLastname ?? null,
    employees: Number(org.membersCount ?? members.length ?? 0),
    createdAt: org.createdAt ?? null,
    employeesList: members,
  };
}

export async function createOrganization(
  token: string,
  payload: { name: string; ownerEmail?: string }
): Promise<OrganizationRow> {
  const res = await fetch(`${BASE_URL}/organizations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Create failed (${res.status}). ${txt}`);
  }

  const data: unknown = await res.json();
  return toOrganizationRow(data as OrgResponseDto);
}

export async function deleteOrganization(token: string, id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/organizations/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Delete failed (${res.status}). ${txt}`);
  }
}

export function formatDateGB(iso: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB");
}