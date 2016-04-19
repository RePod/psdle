"C:\Program Files\7-Zip\7z.exe" a -uq0 -mx9 psdle.zip -mtc- ./psdle/* ../psdle.min.js -r -x!*.db -x!*.ini
"C:\Program Files\7-Zip\7z.exe" rn psdle.zip psdle.min.js js\psdle.js