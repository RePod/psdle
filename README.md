:warning: Attention third party developers
=====
As of PSDLE version 3.3.13 (May 31st 2019) the export's configuration has been updated.    
Prior versions were arrays with children containing the target property and column title as strings:
 - `['prettyDate','Date']`.    
 
The children are now objects with `property` and `title`:
 - `{property:"prettyDate",title:"Date"}`

All JSON exports will also now include a `version` property on the top level of PSDLE's version.    
Regular/CSV exports will now include the same version number in the last row's last column (defined by separator).

These are intended to allow version-aware import handling in the event of futures changes, although it's highly recommended you and your users are always using the latest. For pre-3.3.13 handling, detect the absence of a version string or regular array children.

[![psdle](logo/4_psdle.png?raw=true)](//repod.github.io/psdle "To the website!")
=====

Improving everyone's favorite online download list, one loop at a time.

This is the PSDLE **repository**! Most of the information you'll be looking for is on **[the website.](//repod.github.io/psdle)**    
Those with no interest of the inner workings of PSDLE **will not find anything new here**!    
However, there's a lot of stuff to read and learn about on **[the wiki!](//github.com/RePod/psdle/wiki)**

Usage
=====
**Normal users:** **[The website](//repod.github.io/psdle)** has instructions on how to get started.

**Everyone else:** PSDLE uses Node, NPM, and Grunt to compile versions.

The latest versions should end up in **the root** (except chrome zip), and should be the same or newer than the files available from the website (they may even be broken!).

Notable Grunt tasks:
  - `grunt compile` compiles the base version in **_src/** including the min CSS and languages.  
  - `grunt` (default) is the same as `grunt compile`.
  - `grunt release` generates all the release versions (base, min, user, chrome, firefox) into **the root** (except chrome).
    - `grunt deploy` as a follow up to clean firefox add-on files, open chrome webstore, then sync to *gh-pages*.
  
Releases end up in **the root** to ease in copying them to the *[gh-pages](//github.com/RePod/psdle/tree/gh-pages)* branch.

What Needs To Be Done
=====
* **[Translations!](https://github.com/RePod/psdle/wiki/Submit-a-Bug-or-Translation)**
* General performance and stability improvements.
* ~~Improve various API accuracy and functionality, including Download Queue.~~ Thanks Valkyrie.

License
=====
MIT, have fun.

**PSDLE is not sponsored, endorsed, or created by Sony, SIE, SNEI, SCEA, SCEE, SCEI, PlayStation, or affiliates.**
**Third-party content (icons, names) re-rendered by PSDLE is provided from the Entitlements API.**
