@echo off
cd /d "%~dp0schoolsystem-backend"
if "%MYSQL_PASSWORD%"=="" (
  echo Set your MySQL root password first, for example:
  echo   set MYSQL_PASSWORD=YourMySQLPassword
  echo.
  echo Or edit src\main\resources\application.properties and update spring.datasource.password
  echo.
)
call mvnw.cmd spring-boot:run
