import React, { useState } from "react";
import Navbar from "../components/Navbar";
import OrganizationTable from "../components/OrganizationTable";
import AddOrganizationForm from "../components/AddOrganizationForm";
import OrganizationDetail from "../components/OrganizationDetail";
import AdminLogs from "../components/AdminLogs";

type Organization = {
  organization: string;
  owner: string;
  employees: number;
  createdDate: string;
};

const AdminDashboard: React.FC = () => {
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [logsTarget, setLogsTarget] = useState<string | null>(null);
  const [lastOrganization, setLastOrganization] = useState<Organization | null>(null);

  const handleRowClick = (organization: Organization) => {
    setSelectedOrganization(organization);
    setLastOrganization(organization);
    setLogsTarget(null);
  };

  const handleShowLogs = (target: string | null) => {
    setLogsTarget(target);
    setLastOrganization(selectedOrganization);
    setSelectedOrganization(null);
  };

  const handleBackFromLogs = () => {
    if (lastOrganization) {
      setSelectedOrganization(lastOrganization);
      setLogsTarget(null);
    } else {
      setSelectedOrganization(null);
      setLogsTarget(null);
    }
  };

  const handleBackToLogs = () => {
    setSelectedOrganization(null);
    setLastOrganization(null);
    setLogsTarget(null);
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
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)",
              gap: 22,
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                minHeight: 0,
              }}
            >
              <div style={{ flex: 1, minHeight: 0 }}>
                <OrganizationTable onRowClick={handleRowClick} />
              </div>
              <AddOrganizationForm />
            </div>

            <div style={{ minHeight: 0 }}>
              {logsTarget !== null ? (
                <AdminLogs logsTarget={logsTarget} onBack={handleBackFromLogs} />
              ) : selectedOrganization ? (
                <OrganizationDetail
                  organization={selectedOrganization}
                  onShowLogs={handleShowLogs}
                  onBack={handleBackToLogs}
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
