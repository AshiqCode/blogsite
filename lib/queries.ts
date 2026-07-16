import { createClient } from "@/lib/supabase/server";
import type {
  Author,
  Category,
  Comment,
  PostWithRelations,
  SiteSettings,
  Tag,
} from "@/lib/types";

const POST_SELECT = `
  *,
  category:categories(*),
  tags:tags(*)
`;

const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  site_title: "My Blog",
  tagline: "Thoughts, stories and ideas.",
  logo_url: null,
  favicon_url: null,
  about: null,
  contact_email: null,
  contact_phone: null,
  social_twitter: null,
  social_facebook: null,
  social_instagram: null,
  social_github: null,
  social_linkedin: null,
  footer_text: null,
  seo_title: null,
  seo_description: null,
  seo_keywords: null,
  google_analytics_id: null,
  google_verification: null,
  adsense_publisher_id: null,
  author_name: null,
  author_bio: null,
  author_avatar: null,
  updated_at: new Date(0).toISOString(),
};

/** Site settings (single row). Falls back to sensible defaults. */
export async function getSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .single();
    return (data as SiteSettings) ?? DEFAULT_SETTINGS;
  } catch {
    // Supabase not configured/reachable yet — degrade gracefully.
    return DEFAULT_SETTINGS;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("categories").select("*").order("name");
    return (data as Category[]) ?? [];
  } catch {
    return [];
  }
}

export async function getTags(): Promise<Tag[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("tags").select("*").order("name");
    return (data as Tag[]) ?? [];
  } catch {
    return [];
  }
}

export async function getAuthors(): Promise<Author[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("authors").select("*").order("name");
    return (data as Author[]) ?? [];
  } catch {
    return [];
  }
}

interface PublishedPostsOptions {
  categorySlug?: string;
  tagSlug?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

/** Published posts for the public site, newest first. */
export async function getPublishedPosts(
  opts: PublishedPostsOptions = {},
): Promise<{ posts: PostWithRelations[]; count: number }> {
  const supabase = await createClient();
  const { limit = 9, offset = 0, categorySlug, tagSlug, search } = opts;

  let query = supabase
    .from("posts")
    .select(POST_SELECT, { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();
    if (!cat) return { posts: [], count: 0 };
    query = query.eq("category_id", cat.id);
  }

  if (tagSlug) {
    const { data: tag } = await supabase
      .from("tags")
      .select("id, post_tags(post_id)")
      .eq("slug", tagSlug)
      .single();
    const postIds =
      (tag?.post_tags as { post_id: string }[] | undefined)?.map(
        (pt) => pt.post_id,
      ) ?? [];
    if (postIds.length === 0) return { posts: [], count: 0 };
    query = query.in("id", postIds);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
  }

  const { data, count } = await query.range(offset, offset + limit - 1);
  return {
    posts: (data as unknown as PostWithRelations[]) ?? [],
    count: count ?? 0,
  };
}

/** A single published post by slug, with category, tags and approved comments. */
export async function getPostBySlug(
  slug: string,
): Promise<{ post: PostWithRelations; comments: Comment[] } | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) return null;
  const post = data as unknown as PostWithRelations;

  // Attach the author separately so a missing authors table/migration never
  // breaks post fetching.
  post.author = await getAuthorForPost(supabase, post.author_id);

  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", post.id)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  return { post, comments: comments ?? [] };
}

/** Safely fetch a single author by id (null if none / table missing). */
async function getAuthorForPost(
  supabase: Awaited<ReturnType<typeof createClient>>,
  authorId: string | null | undefined,
): Promise<Author | null> {
  if (!authorId) return null;
  try {
    const { data } = await supabase
      .from("authors")
      .select("*")
      .eq("id", authorId)
      .single();
    return (data as Author) ?? null;
  } catch {
    return null;
  }
}

/**
 * Related published posts for the given article: same category first, then
 * filled with other recent posts. Excludes the current post.
 */
export async function getRelatedPosts(
  postId: string,
  categoryId: string | null,
  limit = 3,
): Promise<PostWithRelations[]> {
  try {
    const supabase = await createClient();
    const collected: PostWithRelations[] = [];
    const seen = new Set<string>([postId]);

    if (categoryId) {
      const { data } = await supabase
        .from("posts")
        .select(POST_SELECT)
        .eq("status", "published")
        .eq("category_id", categoryId)
        .neq("id", postId)
        .order("published_at", { ascending: false })
        .limit(limit);
      for (const p of (data as unknown as PostWithRelations[]) ?? []) {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          collected.push(p);
        }
      }
    }

    if (collected.length < limit) {
      const { data } = await supabase
        .from("posts")
        .select(POST_SELECT)
        .eq("status", "published")
        .neq("id", postId)
        .order("published_at", { ascending: false })
        .limit(limit + 1);
      for (const p of (data as unknown as PostWithRelations[]) ?? []) {
        if (collected.length >= limit) break;
        if (!seen.has(p.id)) {
          seen.add(p.id);
          collected.push(p);
        }
      }
    }

    return collected.slice(0, limit);
  } catch {
    return [];
  }
}

/** Recent published posts (used by the RSS feed). */
export async function getRecentPublished(
  limit = 20,
): Promise<PostWithRelations[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select(POST_SELECT)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);
    return (data as unknown as PostWithRelations[]) ?? [];
  } catch {
    return [];
  }
}

/** Increment a post's view counter (fire and forget). */
export async function trackView(slug: string): Promise<void> {
  const supabase = await createClient();
  await supabase.rpc("increment_post_views", { post_slug: slug });
}
