/**
* Script: path.js
* Written by: Andrew Helenius
* Updated: 3/25/2013
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
	function GetFileName(string) {
		var s = string.replace(/\\/g, '/');
		var parts = string.split('/');
		return parts[parts.length-1];
	}
	
	function GetRootDirectory(path) {
		var s = string.replace(/\\/g, '/');
		var parts = string.split('/');
		
		if (parts.length > 1)
			return parts[parts.length-2];
		else
			return path;
	}
	
	function GetFileExt(path) {
		var parts = string.split('.');
		return parts[parts.length - 1];
	}
	
	return {
		getFileName: GetFileName,
		getRootDirectory: GetRootDirectory,
		getFileExt: GetFileExt,
	};
})();