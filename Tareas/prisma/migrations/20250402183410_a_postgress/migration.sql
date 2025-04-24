-- CreateTable
CREATE TABLE "Obra" (
    "id" SERIAL NOT NULL,
    "título" TEXT NOT NULL,
    "imágen" TEXT NOT NULL,
    "descripción" TEXT NOT NULL,
    "procedencia" TEXT NOT NULL,
    "comentario" TEXT NOT NULL,

    CONSTRAINT "Obra_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Obra_título_key" ON "Obra"("título");
