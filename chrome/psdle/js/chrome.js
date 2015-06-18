chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse) {
        if (request.alive == "y") {
            sendResponse({message:"ELDSP"});
            alert(chrome.i18n.getMessage("psdleRunning"));
        }
    }
);

var s = document.createElement('script');
s.src = chrome.extension.getURL('js/psdle.js');
s.onload = function() { this.parentNode.removeChild(this); };
(document.head||document.documentElement).appendChild(s);
