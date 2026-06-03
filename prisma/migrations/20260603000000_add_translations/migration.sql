-- Add optional DE/EN translation columns (nullable; fall back to base TR fields)

-- Product
ALTER TABLE "Product" ADD COLUMN "name_de" TEXT;
ALTER TABLE "Product" ADD COLUMN "name_en" TEXT;
ALTER TABLE "Product" ADD COLUMN "description_de" TEXT;
ALTER TABLE "Product" ADD COLUMN "description_en" TEXT;
ALTER TABLE "Product" ADD COLUMN "features_de" TEXT;
ALTER TABLE "Product" ADD COLUMN "features_en" TEXT;

-- BlogPost
ALTER TABLE "BlogPost" ADD COLUMN "title_de" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "title_en" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "content_de" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "content_en" TEXT;

-- HeroSlide
ALTER TABLE "HeroSlide" ADD COLUMN "title_de" TEXT;
ALTER TABLE "HeroSlide" ADD COLUMN "title_en" TEXT;
ALTER TABLE "HeroSlide" ADD COLUMN "subtitle_de" TEXT;
ALTER TABLE "HeroSlide" ADD COLUMN "subtitle_en" TEXT;
