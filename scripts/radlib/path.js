/**
* Script: path.js
* Written by: Radnen
* Updated: 6/30/2013
**/

/**
* Path Package
* ============================================
* - A convenience class for handling paths
*   For example, it can be used to get parts
*   of long paths such as root directories
*   or the names of saved files.
**/

var Path = (function() {
	var crumb  = /\\/g;
	var init   = /((\.\.)|(~))\//g;
	
	function Exists(path)
	{
		var parts    = path.replace(crumb, "/").replace(/\.\./, "~").split("/");
		var filename = parts.pop();
		var dir      = parts.join("/");
		var files    = GetFileList(dir);
		
		return List.contains(files, function(o) { return filename == o; });
	}
		
	function GetFileName(path) {
		return path.replace(crumb, '/').split('/').pop();
	}
	
	function GetRootDirectory(path) {
		var s = path.replace(init, '').replace(crumb, '/').split('/');
		return s.length > 1 ? s[0] : "";
	}
	
	function GetParentDirectory(path) {
		path = path.replace(crumb, '/');
		return path.slice(0, path.lastIndexOf('/'));
	}
	
	function GetSaveName(path) {
		return path.replace(crumb, '/').split('/').pop().split('.')[0];
	}
	
	function GetFileExt(path) {
		return path.replace(crumb, '/').split('/').pop().split('.')[1];
	}
	
	return {
		exists: Exists,
		getFileName: GetFileName,
		getFileExt: GetFileExt,
		getSaveName: GetSaveName,
		getParentDirectory: GetRootDirectory,
		getRootDirectory: GetRootDirectory,
		get filesystem() { return filesystem; }
	};
})();