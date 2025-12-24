import React from "react";
import Navbar from "../components/Navbar";
import organizationsMarket from "../assets/organization_marketplace.png";
import agreement from "../assets/agreement.svg";
import clouds from "../assets/clouds.svg";
import SearchIcon from "@mui/icons-material/Search";
import { TextField, InputAdornment } from "@mui/material";

const Market: React.FC = () => {
  return (
    <>
      <Navbar />
      <main style={{ padding: 0, margin: 0 }}>
        {/* Hero Section with two columns */}
        <section
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundImage: `url(${organizationsMarket})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 0,
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            alignItems: "center",
            justifyItems: "center",
            overflow: "hidden",
          }}
        >
          {/* Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(103,114,138,0.45)",
              zIndex: 1,
            }}
          />
          {/* Clouds left */}
          <img
            src={clouds}
            alt="Clouds left"
            style={{
              position: "absolute",
              top: "110px", // move lower (adjust as needed)
              left: "-150px", // move more to the left (adjust as needed)
              width: "32vw",
              minWidth: 320,
              maxWidth: 480,
              zIndex: 2,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
          {/* Clouds right */}
          <img
            src={clouds}
            alt="Clouds right"
            style={{
              position: "absolute",
              top: "220px", // move lower (adjust as needed)
              right: "-100px", // move more to the right (adjust as needed)
              width: "24vw",
              minWidth: 320,
              maxWidth: 480,
              zIndex: 2,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
          {/* Left column: Text */}
          <div
            style={{
              position: "relative",
              zIndex: 3,
              color: "#fff",
              textAlign: "left",
              paddingLeft: "7vw",
              paddingRight: "2vw",
              maxWidth: 540,
              top: "80px", // move the text lower (increase value as needed)
            }}
          >
            <h2
              style={{
                fontSize: "3.5rem",
                fontWeight: 700,
                color: "transparent",
                WebkitTextStroke: "1px #fff",
                textShadow: "0 2px 8px rgba(103,114,138,0.18)",
                marginBottom: "0.4rem", // increased space below ORGANIZATION
                letterSpacing: "2px",
                lineHeight: 1.1,
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
                textShadow: "0 2px 8px rgba(103,114,138,0.18)",
              }}
            >
              MARKET
              <span style={{ color: "#CBD5E0", fontWeight: 500 }}>place</span>
            </h2>
            <p
              style={{
                fontSize: "1.15rem",
                color: "#fff",
                margin: "1.5rem 0 0.5rem 0",
                fontWeight: 400,
                textShadow: "0 2px 8px rgba(103,114,138,0.18)",
              }}
            >
              Apply now to join an organization and start building<br />meaningful connections.
            </p>
            {/* Search bar (same style as UserTable/OrganizationTable) */}
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
                mt: 2,
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
            {/* Scroll to see all organizations + double chevron */}
            <div
              style={{
                marginTop: "3.2rem",
                textAlign: "center",
                color: "#fff",
                fontSize: "1rem",
                fontWeight: 400,
                letterSpacing: "0.5px",
                fontFamily: "inherit",
              }}
            >
              Scroll to see all organizations
              <div style={{ marginTop: 1 }}>
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
              </div>
            </div>
          </div>
          {/* Right column: Agreement image */}
          <div
            style={{
              position: "relative",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "100%",
              height: "100%",
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
                marginRight: "10vw",
                marginTop: "85px",      // move image down (increase value for lower)
              }}
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default Market;
