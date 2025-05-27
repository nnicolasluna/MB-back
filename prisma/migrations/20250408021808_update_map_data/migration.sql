/*
  Warnings:

  - You are about to drop the column `carimbo` on the `recursos_cartograficos` table. All the data in the column will be lost.
  - You are about to drop the column `contacto_recurso` on the `recursos_cartograficos` table. All the data in the column will be lost.
  - You are about to drop the column `crs` on the `recursos_cartograficos` table. All the data in the column will be lost.
  - You are about to drop the column `escala` on the `recursos_cartograficos` table. All the data in the column will be lost.
  - You are about to drop the column `estado_recurso` on the `recursos_cartograficos` table. All the data in the column will be lost.
  - You are about to drop the column `fuente` on the `recursos_cartograficos` table. All the data in the column will be lost.
  - You are about to drop the column `permitir_descarga_carimbo` on the `recursos_cartograficos` table. All the data in the column will be lost.
  - You are about to drop the `_ThematicMapData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `servicios_mapas_web` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tematicas_mapas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_ThematicMapData" DROP CONSTRAINT "_ThematicMapData_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ThematicMapData" DROP CONSTRAINT "_ThematicMapData_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."recursos_cartograficos" DROP CONSTRAINT "recursos_cartograficos_carimbo_fkey";

-- AlterTable
ALTER TABLE "public"."recursos_cartograficos" DROP COLUMN "carimbo",
DROP COLUMN "contacto_recurso",
DROP COLUMN "crs",
DROP COLUMN "escala",
DROP COLUMN "estado_recurso",
DROP COLUMN "fuente",
DROP COLUMN "permitir_descarga_carimbo",
ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(255);

-- DropTable
DROP TABLE "public"."_ThematicMapData";

-- DropTable
DROP TABLE "public"."servicios_mapas_web";

-- DropTable
DROP TABLE "public"."tematicas_mapas";
