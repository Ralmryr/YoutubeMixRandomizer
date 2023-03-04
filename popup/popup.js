import { getActiveTabURL } from "../scripts/utils.js";

(() => {

    const onShuffle = async () => {
        const activeTab = await getActiveTabURL();

        chrome.tabs.sendMessage(activeTab.id, {
            type: "SHUFFLE"
        });
    }

    const onPrevious = async () => {
        const activeTab = await getActiveTabURL();

        chrome.tabs.sendMessage(activeTab.id, {
            type: "PREVIOUS"
        });
    }

    const onNext = async () => {
        const activeTab = await getActiveTabURL();

        chrome.tabs.sendMessage(activeTab.id, {
            type: "NEXT"
        });
    }

    const popupReady = async () => {
        const activeTab = await getActiveTabURL();

        chrome.tabs.sendMessage(activeTab.id, {
            type: "POPUP_LOADED"
        });
    }

    // Retrieve the current song playing when the user opens the popup
    const getSongTitle = async () => {
        const activeTab = await getActiveTabURL();

        chrome.tabs.sendMessage(activeTab.id, {
            type: "REQUEST_TITLE",
        }, (response) => {
            if(Object.keys(response).length != 0 && response.title !== "") {
                document.getElementById("song-name").innerHTML = response.title;
            }
        });
    }

    // Updates the text while the popup is opened
    chrome.runtime.onMessage.addListener((obj, sender, repsonse) => {
        const type = obj.type;

        if(type === "NEW_SONG_TITLE") {
            document.getElementById("song-name").innerHTML = obj.title;
        }
    });

    document.addEventListener("DOMContentLoaded", async () => {

        document.getElementById("button-shuffle").addEventListener("click", onShuffle);
        document.getElementById("button-previous").addEventListener("click", onPrevious);
        document.getElementById("button-next").addEventListener("click", onNext);

        popupReady();

        getSongTitle();
    });

})();