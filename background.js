chrome.action.onClicked.addListener((tab) => {
    if(tab.url && tab.url.includes("youtube.com/watch")) {
        // The unique part of a video URL is after the /v=?xxxxxxxxxxxxx
        const queryParamters = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParamters);
        console.log("message sent");
            chrome.tabs.sendMessage(tab.id, {
                type: "NEW",
                videoId: urlParameters.get("v")
            });
    }
});