import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { getPostBySlug, getPosts } from "../../api/api";
import SuggestedPosts from "../../components/SuggestedPosts";

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

  return "Read this blog post on .";
}

export default function PostDetails() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const canonical = useMemo(
    () => `${window.location.origin}/post/${slug}`,
    [slug]
  );

  // Default SEO (even during loading/error)
  const defaultTitle = "TrendScope - Blog Post";
  const defaultDescription = "Read blog posts on TrendScope.";

  const pageTitle = post?.title ? `${post.title} | TrendScope` : defaultTitle;
  const description = post ? buildDescription(post) : defaultDescription;

  const Seo = () => (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={post?.title || defaultTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="article" />
      {post?.coverImage ? (
        <meta property="og:image" content={post.coverImage} />
      ) : null}

      {/* Twitter */}
      <meta
        name="twitter:card"
        content={post?.coverImage ? "summary_large_image" : "summary"}
      />
    </Helmet>
  );

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

        <SuggestedPosts currentPost={post} allPosts={allPosts} />
      </article>
    </main>
  );
}
