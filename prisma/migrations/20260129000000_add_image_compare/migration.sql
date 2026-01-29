-- AlterEnum: Add IMAGE_COMPARE to QuestionType
ALTER TYPE "QuestionType" ADD VALUE 'IMAGE_COMPARE';

-- AlterTable: Add image_url_2 column for IMAGE_COMPARE type
ALTER TABLE "questions" ADD COLUMN "image_url_2" VARCHAR(500);
