import React, { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import UserTable from "../components/UserTable";
import type { UserRow } from "../components/UserTable";
import OrganizationStats from "../components/OrganizationStats";
import AddUserForm from "../components/AddUserForm";
import NewApplications from "../components/NewApplications";
import UserDetails from "../components/UserDetails";

const BASE_URL = "http://localhost:8081";

type SelectedUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  organization?: string;
};

type HrUsersResponse = {
  organizationId?: number | null;
  organizationName?: string | null;
  organization?: { id?: number | null; name?: string | null } | null;
  orgName?: string | null;
  users?:
    | Array<{
        id?: string | null;
        profileId?: string | null;
        uuid?: string | null;
        firstName?: string | null;
        firstname?: string | null;
        lastName?: string | null;
        lastname?: string | null;
        email?: string | null;
      }>
    | null;
  members?:
    | Array<{
        id?: string | null;
        profileId?: string | null;
        uuid?: string | null;
        firstName?: string | null;
        firstname?: string | null;
        lastName?: string | null;
        lastname?: string | null;
        email?: string | null;
      }>
    | null;
};

type ProfileResponse = {
  roles?: string[] | null;
};

const HrDashboard: React.FC = () => {
  const [showApplications, setShowApplications] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);

  const [organizationName, setOrganizationName] = useState<string>("-");
  const [orgUsers, setOrgUsers] = useState<UserRow[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [hrCount, setHrCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  const token = useMemo(() => localStorage.getItem("token"), []);

  const handleBackToStats = useCallback((): void => {
    setSelectedUser(null);
    setShowApplications(false);
  }, []);

  const loadOrgUsers = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setLoadingUsers(true);
        setLoadError(null);

        if (!token) {
          setOrganizationName("-");
          setOrgUsers([]);
          setHrCount(0);
          setUserCount(0);
          setLoadError("Not authenticated (missing token).");
          return;
        }

        const res = await fetch(`${BASE_URL}/hr/users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Request failed (${res.status}). ${txt}`);
        }

        const data: unknown = await res.json();
        const dto: HrUsersResponse = (data ?? {}) as HrUsersResponse;

        const orgName: string =
          dto.organizationName ?? dto.organization?.name ?? dto.orgName ?? "-";

        const usersFromApi = dto.users ?? dto.members ?? [];

        const myEmail = (localStorage.getItem("userEmail") || "").toLowerCase();

        // map users (backend already removed owner)
        const mapped: UserRow[] = (usersFromApi ?? [])
          .map((u) => ({
            id: String(u.id ?? u.profileId ?? u.uuid ?? ""),
            firstName: String(u.firstName ?? u.firstname ?? "-"),
            lastName: String(u.lastName ?? u.lastname ?? "-"),
            email: String(u.email ?? ""),
          }))
          .filter((u) => u.id && u.email)
          .filter((u) => u.email.toLowerCase() !== myEmail);

        setOrganizationName(orgName);
        setOrgUsers(mapped);

        const profileIds = mapped.map((u) => u.id);

        const rolesResults = await Promise.all(
          profileIds.map(async (id) => {
            const r = await fetch(`${BASE_URL}/profiles/${id}`, {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
              signal,
            });

            if (!r.ok) return { id, roles: [] as string[] };

            const profJson: unknown = await r.json();
            const prof: ProfileResponse = (profJson ?? {}) as ProfileResponse;

            const roles: string[] = Array.isArray(prof.roles) ? prof.roles : [];
            return { id, roles };
          })
        );

        let hr = 0;
        let usr = 0;
        for (const it of rolesResults) {
          if (it.roles.includes("HR")) hr++;
          else if (it.roles.includes("USER")) usr++;
        }

        setHrCount(hr + 2); // +2 for owner and self
        setUserCount(usr);
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === "AbortError") return;

        setOrganizationName("-");
        setOrgUsers([]);
        setHrCount(0);
        setUserCount(0);
        setLoadError(e instanceof Error ? e.message : "Failed to load users.");
      } finally {
        setLoadingUsers(false);
      }
    },
    [token]
  );

  const handleRemoveSelectedUser = useCallback(
    async (userId: string) => {
      if (!token) throw new Error("Not authenticated (missing token).");

      const res = await fetch(`${BASE_URL}/profiles/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Delete failed (${res.status}). ${txt}`);
      }

      setSelectedUser((prev) => (prev?.id === userId ? null : prev));
      setShowApplications(false);

      await loadOrgUsers();
    },
    [token, loadOrgUsers]
  );

  const handleUserSelect = useCallback(
    async (u: UserRow) => {
      setSelectedUser({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        organization: organizationName,
        role: undefined,
      });

      try {
        if (!token) return;

        const res = await fetch(`${BASE_URL}/profiles/${u.id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const profJson: unknown = await res.json();
        const prof: ProfileResponse = (profJson ?? {}) as ProfileResponse;
        const roles: string[] = Array.isArray(prof.roles) ? prof.roles : [];
        const role = roles.length ? roles[0] : undefined;

        setSelectedUser((prev) => {
          if (!prev || prev.id !== u.id) return prev;
          return { ...prev, role };
        });
      } catch {
        // ignore
      }
    },
    [token, organizationName]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadOrgUsers(controller.signal);
    return () => controller.abort();
  }, [loadOrgUsers]);

  return (
    <>
      <Navbar />
      <main
        style={{
          padding: "10px 32px 10px",
          minHeight: `calc(100vh - 60px)`,
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)",
              gap: 22,
              alignItems: "stretch",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 20, minHeight: 0 }}>
              <div style={{ flex: 1, minHeight: 0 }}>
                <UserTable
                  organizationName={organizationName}
                  users={orgUsers}
                  onUserSelect={handleUserSelect}
                />

                {loadingUsers && (
                  <div style={{ marginTop: 10, color: "#7b8bb2", fontWeight: 500 }}>
                    Loading users...
                  </div>
                )}
                {loadError && (
                  <div style={{ marginTop: 10, color: "#d32f2f", fontWeight: 600 }}>
                    {loadError}
                  </div>
                )}
              </div>

              <AddUserForm />
            </div>

            <div style={{ minHeight: 0 }}>
              {selectedUser ? (
                <UserDetails
                  user={selectedUser}
                  onBackToStats={handleBackToStats}
                  onRemoveUser={handleRemoveSelectedUser}
                />
              ) : showApplications ? (
                <NewApplications
                  onBack={() => setShowApplications(false)}
                  onApplicationAccepted={async () => {
                    await loadOrgUsers(); 
                  }}
                />
              ) : (
                <OrganizationStats
                  organizationName={organizationName}
                  hrCount={hrCount}
                  userCount={userCount}
                  onCheckApplications={() => setShowApplications(true)}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default HrDashboard;
