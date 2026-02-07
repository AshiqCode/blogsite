import React, { useMemo } from "react";
import { Link } from "react-router-dom";

export default function SuggestedPosts({
  currentPost,
  allPosts,
  min = 3,
  max = 5,
}) {
  const suggested = useMemo(() => {
    if (!currentPost || !Array.isArray(allPosts)) return [];

    const currentTags = Array.isArray(currentPost.tags) ? currentPost.tags : [];
    const currentTagSet = new Set(
      currentTags.map((t) => String(t).toLowerCase())
    );

    const candidates = allPosts
      .filter((p) => p.id !== currentPost.id)
      .map((p) => {
        const sameCategory =
          String(p.category || "").toLowerCase() ===
          String(currentPost.category || "").toLowerCase();

        const tags = Array.isArray(p.tags) ? p.tags : [];
        let overlap = 0;
        for (const t of tags) {
          if (currentTagSet.has(String(t).toLowerCase())) overlap += 1;
        }

        const score = (sameCategory ? 2 : 0) + (overlap > 0 ? overlap : 0);
        return { post: p, score };
      });

    const matches = candidates
      .filter((c) => c.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (
          new Date(b.post.createdAt).getTime() -
          new Date(a.post.createdAt).getTime()
        );
      })
      .map((c) => c.post);

    const latestFallback = allPosts
      .filter((p) => p.id !== currentPost.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    const unique = [];
    const seen = new Set();

    for (const p of matches) {
      if (!seen.has(p.id)) {
        unique.push(p);
        seen.add(p.id);
      }
      if (unique.length >= max) break;
    }

    if (unique.length < min) {
      for (const p of latestFallback) {
        if (!seen.has(p.id)) {
          unique.push(p);
          seen.add(p.id);
        }
        if (unique.length >= max) break;
      }
    }

    return unique;
  }, [currentPost, allPosts, min, max]);

  if (!suggested.length) return null;

  return (
    <section className="suggested">
      <h3 className="section-title">Suggested Blogs</h3>

      <div className="suggested-grid">
        {suggested.map((p) => (
          <Link
            key={p.id}
            to={`/post/${p.slug}`}
            className="suggested-card-link"
          >
            <article className="suggested-card clickable">
              {p.coverImage ? (
                <div className="suggested-image">
                  <img src={p.coverImage} alt={p.title} />
                </div>
              ) : null}

              <div className="suggested-body">
                <div className="suggested-meta">
                  {/* <span className="badge small">{p.category}</span>
                  <span className="muted small">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span> */}
                </div>

                <h4 className="suggested-title">{p.title}</h4>

                <p className="suggested-excerpt">{p.excerpt}</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
