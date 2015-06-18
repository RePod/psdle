function checkForValidUrl(tabId,changeInfo,tab) {
	if (tab.url.indexOf('https://store.playstation.com/') == 0) {
		chrome.pageAction.show(tabId);
	}
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.pageAction.onClicked.addListener(function (tab) {
	//chrome.pageAction.hide(tab.id);
	chrome.tabs.sendMessage(tab.id, {alive: "y"}, function(response) {
        if (response) { console.log(response); }
        else { chrome.tabs.executeScript({file: "js/chrome.js"}); }
    });
});
