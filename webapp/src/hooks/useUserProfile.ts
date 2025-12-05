import { useEffect, useState } from "react";

type Organization = {
  id: string;
  name: string;
};

type UserProfile = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  roles: string[];
  organization?: Organization;
};

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profiles/me", {
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  
  return { profile, loading, error };
}
