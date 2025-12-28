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

type OrgResponseDto = {
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

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function fetchOrganizations(token: string): Promise<OrganizationRow[]> {
  const res = await fetch(`${BASE_URL}/organizations`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`Failed to load organizations (${res.status})`);
  const data = await res.json();

  return (Array.isArray(data) ? data : []).map((o: any) => ({
    id: Number(o.id),
    name: o.name ?? "-",
    ownerEmail: o.ownerEmail ?? null,
    employees: Number(o.membersCount ?? 0),
    createdAt: o.createdAt ?? null,
  }));
}

export async function fetchOrganization(token: string, id: number): Promise<OrgResponseDto> {
  const res = await fetch(`${BASE_URL}/organizations/${id}`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error(`Failed to load organization (${res.status})`);
  return res.json();
}

export async function fetchOrganizationMembers(token: string, id: number): Promise<EmployeeRow[]> {
  const res = await fetch(`${BASE_URL}/organizations/${id}/members`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error(`Failed to load organization members (${res.status})`);
  const data: ProfileResponseDto[] = await res.json();

  return (Array.isArray(data) ? data : []).map((p) => ({
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
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Create failed (${res.status}). ${txt}`);
  }

  const o = await res.json();

  return {
    id: Number(o.id),
    name: o.name ?? "-",
    ownerEmail: o.ownerEmail ?? null,
    employees: Number(o.membersCount ?? 0),
    createdAt: o.createdAt ?? null,
  };
}
