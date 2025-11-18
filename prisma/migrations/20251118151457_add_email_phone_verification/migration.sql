-- CreateTable
CREATE TABLE `EmailOrPhoneVerification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `emailOrPhone` VARCHAR(191) NOT NULL,
    `otp` VARCHAR(191) NOT NULL,
    `data` JSON NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EmailOrPhoneVerification_emailOrPhone_key`(`emailOrPhone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
