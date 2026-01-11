import React from "react";
import { useNavigate } from "react-router-dom";
import navbarLogo from "../assets/navbar_logo.png";
import profileIcon from "../assets/profile_icon.png";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const [hasOrg, setHasOrg] = React.useState(false);

  let role = "guest";
  let roles: string[] = [];
  let userEmail: string | null = null;
  let token: string = "";

  try {
    const storedRoles = localStorage.getItem("userRoles");
    if (storedRoles) {
      roles = JSON.parse(storedRoles);
    }
  } catch {
    roles = [];
  }

  if (roles.includes("ADMIN")) role = "admin";
  else if (roles.includes("HR")) role = "hr";
  else if (roles.includes("USER")) {
    role = "user";
    userEmail = localStorage.getItem("userEmail");
    token = localStorage.getItem("token") || "";
  }

  interface Profile {
    email: string;
    organizationId: string | null;
  }

  React.useEffect(() => {
    if (role === "user" && userEmail) {
      const fetchProfiles = async () => {
        try {
          const res = await fetch("http://localhost:8080/profiles", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const profiles: Profile[] = await res.json();
            const profile = profiles.find((p) => p.email === userEmail);
            setHasOrg(profile !== undefined && profile.organizationId !== null);
          } else {
            setHasOrg(false);
          }
        } catch {
          setHasOrg(false);
        }
      };
      fetchProfiles();
    } else {
      setHasOrg(false);
    }
  }, [role, userEmail, token]);

  let links: { label: string; path: string }[] = [];
  if (role === "guest") {
    links = [
      { label: "Home", path: "/" },
      { label: "About", path: "/about" },
    ];
  } else if (role === "user") {
    links = [
      { label: "Home", path: "/" },
      { label: "About", path: "/about" },
      { label: "Dashboard", path: "/dashboard" },
    ];
    if (!hasOrg) {
      links.push({ label: "Market", path: "/market" });
    }
  } else if (role === "hr") {
    links = [
      { label: "Home", path: "/" },
      { label: "About", path: "/about" },
      { label: "Dashboard", path: "/hr/dashboard" },
    ];
  } else if (role === "admin") {
    links = [
      { label: "Home", path: "/" },
      { label: "About", path: "/about" },
      { label: "Dashboard", path: "/admin/dashboard" },
    ];
  }

  const isGuest = role === "guest";

  const baseNavStyle: React.CSSProperties = {
    height: "60px",
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    padding: "0 32px",
    boxSizing: "border-box",
    color: "white",
    boxShadow:
      "0 6px 14px rgba(0,0,0,0.25), 0 1px 0 rgba(255, 255, 255, 0.05)",
    fontSize: "1rem",
    fontWeight: 400,
  };

  const background = isGuest
    ? "linear-gradient(120deg, #67728A 72%, #d3dbe6 72%)"
    : "#67728A";

  return (
    <>
      <nav
        style={{
          ...baseNavStyle,
          background,
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <img
            src={navbarLogo}
            alt="Logo"
            style={{ height: "38px", marginRight: "16px" }}
          />
          {links.map((link) => (
            <a
              key={link.path}
              href={link.path}
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "1rem",
                fontWeight: 400,
                opacity: 1,
                transition: "opacity 0.15s ease",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.opacity = "0.8";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {isGuest ? (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              style={{
                background: "white",
                color: "#67728A",
                border: "none",
                borderRadius: "8px",
                padding: "6px 18px",
                fontWeight: 500,
                cursor: "pointer",
                outline: "none",
                boxShadow: "none",
                transition: "box-shadow 0.1s ease, background 0.1s ease",
              }}
              onClick={() => navigate("/login")}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.boxShadow =
                  "0 2px 6px rgba(0,0,0,0.15)";
                e.currentTarget.style.background = "#f5f5f5";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.background = "white";
              }}
            >
              Sign in →
            </button>

            <button
              style={{
                background: "#67728A",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "6px 18px",
                fontWeight: 500,
                cursor: "pointer",
                outline: "none",
                boxShadow: "none",
                transition: "box-shadow 0.1s ease, background 0.1s ease",
              }}
              onClick={() => navigate("/register")}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.boxShadow =
                  "0 2px 6px rgba(0,0,0,0.15)";
                e.currentTarget.style.background = "#5c6880";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.background = "#67728A";
              }}
            >
              Get Started
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
            }}
          >
            {(role === "user" ||
              role === "hr") && (
              <img
                src={profileIcon}
                alt="Profile"
                style={{
                  height: "32px",
                  width: "32px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  boxShadow: "none",
                  transition: "box-shadow 0.1s ease",
                }}
                onClick={() => navigate("/profile")}
                onMouseEnter={(e: React.MouseEvent<HTMLImageElement>) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 0 2px rgba(255,255,255,0.4)";
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLImageElement>) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate("/profile");
                }}
              />
            )}

            <button
              style={{
                background: "white",
                color: "#67728A",
                border: "none",
                borderRadius: "8px",
                padding: "6px 18px",
                fontWeight: 500,
                cursor: "pointer",
                outline: "none",
                boxShadow: "none",
                transition: "box-shadow 0.1s ease, background 0.1s ease",
              }}
              onClick={() => {
                localStorage.removeItem("userRole");
                navigate("/login");
              }}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.boxShadow =
                  "0 2px 6px rgba(0,0,0,0.15)";
                e.currentTarget.style.background = "#f5f5f5";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.background = "white";
              }}
            >
              Log out →
            </button>
          </div>
        )}
      </nav>

      <div style={{ height: "60px" }} />
    </>
  );
};

export default Navbar;
