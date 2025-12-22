import React, { useState } from "react";
import Navbar from "../components/Navbar";
import OrganizationTable from "../components/OrganizationTable";
// import OrganizationStats from "../components/OrganizationStats";
import AddOrganizationForm from "../components/AddOrganizationForm";
import OrganizationDetail from "../components/OrganizationDetail";
import AdminLogs from "../components/AdminLogs";

// Update the Organization type to match what OrganizationTable expects
type Organization = {
  organization: string;
  owner: string;
  employees: number;
  createdDate: string;
};

const AdminDashboard: React.FC = () => {
  // Add state for selected organization
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

  // Handler for row click
  const handleRowClick = (organization: Organization) => {
    setSelectedOrganization(organization);
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
                {/* Pass the row click handler */}
                <OrganizationTable onRowClick={handleRowClick} />
              </div>
              <AddOrganizationForm />
            </div>

            <div style={{ minHeight: 0 }}>
              {/* Conditionally render detail or logs */}
              {selectedOrganization ? (
                <OrganizationDetail
                  organization={selectedOrganization}
                  onBack={() => setSelectedOrganization(null)}
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
