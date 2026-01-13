import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:8080";

function getUserRoles(): string[] {
  try {
    const roles = localStorage.getItem("userRoles");
    return roles ? JSON.parse(roles) : [];
  } catch {
    return [];
  }
}

type Profile = {
  email: string;
  organizationId: string | null;
};

export default function useNoOrganization(): boolean | null {
  const roles = getUserRoles();
  const userEmail = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token") || "";
  const initialAllowed =
    !getUserRoles().includes("USER") || !localStorage.getItem("userEmail")
      ? false
      : null;
  const [allowed, setAllowed] = useState<boolean | null>(initialAllowed);

  useEffect(() => {
    if (allowed === false) {
      return;
    }
    fetch(`${API_BASE_URL}/profiles`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) {
            // do not clear session; treat as unauthorized for this check
            throw new Error("Not authorized");
          }
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `Profiles fetch failed (${res.status})`);
        }
        return res.json();
      })
      .then((profiles: Profile[]) => {
        const profile = profiles.find(p => p.email === userEmail);
        if (profile) {
          setAllowed(profile.organizationId == null);
        } else {
          setAllowed(false);
        }
      })
      .catch(() => setAllowed(false));
  }, [roles, userEmail, token, allowed]);

  return allowed;
}