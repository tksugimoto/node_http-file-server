@echo off

rem move to batch file's directory
cd /d %~dp0

echo start file-list server
node server.js

pause
