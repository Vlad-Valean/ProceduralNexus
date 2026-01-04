import React, { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const API_BASE_URL = "http://localhost:8080";

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
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;
    const token = localStorage.getItem("token") || "";
    fetch(`${API_BASE_URL}/documents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then((docs: Document[]) => {
        const userDocs = docs.filter(doc => doc.uploaderEmail === email);
        console.log("Documents uploaded by user:", userDocs);
      })
      .catch(err => {
        console.error("Failed to fetch documents:", err);
      });
  }, []);

  const totalOrgs = orgs.length;
  const pageCount = Math.ceil(totalOrgs / PAGE_SIZE);
  const pagedOrgs = orgs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const emptyRows = PAGE_SIZE - pagedOrgs.length > 0 ? PAGE_SIZE - pagedOrgs.length : 0;

  const startIdx = (page - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(page * PAGE_SIZE, totalOrgs);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => setPage(value);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const handleApplyClick = (org: Organization) => {
    setSelectedOrg(org);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrg(null);
    setConfirmationChecked(false);
  };

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [appliedOrgIds, setAppliedOrgIds] = useState<Set<string>>(new Set());
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pendingOrgIds, setPendingOrgIds] = useState<Set<string>>(new Set());
  const [userCvName, setUserCvName] = useState<string>("");
  const [userCvId, setUserCvId] = useState<string>("");
  const [cvSnackbarOpen, setCvSnackbarOpen] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email || null);
  }, []);

  useEffect(() => {
    if (!userEmail) return;
    const token = localStorage.getItem("token") || "";
    fetch(`${API_BASE_URL}/documents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then((docs: Document[]) => {
        const cvDoc = docs.find(doc => doc.type === "CV");
        if (cvDoc && cvDoc.name) {
          setUserCvName(cvDoc.name);
          setUserCvId(cvDoc.id);
        } else {
          setUserCvName("");
          setUserCvId("");
        }
      })
      .catch(() => {
        setUserCvName("");
        setUserCvId("");
      });
  }, [userEmail]);



  interface Document {
    id: string;
    name: string;
    type: string;
    [key: string]: unknown;
  }

  useEffect(() => {
    if (!userEmail) return;
    const token = localStorage.getItem("token") || "";
    fetch(`${API_BASE_URL}/profiles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(() => {
      });
  }, [userEmail]);

  useEffect(() => {
    if (!userEmail) return;
    const token = localStorage.getItem("token") || "";
    fetch(`${API_BASE_URL}/applications/mine`, {
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
    try {
      if (!selectedOrg) return;
      const token = localStorage.getItem("token") || "";
      const appRes = await fetch(`${API_BASE_URL}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ organizationId: selectedOrg.id }),
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
      fetch(`${API_BASE_URL}/applications/mine`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      handleCloseModal();
    } catch {
      handleCloseModal();
    }
  };

  const [confirmationChecked, setConfirmationChecked] = useState(false);

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
                      style={{
                        color: "#2e7d32",
                        fontWeight: 500,
                        cursor: "pointer"
                      }}
                      onClick={() => {
                        if (userCvName) {
                          handleApplyClick(org);
                        } else {
                          setCvSnackbarOpen(true);
                        }
                      }}
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
      <Snackbar
        open={cvSnackbarOpen}
        autoHideDuration={4000}
        onClose={() => setCvSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setCvSnackbarOpen(false)}
          severity="warning"
          sx={{ width: "100%" }}
        >
          Please upload your CV on the profile page before applying.
        </Alert>
      </Snackbar>
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
          <div style={{ color: "#374151", fontSize: "1rem", marginBottom: 12 }}>
            You are about to submit an application to:
          </div>
          <div style={{ color: "#374151", fontSize: "0.98rem", marginBottom: 0 }}>
            <span style={{ fontWeight: 500 }}>Organization:</span> {selectedOrg?.name}
          </div>
          <div style={{ color: "#374151", fontSize: "0.98rem", marginBottom: 5 }}>
            <span style={{ fontWeight: 500, display: "block", marginBottom: 6 }}>Document to be submitted:</span>
            <span style={{ display: "flex", alignItems: "center", marginTop: 2 }}>
              {/* Only the icon and name are clickable */}
              <button
                type="button"
                disabled={!userCvId}
                onClick={() => {
                  if (!userCvId) return;
                  const token = localStorage.getItem("token") || "";
                  fetch(`${API_BASE_URL}/documents/${userCvId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  })
                    .then(async res => {
                      if (!res.ok) throw new Error("Failed to download document");
                      const blob = await res.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = userCvName || "document.pdf";
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      window.URL.revokeObjectURL(url);
                    })
                    .catch(() => {
                      alert("Failed to download document.");
                    });
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  color: "#64748b",
                  fontSize: "0.97rem",
                  fontWeight: 400,
                  cursor: userCvId ? "pointer" : "default",
                  textDecoration: userCvId ? "underline" : "none"
                }}
                tabIndex={userCvId ? 0 : -1}
                aria-label={userCvName ? `Download ${userCvName}` : "No CV uploaded"}
              >
                <svg style={{ marginRight: 6 }} width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 15V4M12 17l-4-4M12 17l4-4" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="4" y="20.3" width="16" height="1.2" rx="1" fill="#64748b" />
                </svg>
                {userCvName ? userCvName : "No CV uploaded"}
              </button>
            </span>
          </div>
          <div style={{ margin: "10px 0 0 0", display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              id="confirm-checkbox"
              checked={confirmationChecked}
              onChange={e => setConfirmationChecked(e.target.checked)}
              style={{
                marginRight: 14,
                width: 24,
                height: 24,
                accentColor: '#374151',
                cursor: 'pointer',
              }}
            />
            <label htmlFor="confirm-checkbox" style={{ fontSize: "0.8rem", color: "#374151", userSelect: "none" }}>
              All information and documents provided are accurate and complete to the best of my knowledge.
            </label>
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
              disabled={!confirmationChecked}
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
