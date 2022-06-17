var urls = {
    store: "https://store.playstation.com/",
    library: "https://library.playstation.com/"
}

function checkForValidUrl(tabId,changeInfo,tab) {
    if (tab.url.indexOf(urls.store) == 0 ||
        tab.url.indexOf(urls.library) == 0) {
		chrome.pageAction.show(tabId);
        
        chrome.tabs.executeScript({
            code: `document.querySelector("iframe[src*=viewTransactionHistory]").parentElement.style['max-width'] = 'unset'`
        })
	}

    localStorage.removeItem("redirect")
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

function redirectCallback(cbTab) {
    var listener = function(tabId, changeInfo, tab) {
        if (tabId == cbTab.id && changeInfo.status == "complete") {
            chrome.tabs.onUpdated.removeListener(listener);
            aliveOrChrome(tab);
        }
    }
    chrome.tabs.onUpdated.addListener(listener);
}

chrome.pageAction.onClicked.addListener(function (tab) {
	//chrome.pageAction.hide(tab.id);

    aliveOrChrome(tab);
});

function aliveOrChrome(tab) {
    chrome.tabs.sendMessage(tab.id, {alive: "y"}, function(response) {
        if (response) {
            console.log(response);
        } else {
            chrome.tabs.executeScript({file: "js/chrome.js"}, function (r) {
               var isValkyrie = r[0]

               if (tab.url.indexOf(urls.store) == 0 && !isValkyrie) {
                    localStorage.setItem("redirect", "true")
                    chrome.tabs.update(tab.id, {url: urls.library}, redirectCallback);
                }
            })
        }
    })
}