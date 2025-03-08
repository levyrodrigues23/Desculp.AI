/*
  Warnings:

  - You are about to drop the column `contadorVotos` on the `Desculpa` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Voto" DROP CONSTRAINT "Voto_desculpaId_fkey";

-- DropForeignKey
ALTER TABLE "Voto" DROP CONSTRAINT "Voto_usuarioId_fkey";

-- DropIndex
DROP INDEX "Desculpa_autorId_idx";

-- DropIndex
DROP INDEX "Voto_desculpaId_idx";

-- DropIndex
DROP INDEX "Voto_usuarioId_idx";

-- AlterTable
ALTER TABLE "Desculpa" DROP COLUMN "contadorVotos";

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Voto" ADD CONSTRAINT "Voto_desculpaId_fkey" FOREIGN KEY ("desculpaId") REFERENCES "Desculpa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voto" ADD CONSTRAINT "Voto_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
