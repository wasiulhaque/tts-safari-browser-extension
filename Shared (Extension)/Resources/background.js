browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);

    if (request.greeting === "Cholo")
        sendResponse({ farewell: "Bangladesh" });
});
