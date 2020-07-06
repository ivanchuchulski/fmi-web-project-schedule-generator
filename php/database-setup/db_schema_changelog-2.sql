-- db ddl commands for creation
-- for db setup view the db-config.ini file in backend folder
-- host=127.0.0.1
-- name=62167_ivan_chuchulski
-- user=root
-- password=

CREATE DATABASE IF NOT EXISTS `web_schedule`;

USE `web_schedule`;

-- the normal user, who logs in the system and views the schedule
CREATE TABLE user (
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL
  id INT NOT NULL AUTO_INCREMENT,
  CONSTRAINT users_pk PRIMARY KEY (username)
);

-- students, who are presenters
CREATE TABLE student (
  name VARCHAR(255) NOT NULL,
  facultynum INT NOT NULL,
  major VARCHAR(255),
  year INT,
  studentGroup INT,
  CONSTRAINT student_pk PRIMARY KEY (facultynum)
);

CREATE TABLE presentation (
  theme VARCHAR(255) NOT NULL,
  presentationId INT NOT NULL AUTO_INCREMENT,
  presentDate VARCHAR(255) NOT NULL,
  presenterFacultyNum INT NOT NULL,
  CONSTRAINT presentation_pk PRIMARY KEY (theme),
  CONSTRAINT presentation_fk_user FOREIGH KEY (presenterFacultyNum) REFERENCES users(facultynum)
);

CREATE TABLE preference (
  preferenceId INT NOT NULL AUTO_INCREMENT,
  username INT NOT NULL,
  presentationTheme INT NOT NULL, 
  CONSTRAINT preference_pk PRIMARY KEY (preferenceId),
  CONSTRAINT preference_fk_user FOREIGH KEY (username) REFERENCES user(username),
  CONSTRAINT preference_fk_presentation FOREIGH KEY (presentationTheme) REFERENCES presentation(theme)
);