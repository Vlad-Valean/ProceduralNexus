import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { Box, Container, Typography, Paper, TextField, Button } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

type ProfileDto = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  roles: string[];
  organizationId: number;
};

type OrganizationDto = {
  id: number;
  name: string;
  ownerId: string;
  ownerFirstname: string;
  ownerLastname: string;
  ownerEmail: string;
  membersCount: number;
  createdAt: string;
  updatedAt: string;
};

type DocumentDto = {
  id: number;
  name: string;
  type: string; // "CV" | "OTHER" |
  fileSizeInBytes: number;
  batchId?: string | null;
  signed: boolean;
  filePath: string;
  createdAt: string;
  updatedAt: string;
  uploaderId: string;
  uploaderEmail: string;
};

const API_BASE = "http://localhost:8080";

const Profile: React.FC = () => {
  const token = useMemo(() => localStorage.getItem("token") ?? "", []);
  const userEmail = useMemo(() => (localStorage.getItem("userEmail") ?? "").trim(), []);

  const [profileId, setProfileId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    role: "",
  });

  const [initialFormData, setInitialFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    role: "",
  });

  const [cvLoading, setCvLoading] = useState<boolean>(false);
  const [cvSaving, setCvSaving] = useState<boolean>(false);
  const [cvError, setCvError] = useState<string | null>(null);

  const [existingCv, setExistingCv] = useState<DocumentDto | null>(null);

  const [cvData, setCvData] = useState({
    documentName: "",
    file: null as File | null,
  });

  const [initialCvData, setInitialCvData] = useState({
    documentName: "",
    fileName: "",
  });

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "white",
      fontSize: "14px",
      fontFamily: "Inter, system-ui, Helvetica, Arial, sans-serif",
      "& fieldset": { borderColor: "#E6E8EE" },
      "&:hover fieldset": { borderColor: "#67728A" },
      "&.Mui-focused fieldset": { borderColor: "#67728A" },
    },
  };

  const disabledTextFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "#F8FAFC",
      fontSize: "14px",
      fontFamily: "Inter, system-ui, Helvetica, Arial, sans-serif",
      "& fieldset": { borderColor: "#E6E8EE" },
    },
  };

  const labelSx = {
    fontSize: "12px",
    fontWeight: 500,
    color: "#667085",
    mb: 0.5,
    display: "block",
    fontFamily: "Inter, system-ui, Helvetica, Arial, sans-serif",
  };

  const outlinedButtonSx = {
    color: "#222",
    borderColor: "#E6E8EE",
    textTransform: "none" as const,
    borderRadius: "10px",
    fontSize: "14px",
    fontFamily: "Inter, system-ui, Helvetica, Arial, sans-serif",
    boxShadow: "none !important",
    outline: "none !important",
    "&:hover": {
      borderColor: "#67728A",
      backgroundColor: "rgba(103, 114, 138, 0.04)",
    },
    "&:focus": {
      boxShadow: "none !important",
      outline: "none !important",
      borderColor: "#67728A",
    },
  };

  const primaryButtonSx = {
    backgroundColor: "#67728A",
    color: "white",
    textTransform: "none" as const,
    borderRadius: "10px",
    px: 3,
    fontSize: "14px",
    fontFamily: "Inter, system-ui, Helvetica, Arial, sans-serif",
    boxShadow: "none !important",
    outline: "none !important",
    "&:hover": {
      backgroundColor: "#5a6276",
      outline: "none !important",
      boxShadow: "none !important",
    },
    "&:focus": {
      outline: "none !important",
      boxShadow: "none !important",
    },
  };

  const hasNameChanges =
    formData.firstName !== initialFormData.firstName ||
    formData.lastName !== initialFormData.lastName;

  const hasCvChanges =
    cvData.documentName.trim() !== initialCvData.documentName.trim() ||
    (cvData.file ? cvData.file.name : "") !== initialCvData.fileName;

  useEffect(() => {
    const loadCvForUser = async (uploaderId: string) => {
      try {
        setCvLoading(true);
        setCvError(null);

        const docsRes = await fetch(
          `${API_BASE}/documents?uploaderId=${encodeURIComponent(uploaderId)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!docsRes.ok) {
          const text = await docsRes.text().catch(() => "");
          throw new Error(
            `GET /documents failed: ${docsRes.status} ${docsRes.statusText}${text ? ` - ${text}` : ""}`
          );
        }

        const docs = (await docsRes.json()) as DocumentDto[];
        const cv = docs.find((d) => (d.type ?? "").toUpperCase() === "CV") ?? null;

        setExistingCv(cv);

        if (cv) {
          setCvData({ documentName: cv.name ?? "", file: null });
          setInitialCvData({ documentName: cv.name ?? "", fileName: "" });
        } else {
          setCvData({ documentName: "", file: null });
          setInitialCvData({ documentName: "", fileName: "" });
        }
      } catch (err: unknown) {
        setCvError(err instanceof Error ? err.message : "Failed to load CV.");
      } finally {
        setCvLoading(false);
      }
    };

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!userEmail) {
          throw new Error("Missing userEmail in localStorage.");
        }

        const profilesRes = await fetch(`${API_BASE}/profiles`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!profilesRes.ok) {
          const text = await profilesRes.text().catch(() => "");
          throw new Error(
            `GET /profiles failed: ${profilesRes.status} ${profilesRes.statusText}${text ? ` - ${text}` : ""}`
          );
        }

        const profiles = (await profilesRes.json()) as ProfileDto[];
        const me = profiles.find(
          (p) => (p.email ?? "").toLowerCase() === userEmail.toLowerCase()
        );

        if (!me) {
          throw new Error(`Profile not found for email: ${userEmail}`);
        }

        setProfileId(me.id);

        let orgName = "";
        if (me.organizationId !== null && me.organizationId !== undefined) {
          const orgRes = await fetch(`${API_BASE}/organizations/${me.organizationId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });

          if (!orgRes.ok) {
            const text = await orgRes.text().catch(() => "");
            throw new Error(
              `GET /organizations/${me.organizationId} failed: ${orgRes.status} ${orgRes.statusText}${text ? ` - ${text}` : ""}`
            );
          }

          const org = (await orgRes.json()) as OrganizationDto;
          orgName = org?.name ?? "";
        }

        const roleText = Array.isArray(me.roles) && me.roles.length ? me.roles.join(", ") : "";

        const loadedProfile = {
          firstName: me.firstname ?? "",
          lastName: me.lastname ?? "",
          email: me.email ?? "",
          organization: orgName,
          role: roleText,
        };

        setFormData(loadedProfile);
        setInitialFormData(loadedProfile);

        await loadCvForUser(me.id);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, userEmail]);

  const handleCancelLeft = () => {
    if (!hasNameChanges) return;
    setFormData((prev) => ({
      ...prev,
      firstName: initialFormData.firstName,
      lastName: initialFormData.lastName,
    }));
    setError(null);
  };

  const handleSaveLeft = async () => {
    try {
      if (!profileId) return;

      setSaving(true);
      setError(null);

      const patchRes = await fetch(`${API_BASE}/profiles/${profileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          firstname: formData.firstName,
          lastname: formData.lastName,
        }),
      });

      if (!patchRes.ok) {
        const text = await patchRes.text().catch(() => "");
        throw new Error(
          `PATCH /profiles/${profileId} failed: ${patchRes.status} ${patchRes.statusText}${text ? ` - ${text}` : ""}`
        );
      }

      setInitialFormData((prev) => ({
        ...prev,
        firstName: formData.firstName,
        lastName: formData.lastName,
      }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setCvData((prev) => ({ ...prev, file }));
  };

  const handleCancelCv = () => {
    if (!hasCvChanges) return;

    setCvData({
      documentName: initialCvData.documentName,
      file: null,
    });

    const input = document.getElementById("cv-upload-input") as HTMLInputElement | null;
    if (input) input.value = "";

    setCvError(null);
  };

  const handleSaveCv = async () => {
    try {
      if (!profileId) return;

      setCvSaving(true);
      setCvError(null);

      const docName = cvData.documentName.trim();
      const file = cvData.file;

      if (!file) throw new Error("Please select a file to upload your CV.");
      if (!docName) throw new Error("Please enter a document name.");

      if (existingCv?.id) {
        const delRes = await fetch(`${API_BASE}/documents/${existingCv.id}`, {
          method: "DELETE",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!delRes.ok && delRes.status !== 204) {
          const text = await delRes.text().catch(() => "");
          throw new Error(
            `DELETE /documents/${existingCv.id} failed: ${delRes.status} ${delRes.statusText}${text ? ` - ${text}` : ""}`
          );
        }
      }

      const form = new FormData();
      form.append("file", file);

      const uploadUrl =
        `${API_BASE}/documents/upload` +
        `?name=${encodeURIComponent(docName)}` +
        `&uploaderId=${encodeURIComponent(profileId)}` +
        `&type=CV`;

      const upRes = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: form,
      });

      if (!upRes.ok) {
        const text = await upRes.text().catch(() => "");
        throw new Error(
          `POST /documents/upload failed: ${upRes.status} ${upRes.statusText}${text ? ` - ${text}` : ""}`
        );
      }

      const savedCv = (await upRes.json()) as DocumentDto;

      setExistingCv(savedCv);
      setCvData({ documentName: savedCv.name ?? docName, file: null });

      const input = document.getElementById("cv-upload-input") as HTMLInputElement | null;
      if (input) input.value = "";

      setInitialCvData({ documentName: savedCv.name ?? docName, fileName: "" });
    } catch (err: unknown) {
      setCvError(err instanceof Error ? err.message : "Failed to save CV.");
    } finally {
      setCvSaving(false);
    }
  };

  const handleDownloadCv = async () => {
    try {
      if (!existingCv?.id) return;

      const res = await fetch(`${API_BASE}/documents/${existingCv.id}`, {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          `Download failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`
        );
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download =
        (existingCv.name?.toLowerCase().endsWith(".pdf")
          ? existingCv.name
          : `${existingCv.name}.pdf`) || "cv.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setCvError(err instanceof Error ? err.message : "Failed to download CV.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Navbar />

      <Container maxWidth={false} sx={{ mt: 4, mb: 8, px: { xs: 1, sm: 4, md: 8 } }}>
        <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
          <Box sx={{ flex: 2, minWidth: 0 }}>
            <Paper
              sx={{
                p: 4,
                borderRadius: "12px",
                border: "1px solid #E6E8EE",
                boxShadow: "0px 8px 24px rgba(16, 24, 40, 0.08)",
                backgroundColor: "white",
                minHeight: 520,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{
                  fontSize: "22px",
                  fontWeight: 700,
                  mb: 1,
                  mt: 1,
                  color: "#111827",
                  fontFamily: "Inter, system-ui, Helvetica, Arial, sans-serif",
                  textAlign: "center",
                  letterSpacing: "0.5px",
                }}
              >
                Profile information
              </Typography>

              {loading && (
                <Typography sx={{ fontSize: "13px", color: "#667085", mb: 2 }}>
                  Loading profile...
                </Typography>
              )}
              {error && (
                <Typography sx={{ fontSize: "13px", color: "#B42318", mb: 2 }}>
                  {error}
                </Typography>
              )}

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
                <Box>
                  <Typography component="label" sx={{ ...labelSx, textAlign: "left" }}>
                    First name
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    autoComplete="off"
                    sx={{ ...textFieldSx, "& input": { textAlign: "left" } }}
                    disabled={loading || saving}
                  />
                </Box>

                <Box>
                  <Typography component="label" sx={{ ...labelSx, textAlign: "left" }}>
                    Last name
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    autoComplete="off"
                    sx={{ ...textFieldSx, "& input": { textAlign: "left" } }}
                    disabled={loading || saving}
                  />
                </Box>

                <Box>
                  <Typography component="label" sx={{ ...labelSx, textAlign: "left" }}>
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.email}
                    disabled
                    sx={{ ...disabledTextFieldSx, "& input": { textAlign: "left" } }}
                  />
                </Box>

                <Box>
                  <Typography component="label" sx={{ ...labelSx, textAlign: "left" }}>
                    Organization
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.organization}
                    disabled
                    sx={{ ...disabledTextFieldSx, "& input": { textAlign: "left" } }}
                  />
                </Box>

                <Box>
                  <Typography component="label" sx={{ ...labelSx, textAlign: "left" }}>
                    Role
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.role}
                    disabled
                    sx={{ ...disabledTextFieldSx, "& input": { textAlign: "left" } }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
                <Button
                  variant="outlined"
                  sx={{ ...outlinedButtonSx, px: 3 }}
                  onClick={handleCancelLeft}
                  disabled={loading || saving || !hasNameChanges}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={primaryButtonSx}
                  onClick={handleSaveLeft}
                  disabled={loading || saving || !profileId || !hasNameChanges}
                >
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </Box>
            </Paper>
          </Box>

          <Box
            sx={{
              width: "420px",
              minWidth: "340px",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Paper
              sx={{
                p: 3,
                borderRadius: "12px",
                border: "1px solid #E6E8EE",
                boxShadow: "0px 8px 24px rgba(16, 24, 40, 0.08)",
                backgroundColor: "white",
              }}
            >
              <Typography
                sx={{
                  fontSize: "22px",
                  fontWeight: 700,
                  mb: 1,
                  mt: 1,
                  color: "#111827",
                  fontFamily: "Inter, system-ui, Helvetica, Arial, sans-serif",
                  textAlign: "center",
                  letterSpacing: "0.5px",
                }}
              >
                Upload your Resume
              </Typography>

              {cvLoading && (
                <Typography sx={{ fontSize: "13px", color: "#667085", mb: 2, textAlign: "center" }}>
                  Loading CV...
                </Typography>
              )}
              {cvError && (
                <Typography sx={{ fontSize: "13px", color: "#B42318", mb: 2, textAlign: "center" }}>
                  {cvError}
                </Typography>
              )}

              {existingCv && (
                <Box
                  sx={{
                    border: "1px solid #E6E8EE",
                    borderRadius: "10px",
                    p: 2,
                    mb: 2,
                    backgroundColor: "#F8FAFC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: "12px", color: "#667085" }}>Current CV</Typography>
                    <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "#111827" }} noWrap>
                      {existingCv.name}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    sx={{ ...outlinedButtonSx, px: 2, whiteSpace: "nowrap" }}
                    onClick={handleDownloadCv}
                    disabled={cvLoading || cvSaving}
                  >
                    Download
                  </Button>
                </Box>
              )}

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <Typography component="label" sx={{ ...labelSx, textAlign: "left" }}>
                    Document name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="e.g. JohnDoeCV"
                    value={cvData.documentName}
                    onChange={(e) => setCvData({ ...cvData, documentName: e.target.value })}
                    autoComplete="off"
                    sx={{ ...textFieldSx, mt: 1.5, "& input": { textAlign: "left" } }}
                    disabled={cvLoading || cvSaving}
                  />
                </Box>

                <Box>
                  <Typography component="label" sx={{ ...labelSx, textAlign: "left" }}>
                    Upload resume
                  </Typography>

                  <Box
                    sx={{
                      border: "1px dashed #E6E8EE",
                      borderRadius: "10px",
                      p: 3,
                      mt: 1.5,
                      textAlign: "center",
                      backgroundColor: "#FAFAFA",
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: "#67728A",
                        backgroundColor: "#F5F5F5",
                      },
                      opacity: cvLoading || cvSaving ? 0.7 : 1,
                      pointerEvents: cvLoading || cvSaving ? "none" : "auto",
                    }}
                    onClick={() => document.getElementById("cv-upload-input")?.click()}
                  >
                    <input
                      id="cv-upload-input"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCvFileChange}
                      style={{ display: "none" }}
                    />
                    <CloudUploadOutlinedIcon sx={{ fontSize: 40, color: "#67728A", mb: 1 }} />

                    <Typography sx={{ fontSize: "14px", color: "#111827", mb: 0.5, textAlign: "center" }}>
                      {cvData.file
                        ? cvData.file.name
                        : existingCv
                          ? "Click to upload a new CV (will replace current)"
                          : "Click to upload"}
                    </Typography>

                    <Typography sx={{ fontSize: "12px", color: "#98A2B3", textAlign: "center" }}>
                      PDF, DOC, DOCX (max 5MB)
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 1 }}>
                  <Button
                    variant="outlined"
                    sx={{ ...outlinedButtonSx, px: 3 }}
                    onClick={handleCancelCv}
                    disabled={cvLoading || cvSaving || !hasCvChanges}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    sx={primaryButtonSx}
                    onClick={handleSaveCv}
                    disabled={cvLoading || cvSaving || !profileId || !hasCvChanges}
                  >
                    {cvSaving ? "Saving..." : "Save changes"}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Profile;
