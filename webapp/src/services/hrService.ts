export type HrUserDto = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
};

export type HrUsersResponseDto = {
  organizationName: string;
  users: HrUserDto[];
};

const API_URL = "http://localhost:8080";

export async function getHrUsers(): Promise<HrUsersResponseDto> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/hr/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET /hr/users failed: ${res.status} ${text}`);
  }

  return res.json();
}
