psdle
=====

Improving everyone's favorite online download list, one loop at a time.

Doubtful? Have some in-action screenshots:    
[PS4 games](http://i.imgur.com/hFIw450.png) Example: All Plus offerings.    
[PS3 games, no unlocks or passes](http://i.imgur.com/1Iz43kd.png) Example: DS3 has an online pass, DDU has an unlock.    
[PS3+V games](http://i.imgur.com/WekNUVc.png) Example: Plus offerings for PS3+V.    
[Sorting](http://i.imgur.com/ta3YOO5.png) Example: Ordering alphabetically instead of date.

Usage
=====
**Users of Greasemonkey:** [Get the user script](https://repod.github.io/psdle/psdle.user.js) then go to the download list.    
Compatibility with Greasemonkey variants is not guaranteed, yet.

**Everyone else:**

1. Navigate to the desired account's download page from the online store
2. Ensure the displayed page is the first (top has latest purchase)
3. Open the Web Console (Firefox: Ctrl+Shift+K) (Chrome: Ctrl+Shift+J)
4. Input **$.getScript("https://repod.github.io/psdle/psdle.js");** 
5. Execute (Enter) and let the magic happen

**Bleeding edge users:**

The repository files will always be the latest possible versions, excluding forks/branches/etc. Feel free to give them a try.
If you get an error involving strict MIME checking, run the URL through something like [RawGit](http://rawgit.com/).

What Needs To Be Done
=====
* Improve appearance
* Possibly make the parsing process more detailed?
* In-depth information gathering (i.e. if system filtering is vague such as PS1 games marked for PSP)
* Exporting options: database delimiters?
* **Translations!** Language code ("en-us") and JSON format required. See source or contact me.

What Cannot Be Done
=====
* Adding the "Download to X" button, can't keep events.

Potentially Asked Questions
=====
###Why does it take so long to parse?
PSDLE works by parsing each page of the download list one at a time with a delay inbetween. Currently a timeout of 3 seconds seems to hit the sweet spot of changing the page and detecting the content (on a reasonable connection and assuming the server isn't already dying).
This may change in the future.

###Why are thumbnails/icons missing?
Seems to be a cache issue, a noticable solution would be going to problematic pages then running PSDLE again.    
Trust me, I noticed.

###Why are PS1 classics/etc showing as PSP and PS2 classics as PS3?
PSDLE currently operates with data it obtains solely from the download list. It is safer and cleaner to resolve like this instead of guessing. There are few methods being looked into to overcome these scenarios.

###Why is this so horrible?
At the time of writing a concept version is available simply showing off what can be done.    
Feel free to fork and submit pull requests.

###Why is this so good?
I ask myself that every time I wake up.

###Does this work in any browser/my toaster's web browser?
Probably, as long as it allows local Javascript execution.

###Is this safe or a ploy to phish account details?
**Yes it is safe, no it is not for phishing account details.**    
I put it on GitHub for a reason, feel free to view the ~~horribly effective~~ code yourself and decide.    
If and when I get pull requests I'll let them sizzle and look through them while allowing the "community" to as well.

If authentication details were left around openly on the download list page I would take my concerns elsewhere.

License
=====
MIT, have fun.

**PSDLE is not sponsored, endorsed, or created by Sony, SNEI, SCEA, SCEE, SCEI, or affiliates.**
**Third-party content (icons, names) re-rendered by PSDLE is provided from the download list.**