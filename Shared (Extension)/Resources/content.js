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

let isPlaying = false
let browserText = ""
let savedSelection;

let playButton;
let settingsButton;
let popUpMenu;

let isPlayButtonVisible = false;
let isSettingsButtonVisible = false;
let isPopUpMenuVisible = false;

document.addEventListener("mouseup", function () {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText != ""){
        if (doesContainsBengaliWord(selectedText)){
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
    }
    if (!isPlayButtonVisible) {
        hideSettingsButton();
    }
    if (!isSettingsButtonVisible) {
        hidePlayButton();
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
    
    console.log("Play button pressed");
    
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            module: "backend_tts",
            submodule: "infer",
            text: browserText,
        }),
    };
    
    await fetch("https://stt.bangla.gov.bd:9381/utils/", requestOptions)
    .then(response => response.blob())
    .then((audioBlob) => {
        const blobURL = URL.createObjectURL(audioBlob);
        const audioElement = new Audio(blobURL);
        audioElement.play();
    })
    .catch((error) => console.error("Error: ", error));
    if (response.ok) {
        console.log("Recieved response");
    }
    else {
        console.log("Error sending request");
    }
    
    const selectedText = window.getSelection().toString().trim();
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

browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
    console.log("Received response: ", response);
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);
});
