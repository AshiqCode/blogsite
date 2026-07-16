import { createClient } from "@/lib/supabase/server";
import type {
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

  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", (data as unknown as PostWithRelations).id)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  return {
    post: data as unknown as PostWithRelations,
    comments: comments ?? [],
  };
}

/** Increment a post's view counter (fire and forget). */
export async function trackView(slug: string): Promise<void> {
  const supabase = await createClient();
  await supabase.rpc("increment_post_views", { post_slug: slug });
}
