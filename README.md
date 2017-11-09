[![psdle](logo/4_psdle.png?raw=true)](//repod.github.io/psdle "To the website!")
=====

**For the new store API, Valkyrie, refer to [issue #40](https://github.com/RePod/psdle/issues/40). It is being worked on.**

Improving everyone's favorite online download list, one loop at a time.

This is the PSDLE **repository**! Most of the information you'll be looking for is on **[the website.](//repod.github.io/psdle)**    
Those with no interest of the inner workings of PSDLE **will not find anything new here**!    
However, there's a lot of stuff to read and learn about on **[the wiki!](//github.com/RePod/psdle/wiki)**

Usage
=====
**Normal users:** **[The website](//repod.github.io/psdle)** has instructions on how to get started.

**Everyone else:**

PSDLE uses Node, NPM, and Grunt to compile versions.

The latest versions should end up in **[_dist/](_dist/)**, and should be the same or newer than the files available from the website (they may even be broken!).

Notable Grunt tasks:
  - `grunt compile` compiles the base version in **_src/** including the min CSS and languages.  
  - `grunt` (default) is the same as `grunt compile`.
  - `grunt release` generates all the release versions (base, min, user, chrome) into **_dist/**.

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
