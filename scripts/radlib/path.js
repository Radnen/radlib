/**
* Script: path.js
* Written by: Andrew Helenius
* Updated: 3/27/2013
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
	function GetFileName(path) {
		return path.replace(/\\/g, '/').split('/').pop();
	}
	
	function GetRootDirectory(path) {
		var s = path.replace(/\\/g, '/').split('/');
		
		if (s.length > 1)
			return s[s.length - 2];
		else
			return s[0];
	}
	
	function GetSaveName(path) {
		return path.replace(/\\/g, '/').split('/').pop().split('.')[0];
	}
	
	function GetFileExt(path) {
		var parts = path.split('.');
		return parts[parts.length - 1];
	}

	
	return {
		getFileName: GetFileName,
		getFileExt: GetFileExt,
		getSaveName: GetSaveName,
		getRootDirectory: GetRootDirectory,
	};
})();