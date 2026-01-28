-- CreateEnum
CREATE TYPE "PricingType" AS ENUM ('FREE', 'FREEMIUM', 'PAID');

-- CreateTable
CREATE TABLE "ai_categories" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(10) NOT NULL DEFAULT '🤖',
    "description" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_tools" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "description" TEXT NOT NULL,
    "short_desc" VARCHAR(300) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "logo_url" VARCHAR(500),
    "category_id" TEXT NOT NULL,
    "pricing_type" "PricingType" NOT NULL DEFAULT 'FREE',
    "pricing_details" TEXT,
    "features" TEXT[],
    "pros" TEXT[],
    "cons" TEXT[],
    "use_cases" TEXT[],
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_tools_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_categories_slug_key" ON "ai_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ai_tools_slug_key" ON "ai_tools"("slug");

-- CreateIndex
CREATE INDEX "ai_tools_category_id_idx" ON "ai_tools"("category_id");

-- CreateIndex
CREATE INDEX "ai_tools_pricing_type_idx" ON "ai_tools"("pricing_type");

-- CreateIndex
CREATE INDEX "ai_tools_is_featured_idx" ON "ai_tools"("is_featured");

-- CreateIndex
CREATE INDEX "ai_tools_is_active_idx" ON "ai_tools"("is_active");

-- AddForeignKey
ALTER TABLE "ai_tools" ADD CONSTRAINT "ai_tools_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "ai_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
