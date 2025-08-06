-- CreateTable
CREATE TABLE `owners` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `owner_name` VARCHAR(225) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(85) NOT NULL,
    `product_brand` VARCHAR(45) NOT NULL,
    `created_date` DATETIME(0) NOT NULL,

    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products_owners` (
    `products_id` INTEGER NOT NULL,
    `owners_id` INTEGER NOT NULL,

    PRIMARY KEY (`products_id`, `owners_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products_owners` ADD CONSTRAINT `products_owners_owners_id_fkey` FOREIGN KEY (`owners_id`) REFERENCES `owners`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products_owners` ADD CONSTRAINT `products_owners_products_id_fkey` FOREIGN KEY (`products_id`) REFERENCES `products`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
