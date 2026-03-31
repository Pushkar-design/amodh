import {
  isPermittedRoomImageUrl,
  isUnsplashPhotoPageUrl,
} from "./roomImageUrl";

/**
 * Extract Google Drive file id from common share / open / uc URLs.
 */
export function extractGoogleDriveFileId(url: string): string | null {
  try {
    const u = new URL(url.trim());
    if (u.hostname !== "drive.google.com") {
      return null;
    }
    const pathMatch = u.pathname.match(/\/file\/d\/([^/]+)/);
    if (pathMatch?.[1]) {
      return pathMatch[1];
    }
    const id = u.searchParams.get("id");
    if (id && /^[a-zA-Z0-9_-]+$/.test(id)) {
      return id;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * URL to use in <img> / next/image. Drive's uc?export=view often returns HTML, not bytes;
 * the thumbnail endpoint serves an actual image for many publicly shared files.
 */
export function googleDriveThumbnailUrl(fileId: string, maxWidth = 2048): string {
  const q = new URLSearchParams({
    id: fileId,
    sz: `w${maxWidth}`,
  });
  return `https://drive.google.com/thumbnail?${q.toString()}`;
}

/**
 * Canonical form stored in DB for Drive images (stable, re-parsable).
 */
export function normalizeGoogleDriveImageUrl(url: string): string {
  const id = extractGoogleDriveFileId(url);
  if (id) {
    return `https://drive.google.com/file/d/${id}/view`;
  }
  return url.trim();
}

/** Use for next/image and <img> so stored Drive links render as images when possible. */
export function resolveDisplayImageUrl(
  url: string | null | undefined
): string | null {
  if (!url?.trim()) return null;
  const trimmed = url.trim();
  const id = extractGoogleDriveFileId(trimmed);
  if (id) {
    return googleDriveThumbnailUrl(id);
  }
  if (isUnsplashPhotoPageUrl(trimmed)) {
    return null;
  }
  return trimmed;
}

/** True when src is served from Google Drive (skip image optimizer / odd redirects). */
export function isGoogleDriveImageHost(displayUrl: string): boolean {
  try {
    const h = new URL(displayUrl).hostname;
    return h === "drive.google.com" || h.endsWith(".googleusercontent.com");
  } catch {
    return false;
  }
}

/** Normalize optional image URL for DB; rejects non-http(s) URLs. */
export function parseImageUrlForDb(
  value: unknown
): { ok: true; url: string | null } | { ok: false; error: string } {
  if (value === undefined || value === null) {
    return { ok: true, url: null };
  }
  const s = String(value).trim();
  if (!s) {
    return { ok: true, url: null };
  }
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return { ok: false, error: "image_url must be an http(s) URL" };
    }
    if (!isPermittedRoomImageUrl(s)) {
      return {
        ok: false,
        error:
          "image_url must be an uploaded photo (admin upload) or an existing supported image link",
      };
    }
    const normalized = normalizeGoogleDriveImageUrl(s);
    return { ok: true, url: normalized };
  } catch {
    return { ok: false, error: "image_url must be a valid URL" };
  }
}
