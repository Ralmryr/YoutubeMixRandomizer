(() => {

const INVALID_TAB_ID = -999;

const alarmName = "SongEnded"

let tabId = INVALID_TAB_ID;

chrome.alarms.onAlarm.addListener((alarm) => {
    if(alarm.name === alarmName && tabId != INVALID_TAB_ID) {
        console.log("Next Song !");
        chrome.tabs.sendMessage(tabId, {
            type: "NEXT"
        });
    }
});

chrome.runtime.onMessage.addListener((obj, _sender, _response) => {
    const type = obj.type;

    if(type === "START_ALARM") {
        // Cache the id the first time it is loaded
        if(tabId == INVALID_TAB_ID) {
            const query = {
                active: true,
                lastFocusedWindow: true
            };
    
            chrome.tabs.query(query, (tabs) => {
                const activeTab = tabs[0];
                tabId = activeTab.id;
            });
        }

        // Song duration in milliseconds
        const durationMs = obj.duration * 1000;
        const alarmInfo = {
            when: Date.now() + durationMs
        };

        console.log(durationMs);

        chrome.alarms.create(alarmName, alarmInfo);
    }
})


})();