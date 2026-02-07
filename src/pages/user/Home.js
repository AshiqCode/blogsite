import React, { useEffect, useState } from "react";
import { getPosts } from "../../api/api";
import PostCard from "../../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getPosts();
        if (mounted) setPosts(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load posts.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================
     FULL SCREEN LOADER
     ========================= */
  if (loading) {
    return (
      <div className="fullscreen-loader">
        <div className="spinner" />
        <div className="muted" style={{ marginTop: 12 }}>
          Loading posts…
        </div>
      </div>
    );
  }

  return (
    <main style={{ width: "100%", overflowX: "hidden" }}>
      {/* =========================
          LANDING / HERO SECTION
         ========================= */}
      <section
        style={{
          minHeight: "75vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "60px 20px",
          color: "#fff",
          borderBottom: "1px solid transparent",
          background:
            "linear-gradient(transparent, #000) padding-box, linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent) border-box",
        }}
      >
        <div style={{ maxWidth: 720 }}>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Discover Thoughtful Blogs
          </h1>

          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.6,
              marginBottom: 32,
            }}
          >
            Read insights, stories, and ideas written by our Team. Explore our
            latest content and trending articles.
          </p>

          <a
            href="#blogs"
            style={{
              display: "inline-block",
              padding: "12px 26px",
              background: "#fff",
              color: "#000",
              borderRadius: 6,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Explore Blogs ↓
          </a>
        </div>
      </section>

      {/* =========================
          BLOG LIST SECTION
         ========================= */}
      <section
        id="blogs"
        style={{
          padding: "60px 20px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 28, marginBottom: 6 }}>Latest Blogs</h2>
          <p style={{ color: "#6b7280" }}>Fresh articles curated for you.</p>
        </div>

        {error ? (
          <div className="error-box">
            <strong>Oops:</strong> {error}
          </div>
        ) : null}

        {!error && posts.length === 0 ? (
          <div className="empty">No posts yet.</div>
        ) : null}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
