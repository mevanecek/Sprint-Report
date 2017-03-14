@echo off
REM start Chrome with Web security off.
REM This is for testing cross-domain Web apps, specifically localhost—>Agile Central
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --user-data-dir=C:/Chrome --disable-web-security