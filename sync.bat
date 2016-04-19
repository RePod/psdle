::Switch to gh-pages, pull from master, commit, then switch back to master.
git checkout gh-pages && git checkout master psdle*.js && git commit -a -m "Sync with master" && git checkout master