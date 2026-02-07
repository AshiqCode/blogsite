import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "./PostForm";
import { createPost, getPosts } from "../../api/api";
import slugify from "../../utils/slugify";

export default function AdminNewPost() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getPosts();
        if (mounted) setPosts(Array.isArray(list) ? list : []);
      } catch {}
    })();
    return () => (mounted = false);
  }, []);

  async function handleCreate(payload) {
    try {
      setSubmitting(true);
      setError("");

      const slug = slugify(payload.slug || payload.title);
      const isDup = posts.some((p) => String(p.slug).toLowerCase() === slug.toLowerCase());
      if (isDup) {
        setError("Slug already exists. Please use a different title/slug.");
        return;
      }

      const now = new Date().toISOString();
      const post = {
        ...payload,
        slug,
        createdAt: now,
        updatedAt: now,
      };

      await createPost(post);
      navigate("/admin");
    } catch (e) {
      setError(e.message || "Failed to create post.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-page">
      <h1>Create New Post</h1>
      <p className="muted">Add a new blog post.</p>

      {error ? (
        <div className="error-box">
          <strong>Oops:</strong> {error}
        </div>
      ) : null}

      <PostForm
        mode="create"
        initialValues={{}}
        onSubmit={handleCreate}
        submitting={submitting}
        submitLabel="Create Post"
      />
    </div>
  );
}
