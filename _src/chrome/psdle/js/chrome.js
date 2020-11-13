chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse) {
        if (request.alive == "y") {
            sendResponse({message:"ELDSP"});
            alert(chrome.i18n.getMessage("psdleRunning"));
        }
    }
);

function spawn(url) {
    console.info("PSDLE Chrome | ",url);
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
    let legacy = location.href.indexOf("psapp") > 0 ? "3" : "";
    spawn("js/psdleChromium.js");
    spawn(`js/psdle${legacy}.js`);
})()