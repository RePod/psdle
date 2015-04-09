chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.alive == "yes") {
            sendResponse({message: "Baby baby baby baby baby baby baby baby baby baby baby baby yeaaaaaaaaaaaaaaah."});
			console.log("PSDLE's chrome.js received an alive request.\nThe fact it knows this means it's already been injected!\nPlease reload the page if you would like to inject it again.");
			alert(chrome.i18n.getMessage("psdleRunning"));
		}
 });
 
console.log("Surgical procedure. Scalpel.");
var s = document.createElement('script');
s.src = chrome.extension.getURL('js/psdle.js');
console.log("PSDLE-kun has been injected into Chrome-senpai.");
s.onload = function() { this.parentNode.removeChild(this); };
(document.head||document.documentElement).appendChild(s);
console.log("chrome.js dies a heroic death. The End.");
