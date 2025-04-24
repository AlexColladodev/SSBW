-- CreateEnum
CREATE TYPE "ROL" AS ENUM ('USUARIO', 'ADMINISTRADOR');

-- CreateTable
CREATE TABLE "Usuario" (
    "correo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "ROL" NOT NULL DEFAULT 'USUARIO',

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("correo")
);
