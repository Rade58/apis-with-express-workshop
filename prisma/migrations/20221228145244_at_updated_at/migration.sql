/*
  Warnings:

  - Made the column `updatedAt` on table `Update` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `UpdatePoint` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Update" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "UpdatePoint" ALTER COLUMN "updatedAt" SET NOT NULL;
