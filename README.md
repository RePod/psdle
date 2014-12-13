![psdle](logo/4_psdle.png?raw=true)
=====

Improving everyone's favorite online download list, one loop at a time.    
**Downloading/saving files other than the userscript is not required!**

Doubtful? [Check out the Imgur album for some screenshots!](//imgur.com/a/m5Rxw) - [PS+ Support!](//imgur.com/a/46K6L)

Features
=====
* One convenient list of all your content!
* View, sort, and filter your download list as you desire!
* **PS+ support:** easily see what is and isn't tied to your subscription.
* **Download queue support:** easily send items where you want.
* **Export your list** in a database/spreadsheet format (CSV) to use as you like!
* Lightweight, portable, consistent: computer or mobile, always the same experience.
* **Mobile!** Even on-the-go, don't settle for a featureless download list! ([YMMV](# "Your mileage may vary."))
* Open source! (MIT) (Totally a feature.)

Usage
=====
**Grease/Tamper/etcmonkey users:** [Get the user script](//repod.github.io/psdle/psdle.user.js) then go to the download list.    

**Bookmarklet:** [Get it here!](//repod.github.io/psdle/bookmarklet.html) (Works on iOS, possibly Android.)

**Everyone else:**

1. Navigate to the desired account's download page from the online store
2. Ensure the displayed page is the first (top has latest purchase)
3. Open the Web Console (Firefox: Ctrl+Shift+K) (Chrome: Ctrl+Shift+J)
4. Input **$.getScript("https://repod.github.io/psdle/psdle.js");** 
5. Execute (Enter) and let the magic happen

**Bleeding edge users:**

The repository files will always be the latest possible versions, excluding forks/branches/etc. Feel free to give them a try.
If you get an error involving strict MIME checking, run the URL through something like [RawGit](//rawgit.com/).

What Needs To Be Done
=====
* Improve appearance.
* **Translations!** Language code ("en-us") and JSON format required. See source or contact me.
* Make it faster! How? How indeed. (Always in progress)
* Iron out problems with APIs. (Various degress of progress)
* Improve Download Queue.
* Custom-make the gh-pages branch page to remove useless links (downloading the zip).

Issues: [Submit](//github.com/RePod/psdle/issues) - [PS+](//github.com/RePod/psdle/issues/3).

Potentially Asked Questions
=====
#####Is this safe or a ploy to phish account details?
**Yes it is safe, no it is not for phishing account details.**    
I put it on GitHub for a reason, feel free to view the ~~horribly effective~~ code yourself and decide.    
If/when I get pull requests I'll let them sit and look through them while allowing the ["community"](# "What community?") to as well.

If authentication details were left around openly on the download list page I would take my concerns elsewhere.

License
=====
MIT, have fun.

**PSDLE is not sponsored, endorsed, or created by Sony, SNEI, SCEA, SCEE, SCEI, or affiliates.**
**Third-party content (icons, names) re-rendered by PSDLE is provided from the download list.**
