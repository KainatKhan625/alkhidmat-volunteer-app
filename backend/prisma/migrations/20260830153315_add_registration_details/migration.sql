-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "additionalNotes" TEXT,
ADD COLUMN     "emergencyContact" TEXT,
ADD COLUMN     "relevantExperience" TEXT,
ADD COLUMN     "transportNeeded" BOOLEAN NOT NULL DEFAULT false;
