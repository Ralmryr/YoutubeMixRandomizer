(() => {
    let descriptionText, currentVideo;
    let comments = [];

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const {type, value, videoId} = obj;

        if(type === "NEW") {
            currentVideo = videoId;
            descriptionText = document.querySelectorAll('[class="content style-scope ytd-video-secondary-info-renderer"]')[1].innerText;
            const commentSection = document.querySelectorAll('[id="content-text"]');
            console.log("First Desc" + descriptionText);
        }
    });
})();