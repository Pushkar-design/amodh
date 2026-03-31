-- Public bucket for room photos; uploads go through Next.js admin API (service role).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'room-images',
  'room-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Anyone can read room images" ON storage.objects;

CREATE POLICY "Anyone can read room images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'room-images');
