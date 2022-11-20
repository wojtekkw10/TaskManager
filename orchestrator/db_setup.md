CREATE DATABASE task_db;
CREATE USER 'task_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON task_db.* To 'task_user'@'localhost';
