import React, { useState } from "react";
import Navbar from "../components/Navbar";
import UserTable from "../components/UserTable";
import OrganizationStats from "../components/OrganizationStats";
import AddUserForm from "../components/AddUserForm";
import NewApplications from "../components/NewApplications";
import UserDetails from "../components/UserDetails";

const HrDashboard: React.FC = () => {
  const [showApplications, setShowApplications] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);


  function handleBackToStats(): void {
    setSelectedUser(null);
  }

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
                <UserTable onUserSelect={setSelectedUser} />
              </div>
              <AddUserForm />
            </div>

            {/* Right side: UserDetails if selected, else OrganizationStats or NewApplications */}
            <div style={{ minHeight: 0 }}>
              {selectedUser ? (
                <UserDetails user={selectedUser} onBackToStats={handleBackToStats}/>
              ) : showApplications ? (
                <NewApplications onBack={() => setShowApplications(false)} />
              ) : (
                <OrganizationStats onCheckApplications={() => setShowApplications(true)} />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default HrDashboard;
