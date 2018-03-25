var textBox, keyboardElement;
var addKeyMenuItem, addKeySubmenu, addKeyDialog, addKeyDialogCancel;
var deleteKeyMenuItem;
var toggleMenuItem, customkeyboard, qwertykeyboard;
var minimizeButton, toggleButton;
var shiftKey;
var shiftcounter = 0;
var startingKeys = ['a', 'e', 'i', 'o', 'u', 'the', 'macro', 'é'];


function main(){
    cacheElements();
	prepareOnClickListeners();
	createStartingKeys();
} // end main

function cacheElements() {
	// Cache references
	// Main 'google search bar' textbox
	textBox = document.getElementById("textbox");
	// Entire keyboard element
	keyboardElement = document.getElementById('keyboard');

	addKeyMenuItem = document.getElementById("addkey");
	// Submenu containing items 'add custom key' and 'toggle shift key'
	addKeySubmenu = document.getElementById("addkey-menu");
	// Dialog allowing for custom key selection
	addKeyDialog = document.getElementById("addkey-dialog");
	// Cancel button of above dialog
	addKeyDialogCancel = document.getElementById("addkey__cancel");

	deleteKeyMenuItem = document.getElementById("deletekey");

	toggleMenuItem = document.getElementById("togglekeyboard");

	customkeyboard = document.getElementById("keyboard__keys--custom");

	qwertykeyboard = document.getElementById("keyboard__keys--qwerty");
	// Shift key on keyboard
	shiftKey = document.getElementById("shift");

	minimizeButton = document.getElementById("minimize");
	closeButton = document.getElementById("close");

} // end cacheElements

function createStartingKeys() {
	for (var index in startingKeys) {
		createKey(startingKeys[index]);
	}
}

function prepareOnClickListeners() {

	// Existing keyboard keys
	// find all keys
    var keyElements = document.getElementsByClassName("key");
    // Attach handler to each key's onclick event
    for (i = 0; i < keyElements.length; i++) { 
    	keyElements[i].addEventListener("click",keyClickHandler)
	} // end for

	// ADD KEY
	// Add Key menu item
	addKeyMenuItem.addEventListener("click", toggleVisible.bind(this, addKeySubmenu));
	// Submenu's add key button
	document.getElementById("addkey-menu__add").addEventListener("click", () => {
		toggleVisible(addKeyDialog);
		toggleVisible(addKeySubmenu);	// Close submenu after
		addKeyMenuItem.className = ''; 	// Unhighlight addkeymenuitem
	});
	// Submenu's toggle shift button
	document.getElementById("addkey-menu__toggleshift").addEventListener("click", () => {
		toggleVisible(shiftKey);
		toggleVisible(addKeySubmenu);	// Close submenu after
		addKeyMenuItem.className = ''; 	// Unhighlight addkeymenuitem
	});
	// Dialog's add button
	document.getElementById("addkey__add").addEventListener("click", () => {
		addKey();
		toggleVisible(addKeyDialog);	// Close dialog after
	});
	// Dialog's cancel button
	// NOTE: should only ever be called to close the add key dialog, but uses
	// 	the same toggleVisible function
	addKeyDialogCancel.addEventListener("click", 
		toggleVisible.bind(this, addKeyDialog));

	// DELETE KEY
	deleteKeyMenuItem.addEventListener("click", deleteMenuHandler);

	// TOGGLE KEYBOARD
	toggleMenuItem.addEventListener("click", switchKeyboards);
	// MINIMIZE/CLOSE
	minimizeButton.addEventListener("click", toggleMinimized);
	closeButton.addEventListener("click", deleteElement.bind(this, keyboardElement))

	addKeyMenuItem.addEventListener("click", highlightMenuItem);
	deleteKeyMenuItem.addEventListener("click", highlightMenuItem);
	toggleMenuItem.addEventListener("click", highlightMenuItem);
	keyboardElement.addEventListener("click", () => {
		if (event.target.className == 'keyboard__keys') {
			addKeySubmenu.style.display = 'none';
			addKeyMenuItem.className = '';
		}
	})

} // end prepareOnClickListeners

function keyClickHandler(){
	if (this.id == "shift" || this.id == "shift--qwerty") {
		// Shift key was clicked
		shiftHandler();
	} else if (this.className == "key show-x") { 
		// If delete Key is active, and the key gets clicked.
		deleteElement(this);
	} else {
		// Delete Key not active
		addContentsToTextbox(this);
	}
	
} // end keyClickHandler

// To be called by keyClickHandler
function addContentsToTextbox(clickedKey) {
	// Add key contents to textbox
	console.log(clickedKey.children[0]);
    textBox.value += clickedKey.children[0].innerHTML;
    //Put the curser back in the textbox.
    textbox.focus();
} // end addContentsToTextbox

// Assumes that the element's display should be either
// 	inline-block or none
function toggleVisible(element) {
	if (element.style.display == 'inline-block') {
		element.style.display = 'none';
	} else {
		element.style.display = 'inline-block';
	}
}

function deleteMenuHandler(){
	// find all custom keys
	var customKeyboardElement = document.getElementById('keyboard__keys--custom');
	var customKeys = customKeyboardElement.getElementsByClassName("key");
	// toggle .show-x
	for(i = 0; i < customKeys.length; i++){
		if (customKeys[i].className == "key"){
			customKeys[i].className = "key show-x";
		} else { // className = "key show-x"
			customKeys[i].className = "key";
		} // end if
	} // end for

	addKeySubmenu.style.display = 'none'; // Make sure add key submenu is closed

	// Toggle menu item text between 'Delete Key' and 'Cancel'
	if (deleteKeyMenuItem.innerHTML == 'Delete Key') {
		deleteKeyMenuItem.innerHTML = 'Cancel';
	} else {
		deleteKeyMenuItem.innerHTML = 'Delete Key';
	}
}

function addKey() {
	// Get value for new key
	var newVal = document.getElementById("addkey-text").value;
	if (newVal == "") { return; }
	newVal = newVal.toLowerCase();
	createKey(newVal);
}

function createKey(value) {
	
	
	// Create new key element
	var key = document.createElement('div');
	var span = document.createElement('span');
	if (value.length > 4) {
		span.className = 'smalltext'
	} else if (value.length > 1) {
		span.className = 'mediumtext';
	}
	var textnode = document.createTextNode(value);
	span.appendChild(textnode);
	key.appendChild(span);
	key.className = 'key';
	key.addEventListener("click",keyClickHandler);
	matchShiftState(key);

	

	// Append new element to parent
	customkeyboard.appendChild(key);
}

function deleteElement(element) {
	element.outerHTML = "";
	delete element;
}

function shiftHandler() {
	// Toggle to next shift setting
	if (shiftcounter == 2) {
		shiftcounter = 0;
	} else {
		shiftcounter += 1;
	}

	// Update all keys to match case
	// 	1. Find all keys
	var keys = document.getElementsByClassName("key");
	//  2. Loop through, updating keys to match case
	var newVal;
	var oldVal;
	for (i = 0; i < keys.length; i++) {
		matchShiftState(keys[i]);
	}
}

function matchShiftState(key) {
	var oldVal = key.children[0].innerHTML;
	switch (shiftcounter) {
		case 0: newVal = oldVal.toLowerCase(); break;
		case 1: newVal = oldVal.charAt(0).toUpperCase() + oldVal.slice(1); break;
		case 2: newVal = oldVal.toUpperCase(); break;
	}
	key.children[0].innerHTML = newVal;
}

function switchKeyboards() {
	toggleVisible(addKeyMenuItem);
	toggleVisible(deleteKeyMenuItem);
	addKeySubmenu.style.display = 'none'; // Make sure add key submenu is closed
	toggleVisible(customkeyboard);
	toggleVisible(qwertykeyboard);
}

function toggleMinimized() {
	if (keyboardElement.className == 'minimized') {
		keyboardElement.className = '';
	} else {
		keyboardElement.className = 'minimized';
	}
	toggleVisible(document.getElementById('title'));
}

function highlightMenuItem() {
	var highlighted = document.getElementsByClassName('highlighted');
	var thisIsHighlighted = false;
	for (index in highlighted) {
		var current = highlighted[index];
		if (current == this) {
			thisIsHighlighted = true;
		}
		highlighted[index].className = '';
	}
	if (!thisIsHighlighted) {
		this.className = 'highlighted';
	}
	
}

window.addEventListener("load",main);