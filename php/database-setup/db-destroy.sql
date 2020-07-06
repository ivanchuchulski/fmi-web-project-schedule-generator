-- db ddl commands for removal

USE `web_schedule`;

DELETE FROM `preference`;
DROP TABLE `preference`;

DELETE FROM `presentation`;
DROP TABLE `presentation`;

DELETE FROM `user`;
DROP TABLE `user`;

DROP DATABASE IF EXISTS `web_schedule`;
