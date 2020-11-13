var urls = {
    store: "https://store.playstation.com/",
    library: "https://library.playstation.com/"
}

function checkForValidUrl(tabId,changeInfo,tab) {
    if (tab.url.indexOf(urls.store) == 0 ||
        tab.url.indexOf(urls.library) == 0) {
		chrome.pageAction.show(tabId);
	}

    localStorage.removeItem("redirect")
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

function redirectCallback(cbTab) {
    var listener = function(tabId, changeInfo, tab) {
        if (tabId == cbTab.id && changeInfo.status == "complete") {
            chrome.tabs.onUpdated.removeListener(listener);
            runPSDLE(tab)
        }
    }
    chrome.tabs.onUpdated.addListener(listener);
}

chrome.pageAction.onClicked.addListener(function (tab) {
	//chrome.pageAction.hide(tab.id);
    if (tab.url.indexOf(urls.store) == 0 && tab.url.indexOf("psapp") < 0) {
        localStorage.setItem("redirect", "true")
        chrome.tabs.update(tab.id, {url: urls.library}, redirectCallback);
    } else {
        runPSDLE(tab)
    }
});

function runPSDLE(tab) {
    chrome.tabs.sendMessage(tab.id, {alive: "y"}, function(response) {
        if (response) { console.log(response); }
        else { chrome.tabs.executeScript({file: "js/chrome.js"}); }
    });
}