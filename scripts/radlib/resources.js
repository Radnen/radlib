/**
* Script: resources.js
* Written by: Radnen
* Updated: 3/13/2013
**/

/**
* Global Asset Manager:
* ============================================
*  - Automatically loads game assets.
*  - To access assets ues their name in one of
*    the objects below. Say it automatically
*    loads "face.png" use "Resources.images.face"
*    to access it. The code will search sub-
*    folders, "face.png" can be in any subfolder
*    of /images, but accessed no differently.
**/
var Resources = ({
	// Default Paths Are Defined as Follows:
	imagePath        : "images",
	soundPath        : "sounds",
	fontPath         : "fonts",
	scriptPath       : "scripts",
	windowstylesPath : "windowstyles",
	
	registered: ["png", "bmp", "gif", "tga", "jpg", "wav", "flac", "rss", "rfn", "rws", "js"],
	
	// public-access objects that hold loaded data:
	images       : {},
	fonts        : {},
	music        : {},
	sounds       : {},
	windowstyles : {},
	
	/**
	* loadRenderer();
	*  - overload this function to have a custom blited image.
	**/
	loadRenderer: function() {
		Lib.drawCenteredText(Lib.SW/2, Lib.SH/2, "Loading Content...");
	},
	
	/**
	* isValid(path : string);
	*  - used internally to check if a path is of a valid type.
	**/
	isValid: function(path) {
		return List.contains(this.registered, function(i) { return i == path; });
	},
	
	/**
	* loadAll();
	*  - immediately loads all of the content into respective subfolders.
	**/
	loadAll: function() {
		Loader.drawProgress(this.imagePath);
		this.load(this.images, this.imagePath, LoadImage);
		Loader.drawProgress(this.soundPath);
		this.load(this.sounds, this.soundPath, LoadSound);
		Loader.drawProgress(this.fontPath);
		this.load(this.fonts, this.fontPath, LoadFont);
		Loader.drawProgress(this.windowstylePath);
		this.load(this.windowstyles, this.windowstylesPath, LoadWindowStyle);
		
		// Rad-Lib Specifics:
		if (this.images.cursor)
			Lib.cursor = this.images.cursor;
		
		Debug.log("Loaded Resources");
	},
	
	/**
	* Loads all contents from path into array.
	*  - array: array or object to hold tsuff in.
	*  - path: the filepath of the root folder to start loading from.
	*  - func: has to be any one of sphere's load functions.
	**/
	load: function(array, path, func) {
		var dirs = GetDirectoryList(path);
		for(var i = 0; i < dirs.length; ++i) {
			this.load(array, path+"/"+dirs[i], func);
		}
		
		var files = GetFileList(path);
		try {
			List.foreach(files, function(file) {
				var str = file.split(".");
				var t = this.isValid(str[str.length-1]);
				if (t) array[str[0]] = func("../"+path+"/"+file);
			}, this);
		}
		catch (e) { Debug.abort(e + ", " + path); }
	},
});
