psdle
=====

Improving everyone's favorite online download list, one loop at a time.

Doubtful? [Check out the Imgur album for some screenshots!](http://imgur.com/a/m5Rxw)

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
* **Translations!** Language code ("en-us") and JSON format required. See source or contact me.

What Cannot Be Done
=====
* Adding the "Download to X" button, can't keep events.

Potentially Asked Questions
=====
###Why does it take so long to parse?
PSDLE works by parsing each page of the download list one at a time with a delay inbetween. Currently a timeout of 3 seconds seems to hit the sweet spot of changing the page and detecting the content (on a reasonable connection and assuming the server isn't already dying).

If using the API, PSDLE waits for all requests to finish before proceeding.

This may change in the future.

###What difference does using the API make?
Using the API forces PSDLE to look "behind the scenes" to find more accurate information than what the download list provides.
This in turn allows it to offer different options (such as PS1/2 games) to filter by.

Nobody except the end-user will not be held responsible for problems that arise from using the API.

**API usage is currently early in its development so not everything may be detected properly.**

###Why are PS1 classics/etc showing as PSP and PS2 classics as PS3?
Enable deep search/use API on PSDLE startup.

###How can I exclude results that aren't touched by the system or tag filters?
In the search box make a regular expression to match what you want to exclude then attach /d as a mod.

For instance, /Avatar/id will exclude every instance of "Avatar" instead of only showing them. (/i is case in-sensitive)

If the box turns red when the search is executed, /d is working as it should.

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