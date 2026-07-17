import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/queries";
import {
  analyzePost,
  analyzeSite,
  scoreColor,
  type Check,
  type PostAnalysis,
} from "@/lib/seo-health";

export const metadata: Metadata = { title: "SEO Health" };

const badge: Record<string, string> = {
  green: "bg-green-100 text-green-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
};
const dot: Record<Check["status"], string> = {
  good: "text-green-600",
  warn: "text-amber-600",
  error: "text-red-600",
};
const icon: Record<Check["status"], string> = { good: "✓", warn: "!", error: "✕" };

export default async function HealthPage() {
  const supabase = await createClient();
  const settings = await getSettings();

  const [{ data: posts }, published, drafts, cats, authors] = await Promise.all([
    supabase
      .from("posts")
      .select(
        "id, title, slug, status, content, excerpt, meta_title, meta_description, featured_image, category_id, author_id, tags:tags(id)",
      )
      .eq("status", "published")
      .order("created_at", { ascending: false }),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("authors").select("id", { count: "exact", head: true }),
  ]);

  const analyses: PostAnalysis[] = (posts ?? [])
    .map((p) =>
      analyzePost({
        id: p.id,
        title: p.title,
        slug: p.slug,
        status: p.status,
        content: p.content ?? "",
        excerpt: p.excerpt,
        meta_title: p.meta_title,
        meta_description: p.meta_description,
        featured_image: p.featured_image,
        category_id: p.category_id,
        author_id: p.author_id,
        tags_count: Array.isArray(p.tags) ? p.tags.length : 0,
      }),
    )
    .sort((a, b) => a.score - b.score); // worst first

  const site = analyzeSite(settings, {
    publishedCount: published.count ?? 0,
    draftCount: drafts.count ?? 0,
    categoryCount: cats.count ?? 0,
    authorCount: authors.count ?? 0,
  });

  const contentScore =
    analyses.length > 0
      ? Math.round(analyses.reduce((a, p) => a + p.score, 0) / analyses.length)
      : 100;
  const overall = Math.round((contentScore + site.score) / 2);

  // Aggregate the most common issues across posts.
  const issueMap = new Map<string, { count: number; status: Check["status"]; detail: string }>();
  for (const a of analyses) {
    for (const c of a.checks) {
      if (c.status === "good") continue;
      const cur = issueMap.get(c.label);
      if (cur) cur.count++;
      else issueMap.set(c.label, { count: 1, status: c.status, detail: c.detail });
    }
  }
  const topIssues = [...issueMap.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 8);

  return (
    <div>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">SEO Health</h1>
        <span className="text-sm text-zinc-500">
          {analyses.length} published post{analyses.length === 1 ? "" : "s"} analyzed
        </span>
      </div>
      <p className="mb-6 text-sm text-zinc-500">
        An automatic SEO audit of your published posts and site setup, with
        exactly what to improve.
      </p>

      {/* Score cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <div className="col-span-2 sm:col-span-1">
          <ScoreCard label="Overall SEO health" score={overall} big />
        </div>
        <ScoreCard label="Content SEO (posts)" score={contentScore} />
        <ScoreCard label="Site setup" score={site.score} />
      </div>

      {/* Top things to improve */}
      <section className="mb-8 rounded-xl border border-border bg-white p-5">
        <h2 className="mb-4 font-semibold">Top things to improve</h2>
        {topIssues.length === 0 ? (
          <p className="text-sm text-green-700">
            🎉 No common post issues found — your content SEO looks great.
          </p>
        ) : (
          <ul className="space-y-3">
            {topIssues.map(([label, info]) => (
              <li key={label} className="flex gap-3">
                <span className={`mt-0.5 font-bold ${dot[info.status]}`}>
                  {icon[info.status]}
                </span>
                <div>
                  <p className="text-sm font-semibold">
                    {label}{" "}
                    <span className="font-normal text-zinc-500">
                      — affects {info.count} post{info.count === 1 ? "" : "s"}
                    </span>
                  </p>
                  <p className="text-sm text-zinc-500">{info.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Site setup checklist */}
      <section className="mb-8 rounded-xl border border-border bg-white p-5">
        <h2 className="mb-4 font-semibold">Site setup</h2>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {site.checks.map((c) => (
            <li key={c.label} className="flex gap-3">
              <span className={`mt-0.5 font-bold ${dot[c.status]}`}>
                {icon[c.status]}
              </span>
              <div>
                <p className="text-sm font-semibold">{c.label}</p>
                <p className="text-sm text-zinc-500">{c.detail}</p>
              </div>
            </li>
          ))}
        </ul>
        <Link
          href="/admin/settings"
          className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
        >
          Go to Settings →
        </Link>
      </section>

      {/* Per-post breakdown */}
      <section className="rounded-xl border border-border bg-white p-5">
        <h2 className="mb-4 font-semibold">Post-by-post audit</h2>
        {analyses.length === 0 ? (
          <p className="py-6 text-center text-sm text-zinc-500">
            No published posts to analyze yet.
          </p>
        ) : (
          <div className="space-y-2">
            {analyses.map((a) => {
              const color = scoreColor(a.score);
              return (
                <details
                  key={a.id}
                  className="group rounded-lg border border-border"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
                    <span
                      className={`flex h-9 w-11 shrink-0 items-center justify-center rounded-md text-sm font-bold ${badge[color]}`}
                    >
                      {a.score}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {a.title}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {a.wordCount} words ·{" "}
                        {a.problems === 0
                          ? "no issues"
                          : `${a.problems} thing${a.problems === 1 ? "" : "s"} to improve`}
                      </span>
                    </span>
                    <Link
                      href={`/admin/posts/${a.id}/edit`}
                      className="shrink-0 text-xs font-semibold text-accent hover:underline"
                    >
                      Edit
                    </Link>
                    <span className="shrink-0 text-zinc-400 transition-transform group-open:rotate-180">
                      ▾
                    </span>
                  </summary>
                  <ul className="space-y-2 border-t border-border px-4 py-3">
                    {a.checks.map((c, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className={`mt-0.5 font-bold ${dot[c.status]}`}>
                          {icon[c.status]}
                        </span>
                        <span>
                          <span className="font-medium">{c.label}:</span>{" "}
                          <span className="text-zinc-500">{c.detail}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </details>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function ScoreCard({
  label,
  score,
  big,
}: {
  label: string;
  score: number;
  big?: boolean;
}) {
  const color = scoreColor(score);
  const ring =
    color === "green"
      ? "border-green-200 bg-green-50"
      : color === "amber"
        ? "border-amber-200 bg-amber-50"
        : "border-red-200 bg-red-50";
  const text =
    color === "green"
      ? "text-green-700"
      : color === "amber"
        ? "text-amber-700"
        : "text-red-700";
  return (
    <div className={`h-full rounded-xl border p-4 sm:p-5 ${ring}`}>
      <p className="text-xs font-medium text-zinc-600 sm:text-sm">{label}</p>
      <p
        className={`mt-1 font-bold ${text} ${
          big ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"
        }`}
      >
        {score}
        <span className="text-base sm:text-xl">/100</span>
      </p>
    </div>
  );
}
