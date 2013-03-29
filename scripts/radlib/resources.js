/**
* Script: resources.js
* Written by: Radnen
* Updated: 3/29/2013
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
var Resources = (function(){
	var Types = ["png", "bmp", "gif", "tga", "jpg", "wav", "flac", "rss", "rfn", "rws"];
	
	// public-access objects that hold loaded data:
	var Images = {}, Fonts = {}, Sounds = {}, Windowstyles = {};
	
	var array = []; // pointer to current loading array
	var func = null; // pointer to current loading function

	function IsValid(file) {
		return List.contains(Types, function(i) { return i == file; });
	}
		
	function Load(path) {
		List.foreach(GetDirectoryList(path), function(dir) {
			Load(path + "/" + dir);
		});
		
		List.foreach(GetFileList(path), function(file) {
			var s = file.split('.');
			if (IsValid(s[s.length - 1])) {
				array[s[s.length - 2]] = func("." + path + "/" + file);
			}
		});
	}
	
	/**
	* LoadAll();
	*  - immediately loads all of the content into respective subfolders.
	**/
	function LoadAll() {
		var t = GetTime();
		Loader.drawProgress("Images");
		LoadInto(Images, "./images", LoadImage);
		Loader.drawProgress("Sounds");
		LoadInto(Sounds, "./sounds", LoadSound);
		Loader.drawProgress("Fonts");
		LoadInto(Fonts, "./fonts", LoadFont);
		Loader.drawProgress("Windowstyles");
		LoadInto(Windowstyles, "./windowstyles", LoadWindowStyle);
		
		// Rad-Lib Specifics:
		if (Images.cursor) Lib.cursor = Images.cursor;
		
		Debug.log("Loaded Resources: in {?} ms", GetTime() - t);
	}
		
	/**
	* LoadInto(arr : array, root : string, fun : function);
	*  - array: array or object to hold the files in.
	*  - path: the filepath of the root folder to start loading from.
	*  - func: any one of sphere's load functions.
	**/
	function LoadInto(arr, root, fun) {
		array = arr;
		func = fun;
		Load(root);
	}
	
	return {
		loadAll: LoadAll,
		loadInto: LoadInto,
		images: Images,
		fonts: Fonts,
		sounds: Sounds,
		windowstyles: Windowstyles
	}
})();
