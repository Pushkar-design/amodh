/**
 * Room images: primary source is Supabase Storage (`room-images` bucket).
 * Legacy rows may still use other https URLs until re-uploaded.
 */

const UNSPLASH_PAGE_HOSTS = new Set(["unsplash.com", "www.unsplash.com"]);

/** Photo share links are HTML pages, not image bytes — unsafe for next/image. */
export function isUnsplashPhotoPageUrl(urlString: string): boolean {
  try {
    const u = new URL(urlString.trim());
    return UNSPLASH_PAGE_HOSTS.has(u.hostname) && u.pathname.startsWith("/photos/");
  } catch {
    return false;
  }
}

export function isSupabaseRoomImagePublicUrl(urlString: string): boolean {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return false;
  try {
    const u = new URL(urlString.trim());
    const b = new URL(base);
    if (u.hostname !== b.hostname) return false;
    return u.pathname.startsWith("/storage/v1/object/public/room-images/");
  } catch {
    return false;
  }
}

/** True for storage room-images URLs or known legacy image hosts (existing DB rows). */
export function isPermittedRoomImageUrl(urlString: string): boolean {
  if (isSupabaseRoomImagePublicUrl(urlString)) return true;
  try {
    const u = new URL(urlString.trim());
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    if (u.hostname === "images.unsplash.com") return true;
    if (isUnsplashPhotoPageUrl(urlString)) return true;
    if (u.hostname === "drive.google.com") return true;
    if (u.hostname === "lh3.googleusercontent.com") return true;
    return false;
  } catch {
    return false;
  }
}
