-- Your SQL goes here
CREATE TABLE `phrase` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `english_text` VARCHAR(2083) NOT NULL,
    `translation_text` VARCHAR(2083) NOT NULL,
    PRIMARY KEY (`id`)
);