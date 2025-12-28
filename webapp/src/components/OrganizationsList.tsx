import React, { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface Organization {
  id: string;
  name: string;
  membersCount?: number;
  createdAt?: string;
  ownerEmail?: string;
  status?: string;
}

interface Application {
  id: string;
  organizationId: string;
  userEmail: string;
}

interface OrganizationsListProps {
  orgs: Organization[];
  loading: boolean;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
  PAGE_SIZE?: number;
  onPendingOrgIdsChange?: (pending: Set<string>) => void; 
}

const OrganizationsList: React.FC<OrganizationsListProps> = ({
  orgs,
  loading,
  error,
  page,
  setPage,
  PAGE_SIZE = 12,
  onPendingOrgIdsChange, 
}) => {
  const totalOrgs = orgs.length;
  const pageCount = Math.ceil(totalOrgs / PAGE_SIZE);
  const pagedOrgs = orgs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const emptyRows = PAGE_SIZE - pagedOrgs.length > 0 ? PAGE_SIZE - pagedOrgs.length : 0;

  const startIdx = (page - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(page * PAGE_SIZE, totalOrgs);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => setPage(value);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleApplyClick = (org: Organization) => {
    setSelectedOrg(org);
    setModalOpen(true);
    setCvFile(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrg(null);
    setCvFile(null);
    setDocumentName(""); 
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
    } else {
      setCvFile(null);
    }
  };

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userProfileId, setUserProfileId] = useState<string | null>(null);
  const [appliedOrgIds, setAppliedOrgIds] = useState<Set<string>>(new Set());
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pendingOrgIds, setPendingOrgIds] = useState<Set<string>>(new Set());
  const [documentName, setDocumentName] = useState<string>("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email || null);
  }, []);

  interface Profile {
    id: string;
    email: string;
  }

  useEffect(() => {
    if (!userEmail) return;
    const token = localStorage.getItem("token") || "";
    fetch("http://localhost:8081/profiles", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then((profiles: Profile[]) => {
        const profile = profiles.find(p => p.email === userEmail);
        if (profile) setUserProfileId(profile.id);
      });
  }, [userEmail]);

  useEffect(() => {
    if (!userEmail) return;
    const token = localStorage.getItem("token") || "";
    fetch("http://localhost:8081/applications/mine", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then((apps: Application[]) => {
        const pendingIds = new Set(
          apps
            .filter(app => app.organizationId) 
            .map(app => String(app.organizationId))
        );
        setPendingOrgIds(pendingIds);
        if (onPendingOrgIdsChange) onPendingOrgIdsChange(pendingIds);
      })
      .catch(() => {
        setPendingOrgIds(new Set());
        if (onPendingOrgIdsChange) onPendingOrgIdsChange(new Set());
      });
  }, [userEmail, successOpen, onPendingOrgIdsChange]); 

  useEffect(() => {
    if (onPendingOrgIdsChange) {
      onPendingOrgIdsChange(appliedOrgIds);
    }
  }, [appliedOrgIds, onPendingOrgIdsChange]);

  const handleSubmitApplication = async () => {
    if (!selectedOrg || !cvFile || !userProfileId || !documentName.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("uploaderId", userProfileId);
      formData.append("file", cvFile);
      formData.append("name", documentName.trim());

      const docRes = await fetch("http://localhost:8081/documents/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
        body: formData,
      });
      if (!docRes.ok) throw new Error("Failed to upload document");
      const docData = await docRes.json();
      const cvDocumentId = docData.id;

      const appRes = await fetch("http://localhost:8081/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ organizationId: selectedOrg.id, cvDocumentId }),
      });

      if (!appRes.ok) {
        const errText = await appRes.text();
        setErrorMsg(`Failed to create application: ${errText}`);
        setErrorOpen(true);
        throw new Error("Failed to create application");
      }

      setAppliedOrgIds(prev => {
        const updated = new Set(prev);
        updated.add(String(selectedOrg.id));
        return updated;
      });

      fetch("http://localhost:8081/applications/mine", {
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      })
        .then(res => res.json())
        .then(apps => {
          console.log("All applications for current applicant after submit:", apps);
        })
        .catch(err => {
          console.log("Failed to fetch applications after submit:", err);
        });

      setSuccessOpen(true);
      setDocumentName("");
      handleCloseModal();
    } catch {
      handleCloseModal();
    }
  };

  return (
    <>
      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Your application has been submitted successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={errorOpen}
        autoHideDuration={4000}
        onClose={() => setErrorOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMsg}
        </Alert>
      </Snackbar>
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
          minHeight: 34 * PAGE_SIZE, 
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
                  {pendingOrgIds.has(String(org.id)) ? (
                    <span style={{ color: "#c89a5c", fontWeight: 500 }}>Pending...</span>
                  ) : (
                    <span
                      style={{ color: "#2e7d32", fontWeight: 500, cursor: "pointer" }}
                      onClick={() => handleApplyClick(org)}
                    >
                      Apply
                    </span>
                  )}
                </div>
              </div>
            ))}
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
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="apply-modal-title"
        aria-describedby="apply-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#fff",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            minWidth: 370,
            maxWidth: 400,
            outline: "none",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <div style={{ fontWeight: 600, color: "#374151", fontSize: "1.15rem", marginBottom: 8 }}>
            Apply to {selectedOrg?.name}
          </div>
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                fontWeight: 500,
                fontSize: "1rem",
                color: "#374151",
                marginBottom: 6,
              }}
            >
              Document name
            </label>
            <input
              type="text"
              value={documentName}
              onChange={e => setDocumentName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1.5px solid #dde3f0",
                fontSize: "0.8rem",
                marginBottom: "12px",
                outline: "none",
                boxSizing: "border-box",
                background: "#f8fafc",
                color: "#67728A",
              }}
              placeholder="Enter document name"
            />
            <div style={{ marginBottom: 18 }}>
              <label
                style={{
                  display: "block",
                  fontWeight: 500,
                  fontSize: "1rem",
                  color: "#374151",
                  marginBottom: 6,
                }}
              >
                Upload file (PDF only)
              </label>
              <label
                htmlFor="cv-upload"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1.5px dashed #e2e8f0",
                  borderRadius: 12,
                  background: "#f8fafc",
                  height: 70,
                  cursor: "pointer",
                  marginBottom: 0,
                  transition: "border-color 0.2s",
                }}
              >
                <input
                  id="cv-upload"
                  type="file"
                  accept="application/pdf"
                  style={{ display: "none" }}
                  onChange={handleCvChange}
                />
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <span style={{ color: "#64748b", fontSize: "1.7rem", display: "flex", alignItems: "center" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 16V4M12 16l-4-4M12 16l4-4" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="4" y="18" width="16" height="1.2" rx="1" fill="#64748b" />
                    </svg>
                  </span>
                  <span style={{
                    color: "#64748b",
                    fontSize: "0.9rem",
                    fontWeight: 400,
                    display: "inline-block",
                    maxWidth: 180,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    {cvFile
                      ? cvFile.name.length > 32
                        ? `${cvFile.name.slice(0, 20)}...${cvFile.name.slice(-8)}`
                        : cvFile.name
                      : "Choose a file"}
                  </span>
                </span>
              </label>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
            <Button
              variant="outlined"
              onClick={handleCloseModal}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontSize: "0.97rem",
                minWidth: 90,
                bgcolor: "#f4f6fb",
                color: "#374151",
                borderColor: "#dde3f0",
                "&:hover": { bgcolor: "#e9edf5", borderColor: "#cfd6e6" },
                "&:focus": { outline: "none", boxShadow: "none", borderColor: "#dde3f0" },
                "&:active": { outline: "none", boxShadow: "none", borderColor: "#dde3f0" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmitApplication}
              disabled={!cvFile || !documentName.trim()}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontSize: "0.97rem",
                minWidth: 150,
                bgcolor: "#374151",
                color: "#fff",
                boxShadow: "none",
                "&:hover": { bgcolor: "#276a2a" },
                "&:focus": { outline: "none", boxShadow: "none" },
                "&:active": { outline: "none", boxShadow: "none" },
              }}
            >
              Submit Application
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default OrganizationsList;
