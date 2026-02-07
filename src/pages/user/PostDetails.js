import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPostBySlug, getPosts } from "../../api/api";
import SuggestedPosts from "../../components/SuggestedPosts";

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
        if (mounted) setError(e.message || "Failed to load post.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="container page">
        <div className="loader">Loading post…</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container page">
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
        <div className="empty">
          <h2>Post not found</h2>
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
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h1 className="post-title">{post.title}</h1>

        {post.coverImage ? (
          <div className="post-cover">
            <img src={post.coverImage} alt={post.title} />
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
