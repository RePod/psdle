- ***psdle.base.js*** is the main version of PSDLE where edits should occur.
  - After making the needed edits, run `grunt compile` (`grunt includes:build` to skip CSS/lang minify) to generate ***psdle.includes.js***.
- ***psdle.includes.js*** is the resulting complete PSDLE before uglifying.
- ***psdle.user.txt*** is the Userscript header appended to the ***includes*** version.

Versioning is done automatically to all versions both in banners and version properties (chrome/userscript, `grunt string-replace:release`) based on ***package.json***.
