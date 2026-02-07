import React, { useEffect, useMemo, useState } from "react";
import slugify from "../../utils/slugify";
import { getPosts } from "../../api/api";

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  author: "",
  category: "",
  tags: "",
};

export default function PostForm({
  mode,
  initialValues,
  onSubmit,
  submitting,
  submitLabel,
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [slugWarning, setSlugWarning] = useState("");
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    setForm({
      ...emptyForm,
      ...(initialValues || {}),
      tags: Array.isArray(initialValues?.tags)
        ? initialValues.tags.join(", ")
        : initialValues?.tags || "",
    });
  }, [initialValues]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getPosts();
        if (mounted) setAllPosts(Array.isArray(list) ? list : []);
      } catch {}
    })();
    return () => (mounted = false);
  }, []);

  const existingSlugs = useMemo(() => {
    const map = new Map();
    for (const p of allPosts) map.set(p.id, p.slug);
    return map;
  }, [allPosts]);

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate(nextForm) {
    const e = {};
    if (!nextForm.title.trim()) e.title = "Title is required.";
    if (!nextForm.content.trim()) e.content = "Content is required.";
    if (!nextForm.author.trim()) e.author = "Author is required.";
    if (!nextForm.category.trim()) e.category = "Category is required.";
    return e;
  }

  function checkSlugUniqueness(slugValue) {
    const candidate = String(slugValue || "").trim();
    if (!candidate) return "";

    for (const [id, s] of existingSlugs.entries()) {
      const editingId = initialValues?.id;
      if (mode === "edit" && editingId === id) continue;
      if (String(s).toLowerCase() === candidate.toLowerCase()) {
        return "Slug already exists. Please change title or edit the slug.";
      }
    }
    return "";
  }

  function onTitleChange(v) {
    setField("title", v);
    const generated = slugify(v);
    if (mode === "create") {
      setField("slug", generated);
      setSlugWarning(checkSlugUniqueness(generated));
    }
  }

  function onSlugChange(v) {
    const cleaned = slugify(v);
    setField("slug", cleaned);
    setSlugWarning(checkSlugUniqueness(cleaned));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const next = {
      ...form,
      slug: slugify(form.slug || form.title),
    };

    const eMap = validate(next);
    setErrors(eMap);

    const warn = checkSlugUniqueness(next.slug);
    setSlugWarning(warn);

    if (Object.keys(eMap).length) return;
    if (warn) return;

    const tagsArray = String(next.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: next.title.trim(),
      slug: next.slug.trim(),
      excerpt: next.excerpt.trim(),
      content: next.content.trim(),
      coverImage: next.coverImage.trim(),
      author: next.author.trim(),
      category: next.category.trim(),
      tags: tagsArray,
    };

    onSubmit(payload);
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>Title *</label>
        <input
          value={form.title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Post title"
        />
        {errors.title ? <div className="field-error">{errors.title}</div> : null}
      </div>

      <div className="form-row">
        <label>Slug *</label>
        <input
          value={form.slug}
          onChange={(e) => onSlugChange(e.target.value)}
          placeholder="auto-generated-from-title"
        />
        {slugWarning ? <div className="field-warn">{slugWarning}</div> : null}
      </div>

      <div className="form-row">
        <label>Excerpt</label>
        <textarea
          rows={2}
          value={form.excerpt}
          onChange={(e) => setField("excerpt", e.target.value)}
          placeholder="Short summary"
        />
      </div>

      <div className="form-row">
        <label>Cover Image URL (optional)</label>
        <input
          value={form.coverImage}
          onChange={(e) => setField("coverImage", e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="form-grid">
        <div className="form-row">
          <label>Author *</label>
          <input
            value={form.author}
            onChange={(e) => setField("author", e.target.value)}
            placeholder="Author name"
          />
          {errors.author ? <div className="field-error">{errors.author}</div> : null}
        </div>

        <div className="form-row">
          <label>Category *</label>
          <input
            value={form.category}
            onChange={(e) => setField("category", e.target.value)}
            placeholder="e.g. React"
          />
          {errors.category ? (
            <div className="field-error">{errors.category}</div>
          ) : null}
        </div>
      </div>

      <div className="form-row">
        <label>Tags (comma separated)</label>
        <input
          value={form.tags}
          onChange={(e) => setField("tags", e.target.value)}
          placeholder="react, router, css"
        />
      </div>

      <div className="form-row">
        <label>Content *</label>
        <textarea
          rows={10}
          value={form.content}
          onChange={(e) => setField("content", e.target.value)}
          placeholder="Write the full post content..."
        />
        {errors.content ? (
          <div className="field-error">{errors.content}</div>
        ) : null}
      </div>

      <div className="form-actions">
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
