chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    // A workaround because youtube fires mutliple tabs.onUpdated messages
    if(details.frameId === 0){
        chrome.tabs.get(details.tabId, (tab) => {

            if(tab.url && tab.url.includes("youtube.com/watch")) {
                // The unique part of a video URL is after the /v=?xxxxxxxxxxxxx
                const queryParamters = tab.url.split("?")[1];
                const urlParameters = new URLSearchParams(queryParamters);
                console.log("message sent");
                    chrome.tabs.sendMessage(details.tabId, {
                        type: "NEW_YT_VIDEO",
                        videoId: urlParameters.get("v"),
                        ytTabId: details.tabId
                    });
            }
        });
    }
});