chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse) {
        if (request.alive == "y") {
            sendResponse({message:"ELDSP"});
            alert(chrome.i18n.getMessage("psdleRunning"));
        }
    }
);

["js/psdleChromium.js", "js/psdle.js"].forEach(function(item) {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL(item);
    s.onload = function() { this.parentNode.removeChild(this); };
    (document.head||document.documentElement).appendChild(s);    
});