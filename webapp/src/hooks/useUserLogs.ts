import { useCallback } from "react";

export interface UserLog {
  id: number;
  action: string;
  description: string;
  createdAt: string;
}

export function useUserLogs() {
  const fetchUserLogs = useCallback(async (token: string): Promise<UserLog[]> => {
    const res = await fetch("http://localhost:8080/documents/api/user/logs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data)
      ? data.map((l) => ({
          id: l.id,
          action: l.action,
          description: l.description,
          createdAt: l.createdAt,
        }))
      : [];
  }, []);
  return { fetchUserLogs };
}
