import { getActiveTabURL } from "../scripts/utils.js";

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

document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("button-shuffle").addEventListener("click", onShuffle);
    document.getElementById("button-previous").addEventListener("click", onPrevious);
    document.getElementById("button-next").addEventListener("click", onNext);
});