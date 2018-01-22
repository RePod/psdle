Language files go into the ***all/*** directory.

 - Use existing languages as a template
 - Place new language in folder or update existing in place
   - File name must be the language code (English = `en.json`)
 - Manually run **`grunt minlang`** to compile them into ***lang.min.json***
 - ***lang.min.json*** is ready to be used in other Grunt tasks
 
Do not manually update ***lang.min.json***.

If submitting a language via PR ignore the Grunt tasks, just send the PR with the langauge file in the right place.
