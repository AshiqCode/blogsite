// Shared application + database types.

export type PostStatus = "draft" | "published" | "archived";
export type CommentStatus = "pending" | "approved" | "spam";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  featured_image: string | null;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Author {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string; // sanitized HTML
  featured_image: string | null;
  category_id: string | null;
  author_id: string | null;
  status: PostStatus;
  meta_title: string | null;
  meta_description: string | null;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostWithRelations extends Post {
  category: Category | null;
  author: Author | null;
  tags: Tag[];
}

export interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  status: CommentStatus;
  parent_id: string | null;
  created_at: string;
}

export interface CommentWithPost extends Comment {
  post: Pick<Post, "id" | "title" | "slug"> | null;
}

export interface MediaItem {
  id: string;
  file_name: string;
  storage_path: string;
  url: string;
  alt_text: string | null;
  caption: string | null;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  site_title: string;
  tagline: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  about: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  social_twitter: string | null;
  social_facebook: string | null;
  social_instagram: string | null;
  social_github: string | null;
  social_linkedin: string | null;
  footer_text: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  google_analytics_id: string | null;
  google_verification: string | null;
  adsense_publisher_id: string | null;
  author_name: string | null;
  author_bio: string | null;
  author_avatar: string | null;
  updated_at: string;
}

// Note: the Supabase clients are intentionally left untyped (no generated
// Database generic). Query results are cast to the interfaces above at the
// call sites that need strong typing.
