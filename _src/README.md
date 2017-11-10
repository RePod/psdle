- ***psdle.base.js*** is the main version of PSDLE where edits should occur.
  - After making the needed edits, run `grunt compile` to generate ***psdle.includes.js***.
  - Run `grunt includes:build` to skip CSS/lang minify, ensure they're already minified first!
- ***psdle.includes.js*** is the resulting complete PSDLE before uglifying.
- ***psdle.user.txt*** is the Userscript header appended to the ***includes*** version for `grunt release`.

Versioning is done automatically to all versions both in banners and version properties (chrome/userscript, `grunt string-replace:release`) based on ***package.json***.
