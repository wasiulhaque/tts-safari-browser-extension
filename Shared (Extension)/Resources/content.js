const styles = `
    #playButton, #settingsButton {
      position: absolute;
      z-index: 9999;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
      user-select: none;
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
      background-color: #3498db; / You can customize the play button's appearance /
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
.toggle-checkbox:checked + .toggle-switch {
  background: #56c080;
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

let playButton;
let settingsButton;
let popUpMenu;
let backdrop;
let progressBar;

let isPlayButtonVisible = false;
let isSettingsButtonVisible = false;
let isPopUpMenuVisible = false;
let isPlayedOnce = false;

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
    if (selectedText != ""){
        if (doesContainsBengaliWord(selectedText)){
            userText = selectedText;
            console.log(selectedText);
            showPlayButton(selectedText);
            showSettingsButton();
            browserText = selectedText;
            savedSelection = window.getSelection().getRangeAt(0).cloneRange();
        } else {
            hidePlayButton();
            hideSettingsButton();
        }
    }
});

document.addEventListener("click", function (event) {
    const selectedText = window.getSelection().toString().trim();
    if (event.target !== playButton && event.target !== settingsButton && isSettingsButtonVisible && isPlayButtonVisible && selectedText ==="") {
        hidePlayButton();
        hideSettingsButton();
        stopAllAudio();
    }
});

function showPlayButton(selectedText) {
    playButton = document.createElement("div");
    playButton.id = "playButton";
    playButton.innerHTML = isPlaying ? "&#10074;&#10074;" : "&#9658;";
    document.body.appendChild(playButton);
    isPlayButtonVisible = true;
    positionPlayButton();
    playButton.addEventListener("click", handlePlayButtonClick);
}

function showSettingsButton() {
    settingsButton = document.createElement("div");
    settingsButton.id = "settingsButton";
    settingsButton.innerHTML = "&#9881";
    document.body.appendChild(settingsButton);
    isSettingsButtonVisible = true;
    positionSettingsButton();
    settingsButton.addEventListener("click", handleSettingsButtonClick);
}

function showPopUpMenu() {
    console.log("Inside here");
    popUpMenu = document.createElement("div");
    popUpMenu.id = "popUpMenu";
    popUpMenu.innerHTML = `
  <h2> কণ্ঠ </h2>
  
  <label class="toggle">
    <span class="toggle-label">পুরুষ </span>
    <input class="toggle-checkbox" type="checkbox" "checked"
    id="genderCheckbox">
    <div class="toggle-switch"></div>
    <span class="toggle-label">নারী </span>
  </label>
  
  <hr>
  
  <div class="dropdown">
    <button class="dropbtn">গতি </button>
    <div class="dropdown-content">
      <a>-২x</a>
      <a>-১x</a>
      <a>0x</a>
      <a>১x</a>
      <a>২x</a>
    </div>
  </div>
  
  <hr>
  
  <div class="dropdown">
    <button class="dropbtn">পিচ </button>
    <div class="dropdown-content">
      <a>-২x</a>
      <a>-১x</a>
      <a>0x</a>
      <a>১x</a>
      <a>২x</a>
    </div>
  </div>
`;
    document.body.appendChild(popUpMenu);
    isPopUpMenuVisible = true;
    positionPopUpMenu();
}

function showBackdrop() {
    backdrop = document.createElement("div");
    backdrop.id = "backdropId";
    backdrop.style.position = "fixed";
    backdrop.style.top = "0";
    backdrop.style.left = "0";
    backdrop.style.width = "100%";
    backdrop.style.height = "100%";
    backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    backdrop.style.zIndex = "9999";
    progressBar = document.createElement("div");
    progressBar.className = "progress-bar";
    backdrop.appendChild(progressBar);
    document.body.appendChild(backdrop);
}

function hidePlayButton() {
    if (playButton) {
        playButton.remove();
        isPlayButtonVisible = false;
    }
}

function hideSettingsButton() {
    if (settingsButton) {
        settingsButton.remove();
        isSettingsButtonVisible = false;
    }
}

function hidePopUpMenu() {
    if (popUpMenu) {
        popUpMenu.remove();
        isPopUpMenuVisible = false;
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

function positionPopUpMenu() {
    const selectedRange = window.getSelection().getRangeAt(0);
    const rect = selectedRange.getBoundingClientRect();
    popUpMenu.style.top = rect.top + window.scrollY - 35 + "px";
    popUpMenu.style.left = rect.left + window.scrollX + 70 + "px";
}

// Button handlers
async function handlePlayButtonClick() {
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(savedSelection);
    let currentText = userText;
    
//    console.log("Current: " + currentText)
//    console.log("Previous: " + prevText)
    
    if(isPlaying == false && currentText != prevText) {
        isPlayedOnce = true;
        resetVariables();
        prevText = currentText;
        
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(savedSelection);
        
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
//    if (isPopUpMenuVisible) {
//        hidePopUpMenu();
//    } else {
//        showPopUpMenu();
//    }
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
                        module: "backend_tts",
                        submodule: "infer",
                        text: wordChunk,
                    }),
                };
                try {
                    const audioBlob = await fetch("https://stt.bangla.gov.bd:9381/utils/", requestOptions).then(response => response.blob());
                    
                    if (audioBlob) {
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
                    module: "backend_tts",
                    submodule: "infer",
                    text: chunk,
                }),
            };
            try {
                const audioBlob = await fetch("https://stt.bangla.gov.bd:9381/utils/", requestOptions).then(response => response.blob());
                
                if (audioBlob) {
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
                hideBackDrop();
                resetVariables();
            }
        }
    }
}

function resetVariables(){
    responseAudios = [];
    playerIndex = 0;
}

async function triggerPlayback(){
    if (responseAudios !== null){
        for (; playerIndex < responseAudios.length; playerIndex++) {
                await new Promise((resolve) => {
                  responseAudios[playerIndex].onended = resolve;
                    isPlaying = true;
                    document.getElementById("playButton").innerHTML = "&#10074;&#10074;";
                  responseAudios[playerIndex].play();
                });
              }
        isPlaying = false;
        isPlayedOnce = false;
        prevText = "";
        document.getElementById("playButton").innerHTML = "&#9658;";
    }
}

function pauseAllAudio() {
    isPlaying = false;
    playButton.innerHTML = "&#9658;";
    for (const audioElement of responseAudios) {
        audioElement.pause();
    }
}

function stopAllAudio() {
    isPlaying = false;
    playButton.innerHTML = "&#9658;";
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
