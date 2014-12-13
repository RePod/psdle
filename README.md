![psdle](logo/4_psdle.png?raw=true)
=====

Improving everyone's favorite online download list, one loop at a time.    
**Downloading/saving files other than the userscript is not required!**

Doubtful? [Check out the Imgur album for some screenshots!](//imgur.com/a/m5Rxw) - [PS+ Support!](//imgur.com/a/46K6L)

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

Potentially Asked Questions
=====
#####Is this safe or a ploy to phish account details?
**Yes it is safe, no it is not for phishing account details.**    
I put it on GitHub for a reason, feel free to view the ~~horribly effective~~ code yourself and decide.    
If and when I get pull requests I'll let them sizzle and look through them while allowing the "community" to as well.

If authentication details were left around openly on the download list page I would take my concerns elsewhere.

#####Does this support PS+ titles?
Yes, or tries to, listing them as normal as well as distinguishing them from other entries with a yellow background.

Report any issues [here](//github.com/RePod/psdle/issues/3).

#####How does the Download Queue work?
At the time of writing, to add items simply click them on the list to select a system (or all).

To view and remove items from the Download Queue click the "Queue" button in the top-right.

Note adding/remove items may not reflect immediately, this is a work in progress.

#####What difference does using the APIs make?
The **Game API** (deep search) accesses individual game information to enhance results (detecting PS1/2 games, demos, etc.).

The **Entitlements API** accesses the user's entitlements (purchases) information to determine PS+ titles.

All API usage is optional, they're used only to enhance the experience 

End-users are to be held responsible for problems that arise from using the APIs.    
API usage is currently early in its development so not everything may be detected properly.

#####Why are PS1 classics/etc showing as PSP and PS2 classics as PS3?
Enable deep search/use API on PSDLE startup.

#####How can I exclude results that aren't touched by the system or tag filters?
In the search box make a regular expression to match what you want to exclude then attach /d as a mod.

For instance, /Avatar/id will exclude every instance of "Avatar" instead of only showing them. (/i is case-insensitive)

If the box turns red when the search is executed, /d is working as it should.

#####Why does it take so long to parse?
PSDLE uses a crude method to detect page changes which takes a while, but is definitely faster than it was before. After all pages are parsed it then starts checking the APIs (if enabled) to get more information which also takes time from getting the result to storing the information where it needs to go.

If using the API, PSDLE waits for all requests to finish before proceeding.

This may change in the future.

#####Why is this so horrible?
Functionally, PSDLE is complete. If you have suggestions make them known!    
Feel free to fork and submit pull requests.

#####Why is this so good?
I ask myself that every time I wake up.

#####Does this work in any browser/my toaster's web browser?
Probably, as long as it allows local Javascript execution.

#####How do I contribute?
Translations, let me have them! See source for format.

License
=====
MIT, have fun.

**PSDLE is not sponsored, endorsed, or created by Sony, SNEI, SCEA, SCEE, SCEI, or affiliates.**
**Third-party content (icons, names) re-rendered by PSDLE is provided from the download list.**
