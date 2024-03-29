(() => {
    let tracklist = [];
    let trackIndex = 0;
    let currentTrack, videoPlayer;
    let ytTabId;
    let title;
    let popupLoaded = false;

    console.log("The console is working");

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const {type, videoId, tabId} = obj;

        // The popup load only once
        if(type === "POPUP_LOADED" && !popupLoaded) {
            popupLoaded = true;
            tracklist = [];
            trackIndex = 0;
            videoPlayer = document.getElementsByClassName('video-stream')[0];
            console.log("New page loaded");
            ytTabId = tabId;
            title = document.querySelector('h1.ytd-watch-metadata').innerText;
        }

        if(type === "REQUEST_TITLE") {
            // If the tracklist is empty, there is no title to display
            if(tracklist.length == 0) {
                response({title: ""});
            }
            else {
                response({ title: currentTrack.songName });
            }
        }

        if(type === "SHUFFLE") {

            console.log("SHUFFLE");
            // If the tracklist is empty, it means it's the first time that the user clicked the shuffle button
            if(tracklist.length == 0) {
                // Get all the text from description of the video
                const descriptionText = document.querySelectorAll('[class="content style-scope ytd-video-secondary-info-renderer"]')[0].innerText;
                console.log(descriptionText);
                const videoDuration = Math.round(videoPlayer.duration);
                tracklist = formatTimestamps(descriptionText, videoDuration);
            }
            tracklist = shuffle(tracklist);
            trackIndex = 0;
            currentTrack = tracklist[trackIndex];
            playSong();
        }

        if(type === "NEXT") {
            trackIndex += 1;
            currentTrack = tracklist[trackIndex];
            playSong();
        }

        if(type === "PREVIOUS") {
            trackIndex -= 1;
            currentTrack = tracklist[trackIndex];
            playSong();
        }
    });


    // Changes the time cursor on the video,and updates the title of the popup
    const playSong = () => {
        videoPlayer.currentTime = tracklist[trackIndex].timestampSeconds;
        chrome.runtime.sendMessage({
            type: "NEW_SONG_TITLE",
            title: currentTrack.songName
        });
    }

    /*
        Helper function to get all the timestamps in a workable format
        arg : string with the timestamps in it
        return : an object in the form of {
            timestampReadable: 'xx:xx:xx'
            timestampSeconds: timestamps in seconds
            duration: in seconds
            songName: 'artist - song name'
        }
    */
    const formatTimestamps = (contents, videoDuration) => {
        const chapterRegex = /[\d]?\d:\d\d.+/gm;
        const timestampRegex = /(?<=:\d\d)\s/gm;

        // Gets each line where there is a timestamp
        const chapters = contents.match(chapterRegex);

        // Separate the timestamp from the song name, and converts it in seconds as well
        const tracklist = chapters.map((chapter) => {
            const chapterSplit = chapter.split(timestampRegex);

            // Trims all the leftovers before the song name
            let songName = chapterSplit[1];
            while(!isLetter(songName[0])) {
                songName = songName.slice(1);
            }

            return {
                timestampReadable: chapterSplit[0],
                timestampSeconds: timestampToSeconds(chapterSplit[0]),
                duration: 0,
                songName: songName
            }
        });

        // Sorts the list just in case the timestamps were not in order
        tracklist.sort((a, b) => a.duration - b.duration);

        // I have to use a C style for loop because of the last element which doen't have a follower
        const lastIndex = tracklist.length-1
        for(let i=0; i<lastIndex; i+=1){
            tracklist[i].duration = tracklist[i+1].timestampSeconds - tracklist[i].timestampSeconds;
        }
        tracklist[lastIndex].duration = videoDuration - tracklist[lastIndex].timestampSeconds;

        return tracklist;
    }


    /*
        Helper function to convert a youtube timestamp into a number of seconds
        arg: 'xx:xx:xx' or 'xx:xx'
        return: (int) number of seconds
    */
    const timestampToSeconds = (timestamp) => {
        const timeArray = timestamp.split(':');
        let nbSeconds = 0;
        for(let i=0; i<timeArray.length; i+=1) {
            nbSeconds += Math.pow(60, i) * parseInt(timeArray[timeArray.length - 1 - i]);
        }
        return nbSeconds;
    }


    // Quick function to shuffle in place
    const shuffle = (array) => {
        let currentIndex = array.length,  randomIndex;
    
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
    
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
    
        return array;
    }

    const isLetter = (str) => {
        return str.length === 1 && str.match(/[a-z]/i);
    }

})();