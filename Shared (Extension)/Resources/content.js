const styles = `
    #playButton {
      background-image: url('https://i.postimg.cc/4NtfMRyK/Frame.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      position: absolute;
      z-index: 9999;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
      user-select: none;
      outline: none;
    }
  
    #settingsButton {
        position: absolute;
        z-index: 9999;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        text-align: center;
        line-height: 20px;
        cursor: pointer;
        user-select: none;
    }
  
    #playButton {
      background-color: #ffffff; / You can customize the play button's appearance /
      color: #fff; / You can customize the play button's appearance /
      font-size: 20px;
    }
  
    #settingsButton {
    
      
      font-size: 20px;
    }
    #popup {
        position: absolute;
        z-index: 9999;
        width: 300px;
        text-align: center;
        cursor: pointer;
        user-select: none;
        background-color: #fff;
        border-radius: 5%;
        padding: 10px;
      }
      
      *,
*:before,
*:after {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, ".SFNSText-Regular", "Helvetica Neue", "Roboto", "Segoe UI", sans-serif;
}

.toggle {
  cursor: pointer;
  display: inline-block;
  margin-bottom:'10px';

}

.toggle-switch {
  display: inline-block;
  background: #ccc;
  border-radius: 16px;
  width: 58px;
  height: 32px;
  position: relative;
  vertical-align: middle;
  transition: background 0.25s;
  margin-bottom:'10px';
}
.toggle-switch:before, .toggle-switch:after {
  content: "";
}
.toggle-switch:before {
  display: block;
  background: linear-gradient(to bottom, #fff 0%, #eee 100%);
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
  width: 24px;
  height: 24px;
  position: absolute;
  top: 4px;
  left: 4px;
  transition: left 0.25s;
  margin-bottom:'10px';
}
.toggle:hover .toggle-switch:before {
  background: linear-gradient(to bottom, #fff 0%, #fff 100%);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
  
}

  .toggle-checkbox + .toggle-switch {
    background: #448aff;
  }
  
.toggle-checkbox:checked + .toggle-switch {
  background: #ff5252;
}
.toggle-checkbox:checked + .toggle-switch:before {
  left: 30px;
}

.toggle-checkbox {
  position: absolute;
  visibility: hidden;
}

.toggle-label {
  margin-left: 5px;
  position: relative;
  top: 2px;
}

.dropbtn {
    padding: 16px;
    font-size: 16px;
    border: none;
    cursor: pointer;
  }
  
  .dropdown {
    position: relative;
    display: inline-block;
  }
  
  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
  }
  
  .dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }
  
  .dropdown-content a:hover {background-color: #f1f1f1}
  
  .dropdown:hover .dropdown-content {
    display: block;
  }


  / popup.css (or your preferred CSS file) /

  .progress-bar {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    border: 6px solid #f3f3f3;
    border-top: 6px solid #3498db;
    border-radius: 50%;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }

  `;


const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Global Variables
const MAX_WORD_COUNT = 20;

let isPlaying = false;
let browserText = "";
let savedSelection;
let prevText = "";
let selectedText;
let userText;
let prevSelection = null;

let playButton;
let settingsButton;
let popUpMenu;
let backdrop;
let progressBar;
let popup;

let selectedGender = "male";
let selectedSpeaker = "2";

let isPlayButtonVisible = false;
let isSettingsButtonVisible = false;
let isPopUpMenuVisible = false;
let isPlayedOnce = false;
let isPopupVisible = false;
let genderChecked = false;
let changeFound = false;

let responseAudios = {};
let playing = false;
let finishedPlaying = false;
let playerIndex = 0;

//const abortController = new AbortController();
//const signal = abortController.signal;
//const responseTimer = setTimeout(() => {
//    abortController.abort();
//    hideBackDrop();
//    stopAllAudio();
//    resetVariables();
//    prevText = "";
//    console.log("Error: No response received for the first chunk within 15 seconds");
//}, 15000);

document.addEventListener("mouseup", function () {
    selectedText = window.getSelection().toString().trim();
    if(prevSelection == null){
        prevSelection = selectedText;
    } else if(prevSelection !== selectedText){
        changeFound = true;
        prevSelection = selectedText;
    } else {
        changeFound = false;
    }
    if (selectedText != ""){
        if (doesContainsBengaliWord(selectedText) && !isPlayButtonVisible){
            userText = selectedText;
            console.log(selectedText);
            showPlayButton(selectedText);
            showSettingsButton();
            browserText = selectedText;
            savedSelection = window.getSelection().getRangeAt(0).cloneRange();
        } else if (changeFound){
            if(isPlayButtonVisible){
                hidePlayButton();
                hideSettingsButton();
                hidePopup();
            }
            if(isPlaying){
                pauseAllAudio();
            }
            userText = selectedText;
            showPlayButton(selectedText);
            showSettingsButton();
            browserText = selectedText;
            savedSelection = window.getSelection().getRangeAt(0).cloneRange();
        }
        else {
            hidePlayButton();
            hideSettingsButton();
        }
    }
});



document.addEventListener("click", function (event) {
    const selectedText = window.getSelection().toString().trim();
    if (event.target === playButton){
        const savedRange = saveSelection();
        restoreSelection(savedRange);
    }
    if (event.target !== settingsButton && isPopupVisible && !popup.contains(event.target)){
        console.log(isPopupVisible);
        hidePopup();
    }
    else if (event.target !== playButton && event.target !== settingsButton && isSettingsButtonVisible && isPlayButtonVisible && selectedText ==="" && !isPopupVisible) {
        hidePlayButton();
        hideSettingsButton();
        stopAllAudio();
    }
    if (popup.contains(event.target)){
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(savedSelection);
    }
});

function saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        return selection.getRangeAt(0);
    }
    return null;
}

function restoreSelection(range) {
    if (range) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function showPlayButton(selectedText) {
    playButton = document.createElement("div");
    playButton.id = "playButton";
//    playButton.innerHTML = isPlaying ? "&#10074;&#10074;" : "&#9658;";
    document.body.appendChild(playButton);
    isPlayButtonVisible = true;
    positionPlayButton();
    playButton.addEventListener("click", handlePlayButtonClick);
}

function showSettingsButton() {
    console.log("Show settings button triggered");
    settingsButton = document.createElement("div");
    settingsButton.id = "settingsButton";
    settingsButton.innerHTML = "&#9881";
    document.body.appendChild(settingsButton);
    isSettingsButtonVisible = true;
    positionSettingsButton();
    settingsButton.addEventListener("click", handleSettingsButtonClick);
}

function showPopup() {
    popup = document.createElement("div");
    popup.id = "popup";
    popup.innerHTML = `
                        <h2> কণ্ঠ </h2>
                        <label class = "toggle">
                        <span class = "toggle-label"> পুরুষ </span>
                        <input class = "toggle-checkbox" type="checkbox" ${genderChecked ? "checked" : ""} id = "genderCheckbox">
                        <div class = "toggle-switch"></div>
                        <span class = "toggle-label"> নারী </span>
                        </label>
                        
                        
<!--
                        <hr>
                        <label class = "toggle">
                        <span class = "toggle-label"> প্রাপ্তবয়স্ক </span>
                        <input class = "toggle-checkbox" type="checkbox" id = "ageCheckbox">
                        <div class = "toggle-switch"></div>
                        <span class = "toggle-label"> অপ্রাপ্তবয়স্ক </span>
                        </label>
                        
                        <hr>
-->
<!--
                        <div class = "dropdown">
                        <button class = "dropbtn"> গতি ↓ </button>
                        <div class = "dropdown-content">
                            <a>-২x</a>
                            <a>-১x</a>
                            <a>০x</a>
                            <a>১x</a>
                            <a>২x</a>
                        </div>
                        </div>
                        
                        <hr>
                        <div class = "dropdown">
                        <button class = "dropbtn"> পিচ ↓ </button>
                        <div class = "dropdown-content">
                            <a>-২x</a>
                            <a>-১x</a>
                            <a>০x</a>
                            <a>১x</a>
                            <a>২x</a>
                        </div>
                        </div>
-->
                        `;
    document.body.appendChild(popup);
    positionPopup();
    isPopupVisible = true;
    const checkbox = document.getElementById("genderCheckbox");
    checkbox.addEventListener("change", function() {
        if(checkbox.checked) {
            console.log("Checked");
            genderChecked = true;
            selectedGender = "female"
            selectedSpeaker = "0";
        }
        else{
            console.log("Not checked");
            genderChecked = false;
            selectedGender = "male";
            selectedSpeaker = "2";
        }
    })
}

function showBackdrop() {
  const backdrop = document.createElement("div");
  backdrop.id = "backdropId";
  backdrop.style.position = "fixed";
  backdrop.style.top = "0";
  backdrop.style.left = "0";
  backdrop.style.width = "100%";
  backdrop.style.height = "100%";
  backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  backdrop.style.zIndex = "9999";

  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  backdrop.appendChild(progressBar);
  document.body.appendChild(backdrop);
}


function hidePlayButton() {
    if (playButton) {
        playButton.remove();
        isPlayButtonVisible = false;
    }
    const allSettingsButton = document.getElementById("settingsButton");
    allSettingsButton.remove();
}

function hideSettingsButton() {
    console.log("Hidden triggered");
    if (settingsButton) {
        settingsButton.remove();
        isSettingsButtonVisible = false;
    }
}

function hidePopup() {
    if (popup) {
        popup.remove();
        isPopupVisible = false;
    }
}

function hidePopupOnClickOutside(event) {
    if (popup && !popup.contains(event.target)) {
        hidePopup();
    }
}

function hideBackDrop() {
    document.getElementById("backdropId").remove();
}


function positionPlayButton() {
    const selectedRange = window.getSelection().getRangeAt(0);
    const rect = selectedRange.getBoundingClientRect();
    playButton = document.getElementById("playButton");
    playButton.style.top = rect.top + window.scrollY - 35 + "px";
    playButton.style.left = rect.left + window.scrollX + "px";
}

function positionSettingsButton() {
    const selectedRange = window.getSelection().getRangeAt(0);
    const rect = selectedRange.getBoundingClientRect();
    settingsButton.style.top = rect.top + window.scrollY - 25 + "px";
    settingsButton.style.left = rect.left + window.scrollX + 35 + "px";
}

function positionPopup() {
    const selectedRange = window.getSelection().getRangeAt(0);
    const rect = selectedRange.getBoundingClientRect();
    popup.style.top = rect.top + window.scrollY - 35 + "px";
    popup.style.left = rect.left + window.scrollX + 70 + "px";
}

// Button handlers
async function handlePlayButtonClick() {
    if(isPopupVisible){
        hidePopup();
    }
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(savedSelection);
    let currentText = userText;

    if(isPlaying == false && currentText != prevText) {
        isPlayedOnce = true;
        resetVariables();
        prevText = currentText;
        
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(savedSelection);
        
        hideSettingsButton();
        
        console.log("Play button pressed");
        
        await sendAndRecieveEachChunk();
    }
    else if (isPlaying == true && isPlayedOnce == true && prevText == currentText) {
        pauseAllAudio();
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(savedSelection);
    }
    else if (isPlaying == false && isPlayedOnce == true && prevText == currentText) {
        triggerPlayback();
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(savedSelection);
    }
}

function handleSettingsButtonClick() {
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(savedSelection);
    if(isPopupVisible){
        hidePopup();
    }
    else if (!isPlaying){
        showPopup();
    }
}

function doesContainsBengaliWord(text){
    const bengaliRegex = /[\u0980-\u09FF]/; // Unicode range
    return bengaliRegex.test(text);
}


// String operations
function chunkifyText(text){
    return text.split(/[\r\n।?!,;—:’‘]+/gi).filter((token) => token.trim() != "");
}

const splitLongWords = (words, maxWords) => {
  const wordChunks = [];
  let currentWordChunk = "";

  for (const word of words) {
    if ((currentWordChunk + word).split(" ").length <= maxWords) {
      currentWordChunk += word + " ";
    } else {
      if (currentWordChunk !== "") {
        wordChunks.push(currentWordChunk.trim());
        currentWordChunk = "";
      }
      wordChunks.push(word);
    }
  }

  if (currentWordChunk !== "") {
    wordChunks.push(currentWordChunk.trim());
  }
  return wordChunks;
};

const sendAndRecieveEachChunk = async() => {
    showBackdrop();
    let chunks = chunkifyText(browserText);
    let index = 0;
    for (const [chunk_index, chunk] of chunks.entries()){
        const words = chunk.trim().split(" ");
        console.log(words.length);
        
        if (words.length > MAX_WORD_COUNT) {
            const wordChunks = splitLongWords(words, MAX_WORD_COUNT);
            for (const wordChunk of wordChunks) {
                const requestOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        index: "0",
                        gender: selectedGender,
                        speaker: selectedSpeaker,
                        model: "vits",
                        text: wordChunk,
                    }),
                };
                try {
                    const audioBlobJson = await fetch("https://dev.revesoft.com:9381/text_to_speech_socket", requestOptions).then(response => response.json());
                    console.log(audioBlobJson);
                    
                    if (audioBlobJson) {
                        const base64Audio = audioBlobJson.audio;
                        const audioBlob = base64ToBlob(base64Audio, 'audio/wav');
                        const blobURL = URL.createObjectURL(await audioBlob);
                        const audioElement = new Audio(await blobURL);
                        responseAudios[chunk_index + index] = audioElement;
                        console.log(`Received response for ${chunk_index + index}`);
                        if (index + chunk_index == 0){
                            //clearTimeout(responseTimer);
                            hideBackDrop();
                            triggerPlayback();
                        }
                    } else {
                        console.log("Error: No audio data received");
                    }
                } catch (error) {
                    console.error("Error: ", error);
                }
                index = index + 1;
            }
        } else {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    index: "0",
                    gender: selectedGender,
                    speaker: selectedSpeaker,
                    model: "vits",
                    text: chunk,
                }),
            };
            try {
                const audioBlobJson = await fetch("https://dev.revesoft.com:9381/text_to_speech_socket", requestOptions).then(response => response.json());
                console.log(audioBlobJson);
                if (audioBlobJson) {
                    const base64Audio = audioBlobJson.audio;
                    const audioBlob = base64ToBlob(base64Audio, 'audio/wav');
                    const blobURL = URL.createObjectURL(await audioBlob);
                    const audioElement = new Audio(await blobURL);
                    responseAudios[chunk_index + index] = audioElement;
                    console.log(`Received response for ${chunk_index + index}`);
                    if (index + chunk_index == 0){
                        //clearTimeout(responseTimer);
                        hideBackDrop();
                        triggerPlayback();
                    }
                } else {
                    console.log("Error: No audio data received");
                }
            } catch (error) {
                console.error("Error: ", error);
                showSettingsButton()
                hideBackDrop();
                resetVariables();
            }
        }
    }
}

function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}

function resetVariables(){
    responseAudios = [];
    playerIndex = 0;
}

async function triggerPlayback(){
    if (responseAudios !== null){
        for (; playerIndex < responseAudios.length; playerIndex++) {
            if(responseAudios[playerIndex] != null){
                await new Promise((resolve) => {
                    responseAudios[playerIndex].onended = resolve;
                    isPlaying = true;
//                    document.getElementById("playButton").innerHTML = "&#10074;&#10074;";
                    document.getElementById("playButton").style.backgroundImage = "url('https://i.postimg.cc/63m6s9CZ/giffycanvas.gif')";
                    responseAudios[playerIndex].play();
                });
            } else {
                continue;
            }
              }
        isPlaying = false;
        isPlayedOnce = false;
        prevText = "";
//        document.getElementById("playButton").innerHTML = "&#9658;";
        showSettingsButton()
        document.getElementById("playButton").style.backgroundImage = "url('https://i.postimg.cc/4NtfMRyK/Frame.png')";
        console.log("Done and dusted");
        console.log("Saved selection:", savedSelection)
    }
    showSettingsButton()
}

function pauseAllAudio() {
    isPlaying = false;
//    playButton.innerHTML = "&#9658;";
    playButton.style.backgroundImage = "url('https://i.postimg.cc/4NtfMRyK/Frame.png')";
    for (const audioElement of responseAudios) {
        audioElement.pause();
    }
}

function stopAllAudio() {
    isPlaying = false;
//    playButton.innerHTML = "&#9658;";
    playButton.style.backgroundImage = "url('https://i.postimg.cc/4NtfMRyK/Frame.png')";
    for (const audioElement of responseAudios) {
        audioElement.pause();
        audioElement.currentTime = 0;
        playerIndex = 0;
    }
    prevText = "";
    resetVariables();
}

browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
    console.log("Received response: ", response);
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);
});
