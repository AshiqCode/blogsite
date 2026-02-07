import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostForm from "./PostForm";
import { getPostById, updatePost, getPosts } from "../../api/api";
import slugify from "../../utils/slugify";

export default function AdminEditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");

        const [p, list] = await Promise.all([getPostById(id), getPosts()]);
        if (!mounted) return;

        setInitialValues(p);
        setPosts(Array.isArray(list) ? list : []);
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load post.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [id]);

  async function handleUpdate(payload) {
    try {
      setSubmitting(true);
      setError("");

      const slug = slugify(payload.slug || payload.title);
      const isDup = posts.some(
        (p) =>
          p.id !== Number(id) &&
          String(p.slug).toLowerCase() === slug.toLowerCase()
      );
      if (isDup) {
        setError("Slug already exists. Please use a different slug.");
        return;
      }

      const now = new Date().toISOString();

      const updated = {
        ...initialValues,
        ...payload,
        slug,
        updatedAt: now,
      };

      await updatePost(id, updated);
      navigate("/admin");
    } catch (e) {
      setError(e.message || "Failed to update post.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loader">Loading…</div>
      </div>
    );
  }

  if (error && !initialValues) {
    return (
      <div className="admin-page">
        <div className="error-box">
          <strong>Oops:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1>Edit Post</h1>
      <p className="muted">Update the fields and save.</p>

      {error ? (
        <div className="error-box">
          <strong>Oops:</strong> {error}
        </div>
      ) : null}

      <PostForm
        mode="edit"
        initialValues={initialValues}
        onSubmit={handleUpdate}
        submitting={submitting}
        submitLabel="Save Changes"
      />
    </div>
  );
}
