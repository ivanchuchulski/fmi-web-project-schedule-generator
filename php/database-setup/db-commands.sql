-- db dml commands
-- these are prepared statements

-- user queries
INSERT INTO user (username, password, email) 
VALUES(:username, :password, :email);

SELECT * 
FROM user 
WHERE username=:username;

-- presentation queries
SELECT * 
FROM presentation 
WHERE theme = :theme;

INSERT INTO presentation (theme , presentDate, dayNumber, presenterName, facultyNumber, groupNumber, , place) 
VALUES(:theme, :presentDate, :dayNumber, :presenterName, :facultyNumber, groupNumber, :place);

-- preference queries
SELECT * 
FROM preference 
WHERE username=:username and presentationTheme=:presentationTheme;

INSERT INTO preference (username, presentationTheme, preferenceType) 
VALUES(:username, :presentationTheme, :preferenceType);

UPDATE preference
SET preferenceType=:preference
WHERE username=:username and presentationTheme=:presentationTheme;

DELETE FROM preference
WHERE username=:username and presentationTheme=:presentationTheme;

-- get presentations from preferences for a given username
SELECT presentation.theme, DATE_FORMAT(presentation.presentDate, '%H:%i %d %M %Y') as presentDate,
    presentation.presenterName, presentation.place, preference.preferenceType, 
    presentation.groupNumber, presentation.facultyNumber, presentation.dayNumber
FROM preference INNER JOIN presentation ON preference.presentationTheme = presentation.theme
WHERE presentationTheme IN (SELECT preference.presentationTheme
							FROM preference
						    WHERE username=:username);

-- get presentation from db with formatted date
SELECT `theme`, DATE_FORMAT(`presentDate`, "%H:%i %d %M %Y"), `presenterName`, `place`
FROM presentation

-- get number of users from db
SELECT COUNT(*) FROM user

-- get number of presentations from db
SELECT COUNT(*) FROM presentation

-- get number of preferences from db
SELECT COUNT(*) FROM preference

-- get max number of preference from all users from db
 SELECT MAX(t1.userCount)
 FROM (SELECT COUNT(username) as userCount
  	   FROM preference
  	   GROUP BY username ) as t1

-- get average number of preferences
SELECT CAST(AVG(t1.userCount) as INT)
FROM   (SELECT COUNT(username) as userCount
       FROM preference
       GROUP BY username ) as t1