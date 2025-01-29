/*
  Warnings:

  - The primary key for the `password-requests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `requestId` on the `password-requests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `password-requests` DROP PRIMARY KEY,
    DROP COLUMN `requestId`,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
