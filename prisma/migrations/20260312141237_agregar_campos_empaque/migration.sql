-- AlterTable
ALTER TABLE "empaque" ADD COLUMN     "estado" VARCHAR(50) DEFAULT 'Completado',
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "peso_total" DECIMAL(10,2),
ALTER COLUMN "fecha" SET DEFAULT CURRENT_TIMESTAMP;
