@echo off

::Move into chrome directory, zip it, then return here.
cd chrome && call "7-zip.bat" && cd ..

::Merge psdle.js, psdle.user.js, and psdle.min.js to gh-pages.
call "deploy-sync.bat"

pause