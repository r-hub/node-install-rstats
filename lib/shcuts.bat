@echo off
setlocal enableDelayedExpansion

REM ----------------------------------------------------------------
REM Create the directory that we use for the links
REM ----------------------------------------------------------------

SET linkdir=%ProgramFiles%
IF "%linkdir%"=="" (
    SET linkdir=C:\Program Files
)

SET linkdir=%linkdir%\R\bin

IF EXIST "%linkdir%\" (
    REM Exists, good
) ELSE (
    echo Creating symlink directory: '%linkdir%'.
    MKDIR "%linkdir%"
    IF %errorlevel% NEQ 0 EXIT /b %errorlevel%
)

REM ----------------------------------------------------------------
REM Add to path. This is a bit tricky to do in a way that
REM we make sure that it is on the system path, and it is also
REM set in the current process.
REM ----------------------------------------------------------------

REM Get the system path
REM Explanation: https://stackoverflow.com/a/16282366/604364

SET keyname=HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Environment
FOR /F "usebackq skip=2 tokens=1,2*" %%A IN (
    `REG QUERY "%keyname%" /v "Path" 2^>nul`) DO (
        set "pathname=%%A"
        set "pathtype=%%B"
        set "pathvalue=%%C"
)
IF %errorlevel% NEQ 0 EXIT /b %errorlevel%

REM If not in the system path, then add it there
REM This is difficult: https://stackoverflow.com/a/8046515/604364
REM So we'll only do a simplified check instead

for /F "delims=" %%L in (
    'echo ";%pathvalue%;" ^| find /C /I ";%linkdir%;"') do (
        set "cnt=%%L"
)
IF %errorlevel% NEQ 0 EXIT /b %errorlevel%

if "%cnt%"=="0" (
    echo Adding '%linkdir%' to the system path.
    SET newpath=%linkdir%;%pathvalue%
    reg add "%keyname%" /v "Path" /t "%pathtype%" /d "%newpath%" /f >nul 2>nul
    IF %errorlevel% NEQ 0 EXIT /b %errorlevel%
)

REM SETX will signal an environment refresh, so no reboot is needed
REM We cannot SETX the path, because that would expand the wildcards

SETX dummy dummy >nul
IF %errorlevel% NEQ 0 EXIT /b %errorlevel%

REM ----------------------------------------------------------------
REM Get the installed R versions and locations from the registry
REM ----------------------------------------------------------------

SET rkey=HKEY_LOCAL_MACHINE\SOFTWARE\R-core\R
SET rversions=
FOR /F "tokens=1 delims=" %%a in (
    'REG QUERY "%rkey%" /f "*" /k ^|
        findstr /v /c:"End of search:" ^| sort ^| findstr /r "[0123456789]$" ') DO (
            for /F "tokens=5 delims=\" %%b in ("%%a") do (
            CALL SET "rversions=%%rversions%% %%b"
        )
    )
)

REM ----------------------------------------------------------------
REM Create a shortcut for every version
REM ----------------------------------------------------------------

for %%a in (%rversions%) do (
   for /F "tokens=1,2 delims=." %%b in ("%%a") do call :shcut %%a %%b.%%c
)

REM ----------------------------------------------------------------
REM Remove shortcuts that are not needed any more
REM ----------------------------------------------------------------

REM TODO

goto End

REM ----------------------------------------------------------------
REM Functions
REM ----------------------------------------------------------------

REM Create a shortcut, %1 is the full version number, %2 is the major
REM version number

:shcut
FOR /F "usebackq skip=2 tokens=1,2*" %%A IN (
    `REG QUERY "%rkey%\%1" /v InstallPath 2^>nul`) DO (
        set "installpath=%%C"
)

echo Adding shortcut: %linkdir%\R-%2.bat -^> %installpath%\bin\R
echo @"%installpath%\bin\R" %%* > "%linkdir%\R-%2.bat"
goto :eof

:End
endlocal