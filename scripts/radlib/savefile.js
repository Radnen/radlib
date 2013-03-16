/**
* Script: savefile.js
* Written by: Radnen
* Updated: 3/15/2013
**/

RequireScript("radlib/json2.js");

/**
* Savefile Package
* ============================================
* - A class that handles the storage and
*   retrevial of data in an elegant and fast
*   way. This is better than using Sphere's
*   default save file object.
*/

function SaveFile(name)
{
	this.content = {};	
	if (name) this.load(name);
}

/**
* store(key : string, value : object);
*  - Use this to save a value into the save file.
**/
SaveFile.prototype.store = function(key, value) {
	if (!Assert.is(key, "string")) {
		Debug.log("Store: Key not a string.", LIB_ERROR);
		return;
	}
	
	this.content[key] = value;
}

/**
* get(key : string, other : object);
*  - Use this to read in a value from the save file.
*  - 'object' is a default value in case nothing
*     was found;
**/
SaveFile.prototype.get = function(key, other) {
	if (!Assert.is(key, "string")) {
		Debug.log("Get: Key not a string.", LIB_ERROR);
		return other;
	}
	
	if (!(key in this.content)) {
		Debug.log(FormatString("Key {?} doesn't exist in file.", key), LIB_WARN);
		return other;
	}
	
	return this.content[key];
}

/**
* storeObject(key : string, value : object);
*  - Use this to store an object and preserve its type.
**/
SaveFile.prototype.storeObject = function(key, value) {
	this.store(key, Serialize(o));
}

/**
* getObject(key : string);
*  - Use this to perfectly recall an object.
**/
SaveFile.prototype.getObject = function(key) {
	return Deserialize(this.get(key, "{}"));
}

/**
* save(filename : string);
*  - Saves the save file to your storage device.
**/
SaveFile.prototype.save = function(filename) {
	if (!Assert.is(filename, "string")) { Debug.log("Filename not a string.", LIB_ERROR); return; }
	
	if (filename.indexOf(".") < 0) filename += ".sav";

	var file = OpenRawFile("~/other/" + filename, true);
	file.write(CreateByteArrayFromString(JSON.stringify(this.content)));
	file.close();

	Debug.log(FormatString("Saved File: {?}", filename), LIB_GOOD);
}

/**
* load(filename : string);
*  - Opens and reads in the contents of the save file.
**/
SaveFile.prototype.load = function(filename) {
	if (!Assert.is(filename, "string")) { Debug.log("Filename not a string.", LIB_ERROR); return; }

	if (filename.indexOf(".") < 0) filename += ".sav";

	if (!Assert.fileExists("~/other/", filename)) {
		Debug.log(FormatString("File {?} doesn't exist!", filename), LIB_ERROR);
		return;
	}
	
	var file = OpenRawFile("~/other/" + filename);
	this.content = JSON.parse(CreateStringFromByteArray(file.read(file.getSize())));
	file.close();
	
	Debug.log(FormatString("Loaded File: {?}", filename), LIB_GOOD);
}