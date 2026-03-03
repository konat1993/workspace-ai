/*
  Warnings:

  - Added the required column `status` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceVariant` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ASSISTANT');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('UNKNOWN', 'STREAMING', 'DONE', 'ERROR', 'STOPPED');

-- CreateEnum
CREATE TYPE "WorkspaceVariant" AS ENUM ('SIMULATED', 'INTEGRATED');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "status" "Status" NOT NULL,
ADD COLUMN     "workspaceVariant" "WorkspaceVariant" NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL;
