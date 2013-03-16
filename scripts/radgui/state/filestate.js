/**
* Script: filestate.js
* Written by: Radnen
* Updated: 3/15/2013
**/

const FILE_SAVE = 0;
const FILE_LOAD = 1;

function FileState(type)
{
	UIState.call(this, "datastate", Lib.SW/2-150, Lib.SH/2-100, 300, 200);
	
	this.onOpen = new Event(this);
	this.alpha = new ValueLerper();
	this.closing = false;
	
	this.onOpen.add(function(sender) {
		sender.file = sender.input.text + ".sav";
		sender.hide();
	}, this);

	if (!type) type = FILE_SAVE;
	this.type = type;
	this.window = true;
	this.file = "";
	
	this.onEnter.add(function() {
		this.fadeIn();
	});
	
	var filelabel = new Label(this.x + 8, this.y + 8, "Saved Games:");
	filelabel.window = true;
	this.controls.add(filelabel);
	
	var filelist = new ScrollList(this.x + 8, this.y + 28, 140, 128);
	filelist.onClick.add(function(sender) {
		sender.input.text = this.items[this.index].text;
	}, this);
	this.controls.add(filelist);
	
	var files = GetFileList("~/other");
	List.foreach(files, function(file) {
		if (file != "options.sav")
			filelist.addItem(file.substr(0, file.length-4), null, Resources.images.file);
	});
	
	this.input = new InputBox(this.x + 168, this.y + 28, 120);
	this.input.caption = "Filename:";
	this.controls.add(this.input);
	
	var cancelbutton = new Button(this.x + 5, this.y + this.h - 21, "Cancel");
	cancelbutton.onClick.add(function(sender) { sender.close(true); }, this);
	this.controls.add(cancelbutton);
	
	var okbutton = new Button(this.x+this.w-47, this.y+this.h-21, type == FILE_SAVE ? "Save" : "Load");
	okbutton.onClick.add(function(sender) { sender.close(false); }, this);
	this.controls.add(okbutton);
	
	this.onFadedOut.add(function() {
		if (!this.cancelled) this.act();
		else this.hide();
	});
}

FileState.prototype.close = function(type) {
	this.cancelled = type;
	this.fadeOut();
}

FileState.prototype.act = function() {
	if (this.type == FILE_SAVE && Assert.fileExists("~/other", this.input.text + ".sav")) {
		var yesno = new PopupBox("exists", FormatString("File {?}.sav exists, overwrite?", this.input.text), POPUP_YESNO);
		yesno.onYes.add(function(sender) { sender.onOpen.execute(); }, this);
		yesno.show();
	}
	else this.onOpen.execute();
}