const API_URL = "http://localhost:8080";

export type LogEntry = {
  id: number;
  user: string;
  action: string;
  details: string;
  loggedAt: string;
};

export async function getAdminLogs(): Promise<LogEntry[]> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/logs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET /admin/logs failed: ${res.status} ${text}`);
  }
  return res.json();
}
