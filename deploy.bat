::This is a near full-circle deployment script for PSDLE.
::It does two major things:
:: - ./chrome/7-zip.bat - Zip up the PSDLE chrome extension properly for the webstore (and then opens the webstore for uploading).
:: - ./deploy-sync.bat  - Copy psdle.js, psdle.user.js, and psdle.min.js to the gh-pages branch for everything else.
::Generally, only actual developers will find this useful. The 7-zip.bat is universally functional though.
::Currently the min file is generated manually with Notepad++'s JSTool plugin which has JSMin built in. This may change in the future.
::deploy-sync expects git available in PATH and ready to go.

@echo off

::Move into chrome directory, zip it, then return here.
cd chrome && call "7-zip.bat" && cd ..
::Open the chrome extension editing page on webstore.
explorer "https://chrome.google.com/webstore/developer/edit/jdjhhapoddhnimgdemnpbfagndcnmhii"

::Checkout psdle.js, psdle.user.js, and psdle.min.js to gh-pages.
call "deploy-sync.bat"

pause