-- CreateEnum
CREATE TYPE "public"."OrderEventStatus" AS ENUM ('PENDING', 'ACCEPTED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "defaultBillingAddress" INTEGER,
ADD COLUMN     "defaultShippingAddress" INTEGER;
