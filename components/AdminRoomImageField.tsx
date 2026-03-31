"use client";

import { useCallback, useId, useState } from "react";
import { resolveDisplayImageUrl } from "@/lib/imageUrl";

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
  label?: string;
};

export function AdminRoomImageField({
  value,
  onChange,
  disabled = false,
  label = "Room photo",
}: Props) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const previewSrc = value ? resolveDisplayImageUrl(value) : null;

  const onFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      setUploadError(null);
      setUploading(true);
      try {
        const body = new FormData();
        body.set("file", file);
        const res = await fetch("/api/admin/upload-room-image", {
          method: "POST",
          body,
          credentials: "same-origin",
        });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok) {
          setUploadError(data.error ?? `Upload failed (${res.status})`);
          return;
        }
        if (!data.url) {
          setUploadError("Upload did not return a URL");
          return;
        }
        onChange(data.url);
      } catch {
        setUploadError("Network error during upload");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  return (
    <div className="flex flex-col gap-2 text-sm text-[#36454F]">
      <span>{label}</span>
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor={inputId}
          className={`inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-[#36454F]/25 bg-white px-4 ${disabled || uploading ? "pointer-events-none opacity-50" : "hover:border-[#36454F]/40"}`}
        >
          {uploading ? "Uploading…" : "Choose image"}
          <input
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={disabled || uploading}
            onChange={(e) => void onFile(e)}
          />
        </label>
        {value ? (
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => onChange(null)}
            className="min-h-11 rounded-lg border border-red-200 px-4 text-red-800 disabled:opacity-50"
          >
            Remove photo
          </button>
        ) : null}
      </div>
      <p className="text-xs text-[#36454F]/60">
        JPEG, PNG, WebP, or GIF · up to 5 MB. Shown on the public room gallery.
      </p>
      {uploadError ? (
        <p className="text-xs text-red-700" role="alert">
          {uploadError}
        </p>
      ) : null}
      {previewSrc ? (
        <div className="mt-1 overflow-hidden rounded-lg border border-[#36454F]/15">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewSrc}
            alt=""
            className="h-36 w-full object-cover"
          />
        </div>
      ) : null}
    </div>
  );
}
