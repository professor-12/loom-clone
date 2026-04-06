-- Add optional folder association for videos (library organization)
ALTER TABLE "Video" ADD COLUMN IF NOT EXISTS "folderId" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Video_folderId_fkey'
  ) THEN
    ALTER TABLE "Video"
      ADD CONSTRAINT "Video_folderId_fkey"
      FOREIGN KEY ("folderId") REFERENCES "Folder"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
