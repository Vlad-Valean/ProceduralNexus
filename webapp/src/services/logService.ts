const BASE = "http://localhost:8080";

export async function sendLog(action: string, description?: string): Promise<void> {
  const token = localStorage.getItem("token") || "";
  if (!token) return;

  await fetch(`${BASE}/api/logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action, description }),
  });
}
