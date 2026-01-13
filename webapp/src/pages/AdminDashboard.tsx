import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import OrganizationTable from "../components/OrganizationTable";
import AddOrganizationForm from "../components/AddOrganizationForm";
import OrganizationDetail from "../components/OrganizationDetail";
import AdminLogs from "../components/AdminLogs";
import type { OrganizationRow, OrganizationDetail as OrgDetailType } from "../utils/admin";
import { fetchOrganizations, buildOrganizationDetail } from "../utils/admin";

const AdminDashboard: React.FC = () => {
  const token = useMemo(() => localStorage.getItem("token") ?? "", []);

  const [organizations, setOrganizations] = useState<OrganizationRow[]>([]);
  const [orgLoading, setOrgLoading] = useState(false);
  const [orgError, setOrgError] = useState<string | null>(null);

  const [selectedOrg, setSelectedOrg] = useState<OrgDetailType | null>(null);
  const [selectedLoading, setSelectedLoading] = useState(false);
  const [selectedError, setSelectedError] = useState<string | null>(null);

  const [logsTarget, setLogsTarget] = useState<string | null>(null);
  const [lastOrganizationId, setLastOrganizationId] = useState<number | null>(null);

  const loadOrganizations = async () => {
    if (!token) {
      setOrgError("Not authenticated (missing token).");
      setOrganizations([]);
      return;
    }

    setOrgLoading(true);
    setOrgError(null);

    try {
      const list = await fetchOrganizations(token);
      setOrganizations(list);
    } catch (e: unknown) {
      setOrgError(e instanceof Error ? e.message : "Failed to load organizations.");
      setOrganizations([]);
    } finally {
      setOrgLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRowClick = async (org: OrganizationRow) => {
    setLogsTarget(null);
    setLastOrganizationId(org.id);

    if (!token) return;

    setSelectedLoading(true);
    setSelectedError(null);

    try {
      const detail = await buildOrganizationDetail(token, org.id);
      setSelectedOrg(detail);
    } catch (e: unknown) {
      setSelectedOrg(null);
      setSelectedError(e instanceof Error ? e.message : "Failed to load organization details.");
    } finally {
      setSelectedLoading(false);
    }
  };

  const handleShowLogs = (target: string | null) => {
    setLogsTarget(target);
    setSelectedOrg(null);
  };

  const handleBackFromLogs = async () => {
    setLogsTarget(null);

    if (lastOrganizationId && token) {
      setSelectedLoading(true);
      setSelectedError(null);

      try {
        const detail = await buildOrganizationDetail(token, lastOrganizationId);
        setSelectedOrg(detail);
      } catch (e: unknown) {
        setSelectedOrg(null);
        setSelectedError(e instanceof Error ? e.message : "Failed to load organization details.");
      } finally {
        setSelectedLoading(false);
      }
    }
  };

  const handleBackToLogs = () => {
    setSelectedOrg(null);
    setLastOrganizationId(null);
    setLogsTarget(null);
  };

  const handleOrgDeleted = async () => {
    await loadOrganizations();
    setSelectedOrg(null);
    setLogsTarget(null);
    setLastOrganizationId(null);
  };

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
                <OrganizationTable
                  organizations={organizations}
                  loading={orgLoading}
                  error={orgError}
                  onRowClick={handleRowClick}
                />
              </div>

              <AddOrganizationForm onCreated={loadOrganizations} />
            </div>

            <div style={{ minHeight: 0 }}>
              {logsTarget !== null ? (
                <AdminLogs logsTarget={logsTarget} onBack={handleBackFromLogs} />
              ) : selectedOrg ? (
                <OrganizationDetail
                  organization={selectedOrg}
                  loading={selectedLoading}
                  error={selectedError}
                  onShowLogs={handleShowLogs}
                  onBack={handleBackToLogs}
                  onDeleted={handleOrgDeleted}
                />
              ) : (
                <AdminLogs logsTarget={null} onBack={() => {}} />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
