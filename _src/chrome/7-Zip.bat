::Old method, pull in min then rename it post-zip.
::"C:\Program Files\7-Zip\7z.exe" a -uq0 -mx9 %~dp0/psdle.zip -mtc- %~dp0/psdle/* %~dp0../../psdle.min.js -r -x!*.db -x!*.ini
::"C:\Program Files\7-Zip\7z.exe" rn %~dp0/psdle.zip psdle.min.js js\psdle.js

::Assuming symlink: mklink /H "_src/chrome/psdle/js/psdle.js" "psdle.min.js"
"C:\Program Files\7-Zip\7z.exe" a -uq0 -mx9 %~dp0/psdle.zip -mtc- %~dp0/psdle/* -r -x!*.db -x!*.ini