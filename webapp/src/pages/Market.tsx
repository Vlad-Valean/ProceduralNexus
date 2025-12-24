import React from "react";
import Navbar from "../components/Navbar";
import organizationsMarket from "../assets/organization_marketplace.png";
import clouds from "../assets/clouds.svg";
import agreement from "../assets/agreement.svg";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";

const Market: React.FC = () => {
  // Scrolls to the next viewport height
  const handleScrollToNextPage = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

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
        {/* Flex container for left and right columns */}
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Left column (text and clouds) */}
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
                right: -850, // ensure this is 0
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
              {/* Container for search bar and scroll text/arrows */}
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
                    cursor: "pointer", // pointer feedback
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
          {/* Right column (agreement image) */}
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
      {/* Blank space after scrolling */}
      <div
        style={{
          position: "absolute",
          top: "calc(100vh)",
          left: 0,
          right: 0,
          width: "100vw",
          height: "100vh",
          background: "#fff",
          boxSizing: "border-box",
        }}
      />
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
