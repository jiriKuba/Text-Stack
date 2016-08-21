var textDatabase = null;

chrome.commands.onCommand.addListener(function (command) {
    if (command === "add-selected") {
		getPageSelection(null);
	}
	else if(command==="google-request"){
		sendGoogleRequest(textDatabase);
	}
	else if(command==="clear-stack"){
		clearArray(textDatabase);		
	}
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {    
  if(message.method === 'getTextDatabase'){
  	sendResponse({data: textDatabase});
  }
  else if(message.method === 'clearTextDatabase'){
  	clearArray(textDatabase);
  	sendResponse({data: textDatabase});
  }
  else if(message.method == 'eraseRowFromTextDatabase'){
  	var row = message.rowToErase;
  	if (typeof row != 'undefined')
  		eraseRowFromDatabase(row, textDatabase);

  	sendResponse({data: textDatabase});
  }  
  else if(message.method == 'addRowToClipboard'){
  	var row = message.rowToClipboard;
  	if (typeof row != 'undefined')
  		addRowToClipboard(row, textDatabase);

  	sendResponse({data: textDatabase});
  }  
  else if(message.method === 'askGoogleRequest'){
  	sendGoogleRequest(textDatabase);
  	sendResponse({data: textDatabase});
  }
  else if(message.method === 'allToClipboard'){
  	addAllToClipboard(textDatabase);
  	sendResponse({data: textDatabase});
  }
  else if(message.method === 'getPageSelection'){
  	var callback = function(database) {
  		//has to be this way
    	chrome.runtime.sendMessage({method: "updatePopupDatabase",data: textDatabase}, function(response) {
    	    if (typeof response != 'undefined') {
    			if(response.data == true){
    				console.log("Popup was successfuly updated");
    			}
    			else{
    				console.log("Popup cannot been successfuly updated");
    			}
  			}
		});
	};
  	getPageSelection(callback);
  }
});

function getPageSelection(callback){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  			chrome.tabs.sendMessage(tabs[0].id, {action: "getSelectedText"}, function(response) {
  			    if (typeof response != 'undefined' && typeof response.data != 'undefined' && response.data != '') {
    				addTextToDatabase(response.data);
    				updateBadgeText(textDatabase.length.toString());
    				
    				if(typeof callback !='undefined' && callback != null){
						callback();
					}
  				}
  			});
		});	
}

function clearArray(inputArray){
	if(inputArray!=null && inputArray.length > 0){
		while(inputArray.length > 0) {
    		inputArray.pop();
		}
	}

	clearBadge();
}

function eraseRowFromDatabase(row, inputArray){
	if(inputArray!=null && inputArray.length > row){		
		inputArray.splice(Number(row), 1); //remove one item on row
		updateBadgeText(textDatabase.length.toString()); //update badge
	}
}

function sendGoogleRequest(inputArray) {
	if(inputArray!=null && inputArray.length > 0){
	    var googleCall = 'http://www.google.com/search?q=' + encodeURIComponent(inputArray.map(function(elem){ return elem.text; }).join(" "));
  		chrome.tabs.create({url: googleCall});

  		clearArray(textDatabase);	
	}
}

function addAllToClipboard(inputArray){
	if(inputArray!=null && inputArray.length > 0){
		var text = inputArray.map(function(elem){ return elem.text; }).join(" ");
		copyToClipboard(text);
	}
}

function addRowToClipboard(row, inputArray){	
	if(inputArray!=null && inputArray.length > row){
		var text = inputArray[row].text;
		copyToClipboard(text);
	}
}

function addTextToDatabase(text){
	var ind = 0;
	if(textDatabase == null){
		textDatabase = new Array();
	}
	else{
		ind = textDatabase.length;
	}

	var date = new Date();
	date = date.toLocaleTimeString();
	var textObject = {text: text, date: date};
	textDatabase[ind] = textObject;
}

function documentReady(){
	chrome.browserAction.setBadgeBackgroundColor({color: "#444444"});
	clearBadge();
}

function clearBadge(){
	chrome.browserAction.setBadgeText({text: "0"});
}

function updateBadgeText(text){
	chrome.browserAction.setBadgeText({text: text});
}

function copyToClipboard(text){
    var tempElement = document.createElement('div');
    tempElement.contentEditable = true;
    document.body.appendChild(tempElement);
    tempElement.innerHTML = text;
    tempElement.unselectable = "off";
    tempElement.focus();
    document.execCommand('SelectAll');
    document.execCommand("Copy", false, null);
    document.body.removeChild(tempElement);
}

window.onload = documentReady;