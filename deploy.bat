::This is a near full-circle deployment script for PSDLE.
::It does two major things:
:: - ./chrome/7-zip.bat - Zip up the PSDLE chrome extension properly for the webstore (and then opens the webstore for uploading).
:: - ./deploy-sync.bat  - Copy psdle.js, psdle.user.js, and psdle.min.js to the gh-pages branch for everything else.
::Generally, only actual developers will find this useful. The 7-zip.bat is universally functional though.
::jsmin is expected to be in PATH
::Read deploy-sync.bat's comments for more info

@echo off

::Create min version
jsmin <psdle.js >psdle.min.js "PSDLE, (c) RePod, https://github.com/RePod/psdle/blob/master/LICENSE"
::Create userscript version
copy psdle.user.txt+psdle.js /A /D psdle.user.js /B /Y

::Move into chrome directory, zip it, then return here.
cd chrome && call "7-zip.bat" && cd ..
::Open the chrome extension editing page on webstore.
explorer "https://chrome.google.com/webstore/developer/edit/jdjhhapoddhnimgdemnpbfagndcnmhii"

::Checkout psdle.js, psdle.user.js, and psdle.min.js to gh-pages.
call "deploy-sync.bat"

pause