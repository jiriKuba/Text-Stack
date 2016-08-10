chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  if(message.method == 'getSelectedText'){
  	sendResponse({data: window.getSelection().toString()});
  }
});