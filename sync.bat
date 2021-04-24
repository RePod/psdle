git checkout master -- _src/base/*/psdle.*.*.js

move _src\base\gotham\psdle.*.*.js
move _src\base\valkyrie\psdle.*.*.js
move psdle.gotham.includes.js psdle.gotham.js
move psdle.valkyrie.includes.js psdle.valkyrie.js

git restore --staged _src/
git add psdle*.js

git commit -a -m "Sync with master."
git push