-- db dml commands
-- these are prepared statements

-- insert
INSERT INTO user (username, password, email) VALUES(:username, :password, :email);

-- select by facultynum
SELECT * FROM user WHERE username=:username;