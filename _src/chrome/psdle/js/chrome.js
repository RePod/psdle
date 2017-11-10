function isFirefox() {
    return typeof InstallTrigger !== 'undefined';
}

chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse) {
        if (request.alive == "y") {
            sendResponse({message:"ELDSP"});
            alert(chrome.i18n.getMessage("psdleRunning"));
        }
    }
);

function inject(url,remote) {
    console.info("PSDLE Chrome | ",isFirefox(),remote,url);
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.onload = function() { 
        this.parentNode.removeChild(this);
    };
    s.onerror = function(e) {
        console.info("PSDLE Chrome | Failed to fetch remote PSDLE, using local.");
        init(true);
    };
    s.src = (remote) ? url : chrome.extension.getURL(url);
    (document.head||document.documentElement).appendChild(s);
}

inject("js/psdleChromium.js");
function init(fallback) {
    if (isFirefox() && fallback !== true) {
        inject("//repod.github.io/psdle/psdle.min.js",true);
    } else {
        inject("js/psdle.js");
    }
}
init()