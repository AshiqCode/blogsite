import type { SiteSettings } from "@/lib/types";

export type CheckStatus = "good" | "warn" | "error";

export interface Check {
  label: string;
  status: CheckStatus;
  detail: string;
}

export interface PostSeoInput {
  id: string;
  title: string;
  slug: string;
  status: string;
  content: string;
  excerpt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  featured_image: string | null;
  category_id: string | null;
  author_id: string | null;
  tags_count: number;
}

export interface PostAnalysis {
  id: string;
  title: string;
  slug: string;
  status: string;
  score: number;
  wordCount: number;
  checks: Check[];
  problems: number;
}

const WEIGHT: Record<CheckStatus, number> = { good: 1, warn: 0.5, error: 0 };

function scoreOf(checks: Check[]): number {
  if (checks.length === 0) return 100;
  const sum = checks.reduce((a, c) => a + WEIGHT[c.status], 0);
  return Math.round((sum / checks.length) * 100);
}

function wordCount(html: string): number {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Analyze a single post's on-page SEO. */
export function analyzePost(p: PostSeoInput): PostAnalysis {
  const checks: Check[] = [];
  const words = wordCount(p.content);

  // Title
  const titleLen = p.title.trim().length;
  if (titleLen === 0) checks.push({ label: "Title", status: "error", detail: "The post has no title." });
  else if (titleLen > 70) checks.push({ label: "Title length", status: "warn", detail: `Title is ${titleLen} characters — keep it under ~70 so it isn't cut off in Google.` });
  else if (titleLen < 20) checks.push({ label: "Title length", status: "warn", detail: `Title is short (${titleLen} chars). A descriptive 40–70 character title ranks better.` });
  else checks.push({ label: "Title", status: "good", detail: `Good title length (${titleLen} chars).` });

  // Meta title
  const mt = (p.meta_title ?? "").trim();
  if (!mt) checks.push({ label: "Meta title", status: "warn", detail: "No SEO meta title — the post title is used as a fallback. Add a focused 50–60 character meta title." });
  else if (mt.length > 60) checks.push({ label: "Meta title", status: "warn", detail: `Meta title is ${mt.length} chars — Google may truncate it. Aim for 50–60.` });
  else if (mt.length < 30) checks.push({ label: "Meta title", status: "warn", detail: `Meta title is short (${mt.length} chars). Aim for 50–60 to use the full space.` });
  else checks.push({ label: "Meta title", status: "good", detail: `Meta title length is ideal (${mt.length} chars).` });

  // Meta description
  const md = (p.meta_description ?? "").trim();
  if (!md) checks.push({ label: "Meta description", status: "error", detail: "No meta description. Add a compelling 120–160 character summary — it strongly affects click-through from Google." });
  else if (md.length > 160) checks.push({ label: "Meta description", status: "warn", detail: `Meta description is ${md.length} chars — Google may cut it off. Keep it under 160.` });
  else if (md.length < 70) checks.push({ label: "Meta description", status: "warn", detail: `Meta description is short (${md.length} chars). Aim for 120–160.` });
  else checks.push({ label: "Meta description", status: "good", detail: `Meta description length is ideal (${md.length} chars).` });

  // Content length
  if (words < 300) checks.push({ label: "Content length", status: "error", detail: `Only ${words} words — this is thin content that rarely ranks. Aim for 600+ words.` });
  else if (words < 600) checks.push({ label: "Content length", status: "warn", detail: `${words} words. Solid, but 600+ words tends to rank better for most topics.` });
  else checks.push({ label: "Content length", status: "good", detail: `Healthy content length (${words} words).` });

  // Headings
  if (!/<h[2-4][\s>]/i.test(p.content)) checks.push({ label: "Subheadings", status: "warn", detail: "No subheadings (H2/H3). Break content into sections with headings for readers and SEO." });
  else checks.push({ label: "Subheadings", status: "good", detail: "Content uses subheadings for structure." });

  // Links
  if (!/<a\s/i.test(p.content)) checks.push({ label: "Links", status: "warn", detail: "No links in the content. Add internal links to related posts to help SEO and keep readers on-site." });
  else checks.push({ label: "Links", status: "good", detail: "Content contains links." });

  // Featured image
  if (!p.featured_image) checks.push({ label: "Featured image", status: "warn", detail: "No featured image. Add one — it powers social previews and image search." });
  else checks.push({ label: "Featured image", status: "good", detail: "Featured image is set." });

  // Excerpt
  if (!(p.excerpt ?? "").trim()) checks.push({ label: "Excerpt", status: "warn", detail: "No excerpt/summary. It appears on listings and as a fallback description." });
  else checks.push({ label: "Excerpt", status: "good", detail: "Excerpt is set." });

  // Category
  if (!p.category_id) checks.push({ label: "Category", status: "warn", detail: "No category assigned. Categories help site structure and navigation." });
  else checks.push({ label: "Category", status: "good", detail: "Category assigned." });

  // Tags
  if (p.tags_count === 0) checks.push({ label: "Tags", status: "warn", detail: "No tags. Add 3–5 relevant tags to improve discoverability." });
  else if (p.tags_count < 3) checks.push({ label: "Tags", status: "warn", detail: `Only ${p.tags_count} tag(s). 3–5 relevant tags are recommended.` });
  else checks.push({ label: "Tags", status: "good", detail: `${p.tags_count} tags assigned.` });

  // Author (E-E-A-T)
  if (!p.author_id) checks.push({ label: "Author", status: "warn", detail: "No author assigned. A clear author (E-E-A-T) builds trust with Google." });
  else checks.push({ label: "Author", status: "good", detail: "Author assigned." });

  // Slug
  if (p.slug.length > 75) checks.push({ label: "URL slug", status: "warn", detail: "The URL slug is very long. Short, keyword-focused slugs are cleaner." });
  else checks.push({ label: "URL slug", status: "good", detail: "URL slug looks clean." });

  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    status: p.status,
    wordCount: words,
    checks,
    score: scoreOf(checks),
    problems: checks.filter((c) => c.status !== "good").length,
  };
}

export interface SiteStats {
  publishedCount: number;
  draftCount: number;
  categoryCount: number;
  authorCount: number;
}

/** Analyze site-wide setup (settings + content volume). */
export function analyzeSite(settings: SiteSettings, stats: SiteStats): {
  checks: Check[];
  score: number;
} {
  const checks: Check[] = [];

  if (!settings.site_title || settings.site_title === "My Blog") checks.push({ label: "Site title", status: "warn", detail: "Site title is empty or still the default 'My Blog'. Set your real brand name in Settings." });
  else checks.push({ label: "Site title", status: "good", detail: `Site title set to “${settings.site_title}”.` });

  if (!(settings.seo_description ?? settings.tagline ?? "").trim()) checks.push({ label: "Site description", status: "warn", detail: "No default SEO description or tagline. Add one in Settings → SEO." });
  else checks.push({ label: "Site description", status: "good", detail: "Default site description is set." });

  if (!settings.logo_url) checks.push({ label: "Logo", status: "warn", detail: "No logo uploaded. A logo builds brand and appears in structured data." });
  else checks.push({ label: "Logo", status: "good", detail: "Logo is set." });

  if (!settings.favicon_url) checks.push({ label: "Favicon", status: "warn", detail: "No favicon set. Add one so your icon shows in browser tabs and search." });
  else checks.push({ label: "Favicon", status: "good", detail: "Favicon is set." });

  if (!(settings.about ?? "").trim()) checks.push({ label: "About page", status: "warn", detail: "About text is empty. A real About page builds trust (and is needed for AdSense)." });
  else checks.push({ label: "About page", status: "good", detail: "About content is set." });

  if (!settings.contact_email) checks.push({ label: "Contact email", status: "warn", detail: "No contact email set. Needed for the contact form and trust signals." });
  else checks.push({ label: "Contact email", status: "good", detail: "Contact email is set." });

  if (!settings.google_verification) checks.push({ label: "Search Console", status: "warn", detail: "No Google Search Console verification. Verify your site and submit the sitemap so Google indexes you." });
  else checks.push({ label: "Search Console", status: "good", detail: "Search Console verification is set." });

  if (!settings.google_analytics_id) checks.push({ label: "Analytics", status: "warn", detail: "Google Analytics not connected. Add your Measurement ID to track visitors." });
  else checks.push({ label: "Analytics", status: "good", detail: "Google Analytics is connected." });

  if (stats.publishedCount < 10) checks.push({ label: "Content volume", status: "warn", detail: `Only ${stats.publishedCount} published post(s). Aim for 15–30+ quality posts for strong SEO and AdSense approval.` });
  else checks.push({ label: "Content volume", status: "good", detail: `${stats.publishedCount} published posts — a solid content base.` });

  if (stats.categoryCount === 0) checks.push({ label: "Categories", status: "warn", detail: "No categories. Organize posts into a few clear categories." });
  else checks.push({ label: "Categories", status: "good", detail: `${stats.categoryCount} categories.` });

  return { checks, score: scoreOf(checks) };
}

export function scoreColor(score: number): string {
  if (score >= 80) return "green";
  if (score >= 60) return "amber";
  return "red";
}
