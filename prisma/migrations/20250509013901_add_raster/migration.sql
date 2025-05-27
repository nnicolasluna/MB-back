-- AlterTable
ALTER TABLE "public"."recursos_cartograficos" ADD COLUMN     "bbox_image" JSONB,
ADD COLUMN     "import_id" INTEGER,
ADD COLUMN     "name_image" TEXT,
ADD COLUMN     "srs_image" TEXT,
ADD COLUMN     "url_image" TEXT;
