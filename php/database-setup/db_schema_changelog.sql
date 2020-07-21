-- db ddl commands for creation
-- for db setup view the config.ini file in backend folder
-- host=127.0.0.1
-- name=62167_ivan_chuchulski
-- user=root
-- password=

CREATE DATABASE IF NOT EXISTS `web_schedule`;

USE `web_schedule`;

-- the normal user, who logs in the system and views the schedule
CREATE TABLE `user` (
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  CONSTRAINT `users_pk` PRIMARY KEY (`username`)
);

-- presentation
CREATE TABLE `presentation` (
  `theme` VARCHAR(255) NOT NULL,
  `presentDate` DATETIME NOT NULL,
  `dayNumber` INT NOT NULL,
  `presenterName` VARCHAR(255) NOT NULL,
  `facultyNumber` INT NOT NULL,
  `groupNumber` INT NOT NULL,
  `place` VARCHAR(255) NOT NULL,
  CONSTRAINT `presentation_pk` PRIMARY KEY (`theme`)
);

  -- preference for given user and event
  CREATE TABLE `preference` (
    `preferenceId` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `presentationTheme` VARCHAR(255) NOT NULL, 
    `preferenceType` ENUM('willAttend', 'couldAttend'),
    CONSTRAINT `preference_pk` PRIMARY KEY (`preferenceId`),
    CONSTRAINT `preference_fk_user` FOREIGN KEY (`username`) REFERENCES `user`(`username`) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `preference_fk_presentation` FOREIGN KEY (`presentationTheme`) REFERENCES `presentation`(`theme`) ON UPDATE CASCADE ON DELETE CASCADE
  );