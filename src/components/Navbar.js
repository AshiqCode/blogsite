import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  const location = useLocation();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  const linkBase = {
    textDecoration: "none",
    color: "#374151",
    padding: "8px 10px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
  };

  const linkActive = {
    background: "#f3f4f6",
    color: "#111827",
  };

  return (
    <header
      className="navbar"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "rgba(255,255,255,0.92)",
        borderBottom: "1px solid #e5e7eb",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div
        className="container navbar-inner"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "12px 0",
        }}
      >
        <div
          className="brand"
          style={{
            fontWeight: 900,
            letterSpacing: 0.2,
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#111827",
          }}
        >
          TrendScope
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#6b7280",
              border: "1px solid #e5e7eb",
              padding: "2px 8px",
              borderRadius: 999,
              background: "#fff",
            }}
          >
            AI Tools
          </span>
        </div>

        {/* Desktop nav */}
        {!isMobile ? (
          <nav
            className="nav-links"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <NavLink
              to="/"
              style={({ isActive }) =>
                isActive ? { ...linkBase, ...linkActive } : linkBase
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/tools"
              style={({ isActive }) =>
                isActive ? { ...linkBase, ...linkActive } : linkBase
              }
            >
              Directory
            </NavLink>

            <NavLink
              to="/about"
              style={({ isActive }) =>
                isActive ? { ...linkBase, ...linkActive } : linkBase
              }
            >
              About
            </NavLink>
          </nav>
        ) : (
          /* Mobile hamburger */
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                background: "#fff",
                color: "#111827",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                fontWeight: 900,
              }}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        )}
      </div>

      {/* Mobile panel */}
      {isMobile && menuOpen ? (
        <div style={{ borderTop: "1px solid #e5e7eb", background: "#fff" }}>
          <div className="container" style={{ padding: "14px 0" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <NavLink
                to="/"
                style={({ isActive }) =>
                  isActive
                    ? {
                        ...linkBase,
                        ...linkActive,
                        border: "1px solid #e5e7eb",
                      }
                    : { ...linkBase, border: "1px solid #e5e7eb" }
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/tools"
                style={({ isActive }) =>
                  isActive
                    ? {
                        ...linkBase,
                        ...linkActive,
                        border: "1px solid #e5e7eb",
                      }
                    : { ...linkBase, border: "1px solid #e5e7eb" }
                }
              >
                Directory
              </NavLink>

              <NavLink
                to="/about"
                style={({ isActive }) =>
                  isActive
                    ? {
                        ...linkBase,
                        ...linkActive,
                        border: "1px solid #e5e7eb",
                      }
                    : { ...linkBase, border: "1px solid #e5e7eb" }
                }
              >
                About
              </NavLink>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
