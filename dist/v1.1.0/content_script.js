chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'getSelectedText') {
  	    sendResponse({data: window.getSelection().toString()});
    }
});