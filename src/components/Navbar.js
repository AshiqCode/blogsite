import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { getPosts } from "../api/api";

export default function Navbar() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

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
    setOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  useEffect(() => {
    const query = q.trim();
    if (!query) {
      setResults([]);
      setOpen(false);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await getPosts();
        const list = Array.isArray(data) ? data : [];

        const needle = query.toLowerCase();
        const filtered = list
          .filter((p) => {
            const title = String(p.title || "").toLowerCase();
            const excerpt = String(p.excerpt || "").toLowerCase();
            const author = String(p.author || "").toLowerCase();
            const category = String(p.category || "").toLowerCase();
            return (
              title.includes(needle) ||
              excerpt.includes(needle) ||
              author.includes(needle) ||
              category.includes(needle)
            );
          })
          .slice(0, 6);

        setResults(filtered);
        setOpen(true);
      } catch (e) {
        setResults([]);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(t);
  }, [q]);

  const showDropdown = useMemo(() => open && q.trim().length > 0, [open, q]);

  const SearchDropdown = ({ fullWidth }) => {
    const widthStyle = fullWidth
      ? { width: "100%" }
      : { width: 380, maxWidth: "90vw" };

    return (
      <div
        style={{
          marginTop: fullWidth ? 10 : 0,
          position: fullWidth ? "static" : "absolute",
          top: fullWidth ? undefined : "calc(100% + 8px)",
          right: fullWidth ? undefined : 0,
          background: "rgba(0,0,0,0.92)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 12,
          overflow: "hidden",
          zIndex: 9999,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          ...widthStyle,
        }}
      >
        {!fullWidth ? (
          <div
            style={{
              padding: "10px 12px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
              {loading ? "Searching…" : "Search results"}
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent",
                border: 0,
                color: "rgba(255,255,255,0.7)",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Close
            </button>
          </div>
        ) : null}

        {loading ? (
          <div
            style={{
              padding: 12,
              color: "rgba(255,255,255,0.7)",
              fontSize: 13,
            }}
          >
            Loading…
          </div>
        ) : results.length ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {results.map((p) => (
              <Link
                key={p.id}
                to={`/post/${p.slug}`}
                onClick={() => {
                  setOpen(false);
                  setQ("");
                  setMenuOpen(false);
                }}
                style={{
                  padding: "12px 12px",
                  textDecoration: "none",
                  color: "#fff",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
                  {p.category ? p.category : "Blog"} •{" "}
                  {p.author ? p.author : "Unknown"}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: 12,
              color: "rgba(255,255,255,0.7)",
              fontSize: 13,
            }}
          >
            No results found.
          </div>
        )}
      </div>
    );
  };

  return (
    <header
      className="navbar"
      style={{ position: "sticky", top: 0, zIndex: 1000 }}
    >
      <div
        className="container navbar-inner"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div
          className="brand"
          style={{
            fontWeight: 800,
            letterSpacing: 0.2,
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          TrendScope
        </div>

        {/* Desktop nav */}
        {!isMobile ? (
          <nav
            className="nav-links"
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Home
            </NavLink>

            <div style={{ position: "relative" }}>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => q.trim() && setOpen(true)}
                placeholder="Search blogs…"
                style={{
                  width: 260,
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#fff",
                  outline: "none",
                }}
              />

              {showDropdown ? <SearchDropdown fullWidth={false} /> : null}
            </div>
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
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                color: "#fff",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
              }}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        )}
      </div>

      {/* Mobile panel */}
      {isMobile && menuOpen ? (
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(0,0,0,0.92)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <div className="container" style={{ padding: "14px 0" }}>
            <div style={{ position: "relative" }}>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => q.trim() && setOpen(true)}
                placeholder="Search blogs…"
                style={{
                  width: "100%",
                  padding: "12px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#fff",
                  outline: "none",
                }}
              />

              {showDropdown ? <SearchDropdown fullWidth /> : null}
            </div>

            <div
              style={{
                marginTop: 14,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{
                  textDecoration: "none",
                  color: "#fff",
                  padding: "10px 10px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                Home
              </NavLink>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
