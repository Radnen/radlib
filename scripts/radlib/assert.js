/**
* Script: assert.js
* Written by: Andrew Helenius
* Updated: 3/27/2013
**/

/**
* Assert Package
* ============================================
* - Provides testing methods, used for
*   debugging, general correctness, and type
*   checking.
*/

var Assert = (function(){
	function Is(obj, other) {
		if (typeof other == "string") return typeof obj == other;
		if (typeof other == "object") return obj instanceof other;
	}
	
	function IsNullOrEmpty(str) {
		return !str || str == "";
	}
	
	function Equals(o1, o2) {
		return o1 === o2;
	}
	
	function IsArray(arr) {	
		return arr instanceof Array;
	}
	
	function True(test, message) {
		if (!test) Debug.log("Error: " + message);
	}

	function False(test, message) {
		if (test) Debug.log("Error: " + message);
	}
	
	function IsSphereObject(obj) {
		if (!obj) return false;
		switch (obj.toString()) {
			case "[object Image]":
			case "[object Font]":
			case "[object Spriteset]":
			case "[object Windowstyle]":
			case "[object Sound]":
				return true;
			break;
		}
		return false;
	}
	
	function fileExists(path, filename) {
		return List.contains(GetFileList(path), function(file) { return filename == file; });
	}
	
	return {
		assertFalse: False,
		assertTrue: True,
		equals: Equals,
		fileExists: fileExists,
		is: Is,
		isArray: IsArray,
		isNullOrEmpty: IsNullOrEmpty,
		isSphereObject: IsSphereObject
	};
})()