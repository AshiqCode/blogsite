import React, { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { getPosts } from "../../api/api";
import PostCard from "../../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canonical = useMemo(() => `${window.location.origin}/`, []);
  const title = "TrendScope – Latest Blogs, Trends & Expert Insights";
  const description =
    "Read insights, stories, and expert ideas from the TrendScope team. Explore our latest blogs, in-depth articles, and trending topics shaping today.";

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getPosts();
        if (mounted) setPosts(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setError(e?.message || "Failed to load posts.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // SEO tags render even during loading/error
  const Seo = () => (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
    </Helmet>
  );

  // Better “loading” HTML (less empty for crawlers)
  if (loading) {
    return (
      <main style={{ width: "100%", overflowX: "hidden" }}>
        <Seo />

        <section
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "60px 20px",
          }}
        >
          <div style={{ maxWidth: 720 }}>
            <h1
              style={{ fontSize: "clamp(28px, 5vw, 42px)", marginBottom: 10 }}
            >
              Discover Thoughtful Blogs
            </h1>
            <p className="muted" style={{ lineHeight: 1.6 }}>
              Loading latest posts…
            </p>

            {/* Keep your spinner if you want */}
            <div style={{ marginTop: 16 }}>
              <div className="spinner" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={{ width: "100%", overflowX: "hidden" }}>
      <Seo />

      {/* HERO */}
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

      {/* BLOG LIST */}
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
          <h3 style={{ color: "#6b7280" }}>Fresh articles curated for you.</h3>
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
