console.log("*radio static* I'm in",window,document)
var isValkyrie = location.hostname == "transact.playstation.com"
var variant = isValkyrie ? "valkyrie" : "gotham"

chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse) {
        if (request.alive == "y") {
            sendResponse({message:"ELDSP"});
            alert(chrome.i18n.getMessage("psdleRunning"));
        }
    }
);

function spawn(url) {
    console.info("PSDLE Chrome | Spawn",url);
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.onload = function() {
        this.parentNode.removeChild(this);
    };
    s.onerror = function(e) {
        console.warn("PSDLE Chrome | Something broke. ",url);
    };
    s.src = chrome.extension.getURL(url);
    (document.head||document.documentElement).appendChild(s);
}

(()=>{
    console.info("PSDLE Chrome | isValkyrie",isValkyrie);
    spawn("js/psdleChromium.js");
    spawn(`js/psdle.${variant}.js`);
})()

// Pass it up.
isValkyrie;