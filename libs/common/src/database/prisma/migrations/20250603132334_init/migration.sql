/*
  Warnings:

  - Changed the type of `source` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `funnelStage` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Source" AS ENUM ('facebook', 'tiktok');

-- CreateEnum
CREATE TYPE "FunnelStage" AS ENUM ('top', 'bottom');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "source",
ADD COLUMN     "source" "Source" NOT NULL,
DROP COLUMN "funnelStage",
ADD COLUMN     "funnelStage" "FunnelStage" NOT NULL;
