-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "criadoEm" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medidas" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "busto" DECIMAL(5,1) NOT NULL,
    "torax" DECIMAL(5,1) NOT NULL,
    "cintura" DECIMAL(5,1) NOT NULL,
    "quadril" DECIMAL(5,1) NOT NULL,
    "coxa" DECIMAL(5,1) NOT NULL,
    "calcado" DECIMAL(5,1) NOT NULL,
    "criadoEm" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Medidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodigoAcesso" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodigoAcesso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Medidas_usuarioId_key" ON "Medidas"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "CodigoAcesso_usuarioId_key" ON "CodigoAcesso"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "CodigoAcesso_codigo_key" ON "CodigoAcesso"("codigo");

-- AddForeignKey
ALTER TABLE "Medidas" ADD CONSTRAINT "Medidas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodigoAcesso" ADD CONSTRAINT "CodigoAcesso_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
