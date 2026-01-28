-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('lobby', 'asking', 'revealed', 'ended');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('IMAGE_CLASSIFY', 'TEXT_CLASSIFY', 'HALLUCINATION_DETECT', 'LGPD_TRAFFIC_LIGHT');

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "status" "RoomStatus" NOT NULL DEFAULT 'lobby',
    "current_question_index" INTEGER NOT NULL DEFAULT -1,
    "question_started_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "nickname" VARCHAR(30) NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "prompt" TEXT NOT NULL,
    "image_url" VARCHAR(500),
    "options_json" JSONB NOT NULL,
    "correct_option" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_questions" (
    "id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "room_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "selected_option" INTEGER NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "time_ms" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rooms_code_key" ON "rooms"("code");

-- CreateIndex
CREATE UNIQUE INDEX "room_questions_room_id_question_id_key" ON "room_questions"("room_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "answers_room_id_player_id_question_id_key" ON "answers"("room_id", "player_id", "question_id");

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_questions" ADD CONSTRAINT "room_questions_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_questions" ADD CONSTRAINT "room_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
