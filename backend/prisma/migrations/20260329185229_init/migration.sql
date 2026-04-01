-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'ADMIN');

-- CreateEnum
CREATE TYPE "CampaignScope" AS ENUM ('PRODUCTS', 'CATEGORY', 'ALL_ORDERS');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH_ON_DELIVERY', 'CARD', 'WALLET');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "LoyaltyReason" AS ENUM ('EARN_ORDER', 'REDEEM', 'MANUAL_ADJUST');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "phone_number" VARCHAR(20),
    "birthday" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name_ar" VARCHAR(255) NOT NULL,
    "name_en" VARCHAR(255) NOT NULL,
    "parent_id" UUID,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_id" UUID,
    "name_ar" VARCHAR(255) NOT NULL,
    "name_en" VARCHAR(255) NOT NULL,
    "description_ar" TEXT,
    "description_en" TEXT,
    "base_price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "sku" VARCHAR(100) NOT NULL,
    "color" VARCHAR(100),
    "size" VARCHAR(50),
    "price_modifier" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "images" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cart_id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_regions" (
    "id" SERIAL NOT NULL,
    "region_name" VARCHAR(255) NOT NULL,
    "shipping_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "estimated_days" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "shipping_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "region_id" INTEGER NOT NULL,
    "address_details" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "banner_url" TEXT,
    "discount_percentage" DECIMAL(5,2) NOT NULL,
    "scope" "CampaignScope" NOT NULL DEFAULT 'PRODUCTS',
    "category_id" UUID,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_products" (
    "campaign_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,

    CONSTRAINT "campaign_products_pkey" PRIMARY KEY ("campaign_id","product_id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL,
    "discount_type" "DiscountType" NOT NULL,
    "discount_value" DECIMAL(10,2) NOT NULL,
    "min_order_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "max_uses" INTEGER,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_points" (
    "user_id" UUID NOT NULL,
    "current_balance" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "loyalty_points_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "loyalty_transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "order_id" UUID,
    "change_amount" INTEGER NOT NULL,
    "reason" "LoyaltyReason" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loyalty_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "address_id" UUID NOT NULL,
    "coupon_id" UUID,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "payment_method" "PaymentMethod" NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "shipping_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "payment_method_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "points_discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "coupon_discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "final_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "tracking_number" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "order_id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price_at_purchase" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("order_id","variant_id")
);

-- CreateTable
CREATE TABLE "order_status_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "comment" TEXT,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "review_images" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "product_variants"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "carts_user_id_key" ON "carts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cart_id_variant_id_key" ON "cart_items"("cart_id", "variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_product_id_user_id_key" ON "reviews"("product_id", "user_id");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "shipping_regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_products" ADD CONSTRAINT "campaign_products_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_products" ADD CONSTRAINT "campaign_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_points" ADD CONSTRAINT "loyalty_points_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
