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

document.addEventListener("mouseup", function () {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText != ""){
        console.log(selectedText);
        showPlayButton(selectedText);
    }
});

function showPlayButton(selectedText) {
    const buttonDiv = document.createElement("div");
    buttonDiv.id = "playButton";
    buttonDiv.innerHTML = isPlaying ? "&#10074;&#10074;" : "&#9658;";
    document.body.appendChild(buttonDiv);
    positionPlayButton();
}

function positionPlayButton() {
    const selectedRange = window.getSelection().getRangeAt(0);
    const rect = selectedRange.getBoundingClientRect();
    const buttonDiv = document.getElementById("playButton");
    buttonDiv.style.top = rect.top + window.scrollY - 35 + "px";
    buttonDiv.style.left = rect.left + window.scrollX + "px";
}

browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
    console.log("Received response: ", response);
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);
});
