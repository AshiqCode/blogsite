import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getPosts, deletePost, createPost } from "../../api/api";

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const fileInputRef = useRef(null);

  async function load() {
    try {
      setLoading(true);
      setError("");
      const data = await getPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id) {
    const ok = window.confirm("Delete this post? This cannot be undone.");
    if (!ok) return;

    try {
      setBusyId(id);
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert(e.message || "Failed to delete.");
    } finally {
      setBusyId(null);
    }
  }

  /* =========================
     BACKUP: DOWNLOAD JSON
     ========================= */
  function downloadBackup() {
    const data = JSON.stringify(posts, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `blog-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  /* =========================
     BACKUP: RESTORE JSON
     ========================= */
  async function onBackupUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (!Array.isArray(json)) {
        alert("Invalid backup file.");
        return;
      }

      const ok = window.confirm(
        `Restore ${json.length} posts?\nThis will ADD posts (no overwrite).`
      );
      if (!ok) return;

      for (const post of json) {
        const { id, ...rest } = post;
        await createPost(rest);
      }

      alert("Backup restored successfully.");
      load();
    } catch {
      alert("Failed to restore backup.");
    } finally {
      e.target.value = "";
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h1>Posts</h1>
          <p className="muted">Manage your blog posts (full CRUD).</p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn secondary" onClick={downloadBackup}>
            ⬇ Backup
          </button>

          <button
            className="btn secondary"
            onClick={() => fileInputRef.current.click()}
          >
            ⬆ Restore
          </button>

          <Link className="btn" to="/blogadmincode4/new">
            + Create New Post
          </Link>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={onBackupUpload}
          />
        </div>
      </div>

      {loading && <div className="loader">Loading…</div>}

      {error && (
        <div className="error-box">
          <strong>Oops:</strong> {error}
          <div style={{ marginTop: 8 }}>
            <button className="btn secondary" onClick={load}>
              Retry
            </button>
          </div>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="empty">No posts found.</div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Created</th>
                <th style={{ width: 200 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="table-title">{p.title}</div>
                    <div className="muted small">/{p.slug}</div>
                  </td>
                  <td>{p.category}</td>
                  <td>{p.author}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="row-actions">
                      {/* ✅ FIXED EDIT LINK */}
                      <Link
                        className="btn secondary small"
                        to={`/blogadmincode4/edit/${p.id}`}
                      >
                        Edit
                      </Link>

                      <button
                        className="btn danger small"
                        onClick={() => onDelete(p.id)}
                        disabled={busyId === p.id}
                      >
                        {busyId === p.id ? "Deleting…" : "Delete"}
                      </button>

                      <Link className="btn ghost small" to={`/post/${p.slug}`}>
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
