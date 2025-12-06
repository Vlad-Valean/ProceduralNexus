import React, { useState } from "react";
import Navbar from "../components/Navbar";
import UserTable from "../components/UserTable";
import OrganizationStats from "../components/OrganizationStats";
import AddUserForm from "../components/AddUserForm";
import NewApplications from "../components/NewApplications";

const HrDashboard: React.FC = () => {
  const [showApplications, setShowApplications] = useState(false);

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
                <UserTable />
              </div>
              <AddUserForm />
            </div>

            {!showApplications ? (
              <OrganizationStats
                onCheckApplications={() => setShowApplications(true)}
              />
            ) : (
              <NewApplications onBack={() => setShowApplications(false)} />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default HrDashboard;
