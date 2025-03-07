-- DropForeignKey
ALTER TABLE "Voto" DROP CONSTRAINT "Voto_desculpaId_fkey";

-- DropForeignKey
ALTER TABLE "Voto" DROP CONSTRAINT "Voto_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Desculpa" ADD COLUMN     "contadorVotos" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Desculpa_autorId_idx" ON "Desculpa"("autorId");

-- CreateIndex
CREATE INDEX "Voto_usuarioId_idx" ON "Voto"("usuarioId");

-- CreateIndex
CREATE INDEX "Voto_desculpaId_idx" ON "Voto"("desculpaId");

-- AddForeignKey
ALTER TABLE "Voto" ADD CONSTRAINT "Voto_desculpaId_fkey" FOREIGN KEY ("desculpaId") REFERENCES "Desculpa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voto" ADD CONSTRAINT "Voto_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
