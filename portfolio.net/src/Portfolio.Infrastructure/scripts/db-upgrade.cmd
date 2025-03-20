@echo off
echo Checking for EF Core migrations...

:: Check if migrations exist
dotnet ef migrations script --idempotent --output nul
IF %ERRORLEVEL% NEQ 0 (
    echo Generating new migration...
    FOR /F "tokens=* USEBACKQ" %%F IN (`powershell -Command "[DateTime]::Now.ToString('yyyyMMddHHmmss')"`) DO SET TIMESTAMP=%%F
    dotnet ef migrations add AutoMigration_%TIMESTAMP%
)

:: Apply migrations
echo Applying database migrations...
dotnet ef database update
