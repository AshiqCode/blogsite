import "server-only";

/**
 * Sanitize rich-text HTML before storing it.
 *
 * DOMPurify (via isomorphic-dompurify → jsdom) is loaded lazily and only when
 * this runs, so it never gets bundled into public listing pages or the client.
 * If it can't load in the current runtime, we fall back to a conservative
 * regex-based strip. Content here is authored by the trusted admin, so the
 * fallback is defense-in-depth rather than the primary trust boundary.
 */
export async function sanitizeHtml(dirty: string): Promise<string> {
  try {
    const { default: DOMPurify } = await import("isomorphic-dompurify");
    return DOMPurify.sanitize(dirty, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ["target", "rel"],
    });
  } catch {
    return basicSanitize(dirty);
  }
}

/** Dependency-free fallback: remove the most dangerous constructs. */
function basicSanitize(dirty: string): string {
  return dirty
    .replace(/<\s*(script|style|iframe|object|embed|form)[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|form)[^>]*\/?\s*>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"');
}
