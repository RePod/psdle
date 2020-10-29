var urls = {
    store: "https://store.playstation.com/",
    library: "https://library.playstation.com/"
}

function checkForValidUrl(tabId,changeInfo,tab) {
	if (tab.url.indexOf(urls.store) == 0 ||
        tab.url.indexOf(urls.library) == 0) {
		chrome.pageAction.show(tabId);
	}

    if (tab.url.indexOf(urls.library) == 0 &&
        localStorage.getItem("redirect") == "true") {
        runPSDLE(tab)
    }

    localStorage.removeItem("redirect")
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.pageAction.onClicked.addListener(function (tab) {
	//chrome.pageAction.hide(tab.id);
    if (tab.url.indexOf(urls.store) == 0) {
        localStorage.setItem("redirect", "true")
        chrome.tabs.update(tab.id, {url: urls.library});
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