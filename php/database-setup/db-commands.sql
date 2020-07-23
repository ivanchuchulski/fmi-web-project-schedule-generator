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
    presentation.presenterName, presentation.place,  presentation.groupNumber, 
	presentation.facultyNumber, presentation.dayNumber, userPref.prefType
FROM  (SELECT preference.presentationTheme as presTheme, preference.preferenceType as prefType
							FROM preference
						    WHERE username=:username) as userPref INNER JOIN presentation ON userPref.presTheme = presentation.theme		

--  select number of preferences for a given presentation
SELECT COUNT(*) as numberOfPreferences
FROM preference
WHERE preference.presentationTheme = :presentationTheme

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

-- get most preferred presentation and number of attendance to it
 SELECT MAX(t1.presentationCount), t1.presentationTheme
 		FROM (SELECT COUNT(presentationTheme) as presentationCount, presentationTheme
  	   	FROM preference
  	   	GROUP BY presentationTheme ) as t1
-- get top 5 presentations
 SELECT COUNT(preferenceId) as count, presentationTheme
 FROM preference
 GROUP BY presentationTheme
 ORDER BY count DESC LIMIT 5