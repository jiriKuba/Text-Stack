var textDatabase = null;
var mainTableHeaderHTML = "<tr><th>To clipboard</th><th>Delete</th><th class='left-cell'>Text</th><th class='left-cell'>Time</th></tr>";

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  if(message.method == 'updatePopupDatabase'){
  	if(message.data !=='undefined'){
    	textDatabase = message.data;
    	
    	drawTextDatabase(textDatabase);

    	sendResponse({data: true});
  	}
  	else{
  		sendResponse({data: false});
  	}
  }
});

function getTextDatabase(){
	chrome.runtime.sendMessage({method: "getTextDatabase"}, function(response) {
  		if(response !=='undefined'){
  			//alert(JSON.stringify(response));
    		textDatabase = response.data;
    		drawTextDatabase(textDatabase);
  		}
	});
}

function clearStack(){
	if(textDatabase!=null && textDatabase.length > 0){			
		chrome.runtime.sendMessage({method: "clearTextDatabase"}, function(response) {
  			if(response !=='undefined'){
    			textDatabase = response.data;
    			drawTextDatabase(textDatabase);
  			}
		});
	}
}

function askGoogleRequest(){
	if(textDatabase!=null && textDatabase.length > 0){			
		chrome.runtime.sendMessage({method: "askGoogleRequest"}, function(response) {
  			if(response !=='undefined'){
    			textDatabase = response.data;
    			drawTextDatabase(textDatabase);
  			}
		});
	}
}

function deleteRow(event){	
	if(textDatabase!=null && textDatabase.length > 0){		
		var row = event.target.getAttribute("row-number");	
		if(row!=null && row !=='undefined')
		{
			chrome.runtime.sendMessage({method: "eraseRowFromTextDatabase", rowToErase: row}, function(response) {
  				if(response !=='undefined'){
    				textDatabase = response.data;
    				drawTextDatabase(textDatabase);
  				}
			});
		}
	}
}

function addRowToClipboard(event){	
	if(textDatabase!=null && textDatabase.length > 0){		
		var row = event.target.getAttribute("row-number");	
		if(row!=null && row !=='undefined')
		{
			chrome.runtime.sendMessage({method: "addRowToClipboard", rowToClipboard: row}, function(response) {
  				if(response !=='undefined'){
    				textDatabase = response.data;
    				drawTextDatabase(textDatabase);
  				}
			});
		}
	}
}

function allToClipboard(){	
	if(textDatabase!=null && textDatabase.length > 0){			
		chrome.runtime.sendMessage({method: "allToClipboard"}, function(response) {
  			if(response !=='undefined'){
    			textDatabase = response.data;
    			drawTextDatabase(textDatabase);
  			}
		});
	}
}

function getPageSelection(){		
	chrome.runtime.sendMessage({method: "getPageSelection"}, function(response) {
  		if(response !=='undefined'){
    		textDatabase = response.data;
    		drawTextDatabase(textDatabase);
  		}
	});
}

function drawTextDatabase(inputArray){
	clearMainTable();
	var mainTable = document.getElementById('main-table');
	if(mainTable !=='undefined'){
		mainTable.innerHTML += mainTableHeaderHTML;
	}

	if(inputArray != null && inputArray !=='undefined' && inputArray.length > 0){	

		if(mainTable !=='undefined') {    		
    		for (var i = 0; i < inputArray.length; i++) {    	
    			var isEven = (i % 2 == 0);		
    			mainTable.innerHTML +="<tr class='"+ (isEven ? "" : "evenrowcolor")+ "'><td class='center-cell'><button row-number='"+i+"' class='add-row-to-clipboard-btn'> + </button></td><td class='center-cell'><button row-number='"+i+"' class='delete-row-btn'> - </button></td><td>"+cutText(50, inputArray[i].text)+"</td><td>"+inputArray[i].date+"</td></tr>";
    		}
		}
	}
	else{
		mainTable.innerHTML +="<tr><td colspan='4' class='empty-row'>There is no text in the stack</td></tr>";
	}

	if(mainTable !=='undefined'){
		mainTable.innerHTML +="<tr class='center-cell'><td><button class='all-to-clipboard-btn'>All to clipboard</button></td><td><button class='stack-clear-btn'>Clear stack</button></td><td><button class='add-selection-btn'>Add selection</button></td><td><button class='ask-google-btn'>Ask Google</button></td></tr>";
	}

	addListeners();
}

function addListeners(){
	var stackClearClass = document.getElementsByClassName("stack-clear-btn");
	if(stackClearClass!=null && stackClearClass !=='undefined' && stackClearClass.length >0)
	{
    	for(var i=0;i<stackClearClass.length;i++){
        	stackClearClass[i].addEventListener('click', clearStack, false);
    	}
	}

	var askGoogleClass = document.getElementsByClassName("ask-google-btn");
	if(askGoogleClass!=null && askGoogleClass !=='undefined' && askGoogleClass.length >0)
	{
    	for(var i=0;i<askGoogleClass.length;i++){
        	askGoogleClass[i].addEventListener('click', askGoogleRequest, false);
    	}
	}

	var delteRowClass = document.getElementsByClassName("delete-row-btn");
	if(delteRowClass!=null && delteRowClass !=='undefined' && delteRowClass.length >0)
	{
    	for(var i=0;i<delteRowClass.length;i++){
        	delteRowClass[i].addEventListener('click', deleteRow, false);
    	}
	}

	var addSelectionClass = document.getElementsByClassName("add-selection-btn");
	if(addSelectionClass!=null && addSelectionClass !=='undefined' && addSelectionClass.length >0)
	{
    	for(var i=0;i<addSelectionClass.length;i++){
        	addSelectionClass[i].addEventListener('click', getPageSelection, false);
    	}
	}

	var addRowToClipboardClass = document.getElementsByClassName("add-row-to-clipboard-btn");
	if(addRowToClipboardClass!=null && addRowToClipboardClass !=='undefined' && addRowToClipboardClass.length >0)
	{
    	for(var i=0;i<addRowToClipboardClass.length;i++){
        	addRowToClipboardClass[i].addEventListener('click', addRowToClipboard, false);
    	}
	}

	var allToClipboardClass = document.getElementsByClassName("all-to-clipboard-btn");
	if(allToClipboardClass!=null && allToClipboardClass !=='undefined' && allToClipboardClass.length >0)
	{
    	for(var i=0;i<allToClipboardClass.length;i++){
        	allToClipboardClass[i].addEventListener('click', allToClipboard, false);
    	}
	}
}

function clearMainTable(){
	var mainTable = document.getElementById('main-table');
	if(mainTable !=='undefined')
    	mainTable.innerHTML = "";
}

function documentReady(){
    getTextDatabase();    
}

function cutText(charCount, text){
	if(text != null && charCount != null && text.length > charCount){
		return text.substring(0,charCount)+"...";
	}
	else{
		return text;
	}
}

window.onload = documentReady;