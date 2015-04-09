function checkForValidUrl(tabId, changeInfo, tab) {
	if (tab.url.indexOf('https://store.playstation.com/') == 0) {
		console.log("Maybe Chrome-senpai will notice PSDLE-kun.");
		chrome.pageAction.show(tabId);
	}
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.pageAction.onClicked.addListener(function (tab) {
	/* Do stuff */
	console.log("C-Chrome-senpai... I'm PSDLE-kun.");

	//chrome.pageAction.hide(tab.id);
	console.log("Querying injection status.");
	chrome.tabs.sendMessage(tab.id, {alive: "yes"}, function(response) {
        if (response) {
            console.log("Attempted to inject PSDLE on the current tab but it was previously injected!");
        }
        else {
            console.log("Injecting PSDLE.");
			chrome.tabs.executeScript({file: "js/chrome.js"});
        }
    });
});
