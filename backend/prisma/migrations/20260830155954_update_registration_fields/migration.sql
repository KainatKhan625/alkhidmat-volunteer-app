/*
  Warnings:

  - You are about to drop the column `emergencyContact` on the `Registration` table. All the data in the column will be lost.
  - You are about to drop the column `transportNeeded` on the `Registration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "emergencyContact",
DROP COLUMN "transportNeeded",
ADD COLUMN     "availability" TEXT,
ADD COLUMN     "cnic" TEXT,
ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "fullName" TEXT;
