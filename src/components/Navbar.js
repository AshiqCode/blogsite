import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { getPosts } from "../api/api";

export default function Navbar() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  const location = useLocation();

  // close dropdown when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

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
    }, 250); // debounce

    return () => clearTimeout(t);
  }, [q]);

  const showDropdown = useMemo(() => open && q.trim().length > 0, [open, q]);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div className="brand">TrendScope</div>

        <nav
          className="nav-links"
          style={{ display: "flex", gap: 12, alignItems: "center" }}
        >
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => q.trim() && setOpen(true)}
              placeholder="Search blogs…"
              style={{
                width: 260,
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                color: "#fff",
                outline: "none",
              }}
            />

            {showDropdown ? (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: 360,
                  background: "rgba(0,0,0,0.92)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10,
                  overflow: "hidden",
                  zIndex: 9999,
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
              >
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
                  <span
                    style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}
                  >
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
                    Esc
                  </button>
                </div>

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
                        }}
                        style={{
                          padding: "12px 12px",
                          textDecoration: "none",
                          color: "#fff",
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            marginBottom: 2,
                          }}
                        >
                          {p.title}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.65)",
                          }}
                        >
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
            ) : null}
          </div>
        </nav>
      </div>
    </header>
  );
}
