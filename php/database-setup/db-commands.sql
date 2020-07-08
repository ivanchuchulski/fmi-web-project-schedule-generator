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

INSERT INTO presentation (theme , presentDate, presenterName, place) 
VALUES(:theme, :presentDate, :presenterName, :place);

-- preference queries
SELECT * 
FROM preference 
WHERE username=:username and presentationTheme=:presentationTheme;

INSERT INTO presentation (username, presentationTheme, preferenceType) 
VALUES(:username, :presentationTheme, :preferenceType);

UPDATE preference
SET preferenceType=:preference
WHERE username=:username and presentationTheme=:presentationTheme;

DELETE FROM preference
WHERE username=:username and presentationTheme=:presentationTheme;

-- get presentatios from preferences for a given username
SELECT presentation.theme, presentation.presentDate, presentation.presenterName, presentation.place, preference.preferenceType, preference.username
FROM preference INNER JOIN presentation ON preference.presentationTheme = presentation.theme
WHERE presentationTheme IN (SELECT preference.presentationTheme
                                FROM preference
                                WHERE username=:username);


