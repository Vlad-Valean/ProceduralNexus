import React from "react";
import Pagination from "@mui/material/Pagination";

interface Organization {
  id: string;
  name: string;
  membersCount?: number;
  createdAt?: string;
  ownerEmail?: string;
  status?: string;
}

interface OrganizationsListProps {
  orgs: Organization[];
  loading: boolean;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
  PAGE_SIZE?: number;
}

const OrganizationsList: React.FC<OrganizationsListProps> = ({
  orgs,
  loading,
  error,
  page,
  setPage,
  PAGE_SIZE = 14,
}) => {
  const totalOrgs = orgs.length;
  const pageCount = Math.ceil(totalOrgs / PAGE_SIZE);
  const pagedOrgs = orgs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Calculate how many empty rows to add
  const emptyRows = PAGE_SIZE - pagedOrgs.length > 0 ? PAGE_SIZE - pagedOrgs.length : 0;

  const startIdx = (page - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(page * PAGE_SIZE, totalOrgs);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => setPage(value);

  return (
    <>
      {/* Header row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2.5fr 1.2fr 1.2fr 2fr 1fr",
          alignItems: "center",
          padding: "0 32px",
          height: 40,
          background: "#CCD6E2",
          borderRadius: 8,
          fontWeight: 500,
          color: "#3D3C42",
          fontSize: "1rem",
          marginBottom: 0,
        }}
      >
        <div style={{ textAlign: "left" }}>Organization</div>
        <div style={{ textAlign: "left" }}>No. of members</div>
        <div style={{ textAlign: "left" }}>Created date</div>
        <div style={{ textAlign: "left" }}>Contact</div>
        <div style={{ textAlign: "center" }}>Status</div>
      </div>
      <div
        style={{
          borderRadius: 0,
          overflow: "hidden",
          background: "#fff",
          boxShadow: "none",
          marginTop: 16,
          minHeight: 34 * PAGE_SIZE, // Ensure minimum height for PAGE_SIZE rows
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "#64748b" }}>Loading organizations...</div>
        ) : error ? (
          <div style={{ padding: 48, textAlign: "center", color: "red" }}>{error}</div>
        ) : pagedOrgs.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#64748b" }}>No organizations found.</div>
        ) : (
          <>
            {pagedOrgs.map((org, idx) => (
              <div
                key={org.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2.5fr 1.2fr 1.2fr 2fr 1fr",
                  alignItems: "center",
                  padding: "0 32px",
                  height: 34,
                  background: "#fff",
                  fontSize: "0.9rem",
                  borderBottom: idx === pagedOrgs.length - 1 && emptyRows === 0 ? "none" : "1px solid #e2e8f0",
                }}
              >
                <div style={{ fontWeight: 500, color: "#3D3C42", textAlign: "left" }}>{org.name}</div>
                <div style={{ color: "#3D3C42", textAlign: "left" }}>{org.membersCount ?? "-"}</div>
                <div style={{ color: "#3D3C42", textAlign: "left" }}>
                  {org.createdAt
                    ? new Date(org.createdAt).toLocaleDateString("en-GB")
                    : "-"}
                </div>
                <div style={{ color: "#3D3C42", textAlign: "left" }}>{org.ownerEmail ?? "-"}</div>
                <div style={{ textAlign: "center" }}>
                  {org.status === "pending" ? (
                    <span style={{ color: "#c89a5c", fontWeight: 500 }}>Pending...</span>
                  ) : (
                    <span style={{ color: "#2e7d32", fontWeight: 500, cursor: "pointer" }}>Apply</span>
                  )}
                </div>
              </div>
            ))}
            {/* Add empty rows to fill the table */}
            {Array.from({ length: emptyRows }).map((_, idx) => (
              <div
                key={`empty-row-${idx}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2.5fr 1.2fr 1.2fr 2fr 1fr",
                  alignItems: "left",
                  padding: "0 32px",
                  height: 34,
                  background: "#fff",
                  fontSize: "0.9rem",
                  // Remove border for empty rows
                  borderBottom: "none",
                  color: "transparent",
                  userSelect: "none",
                }}
              >
                <div>&nbsp;</div>
                <div>&nbsp;</div>
                <div>&nbsp;</div>
                <div>&nbsp;</div>
                <div>&nbsp;</div>
              </div>
            ))}
          </>
        )}
        {/* Pagination (like UserTable) */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 24,
          marginBottom: 0,
          minHeight: 40,
        }}>
          <span style={{ color: "#B5B7C0", fontSize: "0.85rem", fontWeight: 400 }}>
            {`Showing data ${startIdx} to ${endIdx} of ${totalOrgs} entries`}
          </span>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            siblingCount={1}
            boundaryCount={1}
            color="primary"
            shape="rounded"
            size="small"
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: "0.75rem",
                minWidth: 24,
                height: 24,
                boxShadow: "none !important",
                borderColor: "#67728A !important",
                padding: "2px 6px",
                outline: "none !important",
              },
              "& .MuiPaginationItem-root:focus": {
                boxShadow: "none !important",
                outline: "none !important",
                borderColor: "#67728A !important",
              },
              "& .MuiPaginationItem-root:active": {
                boxShadow: "none !important",
                outline: "none !important",
                borderColor: "#67728A !important",
              },
              "& .MuiPaginationItem-root.Mui-focusVisible": {
                boxShadow: "none !important",
                outline: "none !important",
                borderColor: "#67728A !important",
              },
              "& .Mui-selected": {
                backgroundColor: "#67728A !important",
                color: "#fff !important",
                borderColor: "#67728A !important",
                borderWidth: "1.5px",
                borderStyle: "solid",
              },
              "& .Mui-selected:hover": {
                backgroundColor: "#5a6276 !important",
              },
            }}
            showFirstButton={false}
            showLastButton={false}
          />
        </div>
      </div>
    </>
  );
};

export default OrganizationsList;
