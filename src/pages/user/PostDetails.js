import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { getPostBySlug, getPosts } from "../../api/api";
import SuggestedPosts from "../../components/SuggestedPosts";

import firebase from "firebase/compat/app";
import "firebase/compat/database";

function safeText(v) {
  return String(v || "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildDescription(post) {
  if (!post) return "Read this blog post on TrendScope.";
  const excerpt = safeText(post.excerpt);
  if (excerpt) return excerpt.slice(0, 160);

  const content = safeText(post.content);
  if (content) return content.slice(0, 160);

  return "Read this blog post on TrendScope.";
}

const firebaseConfig = {
  databaseURL: "https://network-cecda-default-rtdb.firebaseio.com/",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

export default function PostDetails() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // feedback
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const [p, list] = await Promise.all([getPostBySlug(slug), getPosts()]);
        if (!mounted) return;

        setPost(p);
        setAllPosts(Array.isArray(list) ? list : []);
      } catch (e) {
        if (mounted) setError(e?.message || "Failed to load post.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [slug]);

  // realtime feedback listener
  useEffect(() => {
    if (!post?.id) return;

    const ref = db.ref(`feedback/${post.id}`).limitToLast(15);

    const onValue = (snap) => {
      const val = snap.val() || {};
      const list = Object.values(val).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setFeedbackList(list);
    };

    ref.on("value", onValue);
    return () => ref.off("value", onValue);
  }, [post?.id]);

  const canonical = useMemo(
    () => `${window.location.origin}/post/${slug}`,
    [slug]
  );

  const defaultTitle = "TrendScope - Blog Post";
  const defaultDescription = "Read blog posts on TrendScope.";

  const pageTitle = post?.title ? `${post.title} | TrendScope` : defaultTitle;
  const description = post ? buildDescription(post) : defaultDescription;

  const Seo = () => (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={post?.title || defaultTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="article" />
      {post?.coverImage ? (
        <meta property="og:image" content={post.coverImage} />
      ) : null}

      <meta
        name="twitter:card"
        content={post?.coverImage ? "summary_large_image" : "summary"}
      />
    </Helmet>
  );

  async function submitFeedback(e) {
    e.preventDefault();
    if (!post?.id) return;

    const cleanMessage = String(message || "").trim();
    if (!cleanMessage) {
      alert("Please write your feedback.");
      return;
    }

    try {
      setSending(true);
      setSent(false);

      const ref = db.ref(`feedback/${post.id}`).push();

      await ref.set({
        id: ref.key,
        postId: post.id,
        postSlug: slug,
        name: String(name || "").trim() || "Anonymous",
        message: cleanMessage,
        createdAt: new Date().toISOString(),
      });

      setSent(true);
      setMessage("");
      setName("");
    } catch (err) {
      alert(err?.message || "Failed to submit feedback.");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <main className="container page">
        <Seo />
        <article className="post">
          <h1>Loading…</h1>
          <p className="muted">Fetching the blog post.</p>
        </article>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container page">
        <Seo />
        <div className="error-box">
          <strong>Oops:</strong> {error}
        </div>
        <div style={{ marginTop: 12 }}>
          <Link className="link" to="/">
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="container page">
        <Seo />
        <div className="empty">
          <h1>Post not found</h1>
          <p className="muted">
            The slug <code>{slug}</code> doesn’t exist.
          </p>
          <Link className="link" to="/">
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container page">
      <Seo />

      <div style={{ marginBottom: 14 }}>
        <Link className="link" to="/">
          ← Back
        </Link>
      </div>

      <article className="post">
        <div className="post-meta">
          <span className="badge">{post.category}</span>
          <span className="muted">By {post.author}</span>
          <span className="muted">
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : ""}
          </span>
        </div>

        <h1 className="post-title">{post.title}</h1>

        {post.coverImage ? (
          <div className="post-cover">
            <img src={post.coverImage} alt={post.title} loading="lazy" />
          </div>
        ) : null}

        <div className="post-content">
          {String(post.content || "")
            .split("\n")
            .filter(Boolean)
            .map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
        </div>

        {Array.isArray(post.tags) && post.tags.length ? (
          <div className="post-tags">
            {post.tags.map((t, i) => (
              <span key={`${t}-${i}`} className="tag">
                #{t}
              </span>
            ))}
          </div>
        ) : null}

        {/* =========================
            FEEDBACK SECTION
           ========================= */}
        <section
          style={{
            marginTop: 32,
            paddingTop: 24,
            borderTop: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ marginBottom: 6 }}>Reader Feedback</h3>
          <p className="muted" style={{ marginBottom: 16 }}>
            Share your thoughts about this blog.
          </p>

          <form onSubmit={submitFeedback} style={{ display: "grid", gap: 12 }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: "rgba(0, 0, 0,0.3)",
                border: "1px solid rgba(0,0,0,0.12)",
                outline: "none",
              }}
            />

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your feedback…"
              rows={4}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: "rgba(0, 0, 0,0.3)",
                border: "1px solid rgba(0,0,0,0.12)",
                outline: "none",
                resize: "vertical",
              }}
            />

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button className="btn" type="submit" disabled={sending}>
                {sending ? "Submitting…" : "Submit"}
              </button>

              {sent ? (
                <span style={{ color: "green", fontSize: 13 }}>
                  Thanks for your feedback!
                </span>
              ) : null}
            </div>
          </form>

          {feedbackList.length ? (
            <div style={{ marginTop: 28, display: "grid", gap: 14 }}>
              {feedbackList.map((f) => (
                <div
                  key={f.id}
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    background: "rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ fontSize: 13, marginBottom: 4 }}>
                    <strong>{f.name || "Anonymous"}</strong>{" "}
                    <span className="muted">
                      ·{" "}
                      {f.createdAt
                        ? new Date(f.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                  <p style={{ margin: 0 }}>{f.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted" style={{ marginTop: 20 }}>
              No feedback yet. Be the first to share your thoughts.
            </p>
          )}
        </section>

        <SuggestedPosts currentPost={post} allPosts={allPosts} />
      </article>
    </main>
  );
}
