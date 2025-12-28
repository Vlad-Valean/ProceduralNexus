import { useEffect, useState } from "react";

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
    fetch("http://localhost:8081/profiles", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
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