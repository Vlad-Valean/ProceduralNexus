import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import organizationsMarket from "../assets/organization_marketplace.png";
import clouds from "../assets/clouds.svg";
import agreement from "../assets/agreement.svg";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import OrganizationsList from "../components/OrganizationsList";

interface Organization {
  id: string;
  name: string;
  membersCount?: number;
  createdAt?: string;
  ownerEmail?: string; 
  status?: string;
}

const Market: React.FC = () => {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [page, setPage] = useState(1);
  const filterOpen = Boolean(filterAnchorEl);

  const handleScrollToNextPage = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("JWT token:", token);
    if (!token) {
      setTimeout(() => {
        setError("You are not logged in. Please log in to view organizations.");
        setLoading(false);
      }, 0);
      return;
    }
    fetch("http://localhost:8080/organizations", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("Response status:", res.status);
        return res.json().then((data) => {
          console.log("Organizations API response:", data);
          if (!res.ok) throw new Error("Network response was not ok");
          return data;
        });
      })
      .then((data) => {
        setOrgs(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load organizations.");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <main
        style={{
          position: "absolute",
          top: "60px",
          left: 0,
          right: 0,
          width: "100vw",
          height: "calc(100vh - 60px)",
          boxSizing: "border-box",
          padding: 0,
          margin: 0,
          backgroundImage: `url(${organizationsMarket})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          overflowX: "hidden",
          zIndex: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ flex: 1, position: "relative" }}>
            <img
              src={clouds}
              alt="clouds left"
              className="clouds-left-animate"
              style={{
                position: "absolute",
                top: "45px",
                left: "-150px",
                width: "30vw",
                minWidth: 320,
                maxWidth: 480,
                pointerEvents: "none",
                userSelect: "none",
              }}
            />
            <img
              src={clouds}
              alt="Clouds right"
              className="clouds-right-animate"
              style={{
                position: "absolute",
                top: "190px",
                right: -850,
                width: "24vw",
                minWidth: 0,
                maxWidth: "100%",
                zIndex: 2,
                pointerEvents: "none",
                userSelect: "none",
              }}
            />
            <div
              style={{
                position: "relative",
                color: "#fff",
                textAlign: "left",
                paddingLeft: "10vw",
                maxWidth: 540,
                top: "22vh",
              }}
            >
              <h2
                style={{
                  fontSize: "3.5rem",
                  fontWeight: 700,
                  color: "transparent",
                  WebkitTextStroke: "1px #fff",
                  lineHeight: 1.1,
                  marginBottom: "0.4rem",
                  letterSpacing: "2px",
                }}
              >
                ORGANIZATION
              </h2>
              <h2
                style={{
                  fontSize: "2.9rem",
                  fontWeight: 600,
                  color: "#fff",
                  margin: "0 0 0.5rem 0",
                  letterSpacing: "1px",
                  lineHeight: 1.1,
                }}
              >
                MARKET
                <span style={{ color: "#CBD5E0", fontWeight: 500 }}>PLACE</span>
              </h2>
              <p
                style={{
                  fontSize: "1.14rem",
                  color: "#fff",
                  margin: "1.5rem 0 0.5rem 0",
                  fontWeight: 400,
                }}
              >
                Apply now to join an organization and start building
                <br />
                meaningful connections.
              </p>
              <div style={{ position: "relative", width: 445 }}>
                <TextField
                  placeholder="Search an organization"
                  size="small"
                  variant="outlined"
                  autoComplete="off"
                  inputProps={{
                    autoComplete: "off",
                  }}
                  sx={{
                    bgcolor: "#f4f6fb",
                    borderRadius: 2,
                    width: 445,
                    mt: 8,
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      height: 42,
                      fontSize: "1rem",
                      bgcolor: "#f4f6fb",
                      "& fieldset": { borderColor: "#dde3f0" },
                      "&:hover fieldset": { borderColor: "#cfd6e6" },
                      "&.Mui-focused fieldset": { borderColor: "#a5b1c8" },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#67728A", fontSize: 22 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <div
                  className="scroll-bounce"
                  onClick={handleScrollToNextPage}
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    marginTop: "5rem",
                    textAlign: "center",
                    color: "#fff",
                    fontSize: "1rem",
                    fontWeight: 400,
                    letterSpacing: "0.5px",
                    fontFamily: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "max-content",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <span>Scroll to see all organizations</span>
                  <span style={{ marginTop: 1 }} className="scroll-bounce-arrow">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <polyline
                        points="14,20 24,30 34,20"
                        stroke="#fff"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polyline
                        points="14,28 24,38 34,28"
                        stroke="#fff"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              height: "100%",
              position: "relative",
              zIndex: 3,
            }}
          >
            <img
              src={agreement}
              alt="Organization Marketplace"
              style={{
                width: "60vw",
                maxWidth: 560,
                minWidth: 260,
                height: "auto",
                objectFit: "contain",
                marginRight: "12vw",
                marginTop: 42,
              }}
            />
          </div>
        </div>
      </main>
      <div
        style={{
          position: "absolute",
          top: "calc(100vh)",
          left: 0,
          right: 0,
          width: "100vw",
          minHeight: "100vh",
          background: "#fff",
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 12px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 36,
            marginTop: 50,
            gap: 16,
          }}>
            <h2 style={{
              fontSize: "1.9rem",
              fontWeight: 700,
              color: "#3D3C42",
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: "-0.5px",
              textAlign: "left",
              flex: "1 1 auto",
            }}>
              Organizations
            </h2>
            <div style={{ display: "flex", gap: 8 }}>
              <div
                className="searchbar-expand"
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#6f7688",
                  borderRadius: 10,
                  transition: "width 0.3s cubic-bezier(.4,2,.6,1), background 0.2s",
                  width: searchActive ? 140 : 38, 
                  height: 32, 
                  boxShadow: searchActive ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                  cursor: "pointer",
                  paddingLeft: 10,
                  paddingRight: 1,
                  position: "relative",
                }}
                onMouseEnter={() => setSearchActive(true)}
                onMouseLeave={() => setSearchActive(false)}
                tabIndex={0}
              >
                <SearchIcon sx={{ color: "#fff", fontSize: 22 }} />
                <input
                  type="text"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  placeholder="Search"
                  className="searchbar-input"
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: "#fff",
                    fontSize: "0.98rem",
                    marginLeft: 4,
                    width: searchActive ? 80 : 0,
                    opacity: searchActive ? 1 : 0,
                    transition: "width 0.3s cubic-bezier(.4,2,.6,1), opacity 0.2s",
                    padding: 0,
                  }}
                  autoFocus={searchActive}
                />
                <style>
                  {`
                    .searchbar-input::placeholder {
                      color: #fff !important;
                      opacity: 0.5;
                      font-size: 0.9rem;
                    }
                  `}
                </style>
              </div>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#6f7688",
                  color: "#fff",
                  borderRadius: 2,
                  height: 32,
                  fontWeight: 400,
                  textTransform: "none",
                  px: 2,
                  fontSize: "0.9rem",
                  minWidth: 70,
                  boxShadow: "none", 
                  outline: "none",
                  border: "none",
                  "&:hover": {
                    bgcolor: "#575d6b",
                    boxShadow: "none",
                  },
                  "&:focus": {
                    outline: "none",
                    border: "none",
                  },
                  "&:active": {
                    outline: "none",
                    border: "none",
                  },
                }}
                startIcon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 5h18M6 10h12M10 15h4"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                onClick={handleFilterClick}
              >
                Filter
              </Button>
              <Menu
                anchorEl={filterAnchorEl}
                open={filterOpen}
                onClose={handleFilterClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 3,
                    minWidth: 100,
                    boxShadow: "0 4px 24px rgba(30,41,59,0.10)",
                    bgcolor: "#fff",
                    p: 1,
                  },
                }}
                MenuListProps={{
                  sx: {
                    p: 0,
                  },
                }}
              >
                <div style={{
                  padding: "2px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                }}>
                  <MenuItem
                    onClick={handleFilterClose}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 500,
                      fontSize: "0.7rem",
                      color: "#374151",
                      px: 2,
                      py: 1.2,
                      mb: 0.5,
                      transition: "background 0.15s",
                      "&:hover": {
                        bgcolor: "#f4f6fb",
                        color: "#222",
                      },
                    }}
                  >
                    Organization Name
                  </MenuItem>
                  <MenuItem
                    onClick={handleFilterClose}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 500,
                      fontSize: "0.7rem",
                      color: "#374151",
                      px: 2,
                      py: 1.2,
                      mb: 0.5,
                      transition: "background 0.15s",
                      "&:hover": {
                        bgcolor: "#f4f6fb",
                        color: "#222",
                      },
                    }}
                  >
                    No. of Members
                  </MenuItem>
                  <MenuItem
                    onClick={handleFilterClose}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 500,
                      fontSize: "0.7rem",
                      color: "#374151",
                      px: 2,
                      py: 1.2,
                      mb: 0.5,
                      transition: "background 0.15s",
                      "&:hover": {
                        bgcolor: "#f4f6fb",
                        color: "#222",
                      },
                    }}
                  >
                    Date Created
                  </MenuItem>
                  <MenuItem
                    onClick={handleFilterClose}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 500,
                      fontSize: "0.7rem",
                      color: "#374151",
                      px: 2,
                      py: 1.2,
                      mb: 0.5,
                      transition: "background 0.15s",
                      "&:hover": {
                        bgcolor: "#f4f6fb",
                        color: "#222",
                      },
                    }}
                  >
                    Status
                  </MenuItem>
                </div>
              </Menu>
            </div>
          </div>
          <OrganizationsList
            orgs={orgs}
            loading={loading}
            error={error}
            page={page}
            setPage={setPage}
            PAGE_SIZE={14}
          />
        </div>
      </div>
      <style>
        {`
          html, body {
            margin: 0;
            padding: 0;
            background: transparent;
            width: 100vw;
            overflow-x: hidden;
          }
          .clouds-left-animate {
            opacity: 0;
            transform: translateX(-200px);
            animation: cloudLeftIn 1.2s cubic-bezier(.4,2,.6,1) 0.1s forwards;
          }
          @keyframes cloudLeftIn {
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .clouds-right-animate {
            opacity: 0;
            transform: translateX(200px);
            animation: cloudRightIn 1.2s cubic-bezier(.4,2,.6,1) 0.1s forwards;
          }
          @keyframes cloudRightIn {
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .scroll-bounce {
            transition: filter 0.2s;
          }
          .scroll-bounce:hover {
            filter: brightness(1.2);
          }
          .scroll-bounce-arrow {
            animation: bounceDown 2s infinite cubic-bezier(.4,2,.6,1);
            display: inline-block;
          }
          @keyframes bounceDown {
            0% { transform: translateY(0);}
            30% { transform: translateY(5px);}
            50% { transform: translateY(0);}
            70% { transform: translateY(5px);}
            100% { transform: translateY(0);}
          }
        `}
      </style>
    </>
  );
};

export default Market;
