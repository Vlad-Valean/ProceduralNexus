import React from "react";
import Navbar from "../components/Navbar";
import UserTable from "../components/UserTable";
import OrganizationStats from "../components/OrganizationStats";
import AddUserForm from "../components/AddUserForm";

const HrDashboard: React.FC = () => {
  return (
    <>
      <Navbar />
      <main
        style={{
          padding: "20px 32px 18px",         
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
              gap: 32,
              alignItems: "stretch", 
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
                minHeight: 0,
              }}
            >
              <div style={{ flex: 1, minHeight: 0 }}>
                <UserTable />
              </div>

              <AddUserForm />
            </div>

            <OrganizationStats />
          </div>
        </div>
      </main>
    </>
  );
};

export default HrDashboard;
