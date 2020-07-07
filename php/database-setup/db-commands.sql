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
