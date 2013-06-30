/**
* Script: savefile.js
* Written by: Radnen
* Updated: 5/27/2013
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
	if (name !== undefined) this.load(name);
}

/**
* store(key : string, value : object);
*  - Use this to save a value into the save file.
**/
SaveFile.prototype.store = function(key, value) {
	if (!Assert.checkArgs(arguments, "string")) return;
	this.content[key] = value;
}

/**
* get(key : string, other : object);
*  - Use this to read in a value from the save file.
*  - 'object' is a default value in case nothing
*     was found;
**/
SaveFile.prototype.get = function(key, other) {
	if (!Assert.checkArgs(arguments, "string")) return;
	
	if (!(key in this.content)) {
		Debug.log("Key '{?}' doesn't exist in file.", key, LIB_WARN);
		return other;
	}
	
	return this.content[key];
}

/**
* storeObject(key : string, value : object);
*  - Use this to store an object and preserve its type.
**/
SaveFile.prototype.storeObject = function(key, value) {
	if (!Assert.checkArgs(arguments, "string")) return;
	this.store(key, Serialize(o));
}

/**
* getObject(key : string);
*  - Use this to perfectly recall an object.
**/
SaveFile.prototype.getObject = function(key, other) {
	if (!Assert.checkArgs(arguments, "string")) return;
	var o = this.get(key, "");
	if (!Assert.isNullOrEmpty(o)) return Deserialize(o);
	else return other;
}

/**
* save(filename : string);
*  - Saves the save file to your storage device.
**/
SaveFile.prototype.save = function(filename) {
	if (!Assert.checkArgs(arguments, "string")) return;

	if (filename.indexOf(".sav") < 0) filename += ".sav";

	var file = OpenRawFile("~/save/" + filename, true);
	file.write(CreateByteArrayFromString(JSON.stringify(this.content)));
	file.close();

	Debug.log("Saved File '{?}'", filename, LIB_GOOD);
}

/**
* load(filename : string);
*  - Opens and reads in the contents of the save file.
**/
SaveFile.prototype.load = function(filename) {
	if (!Assert.checkArgs(arguments, "string")) return;

	if (filename.indexOf(".sav") < 0) filename += ".sav";

	if (!Path.exists("~/save/" + filename)) {
		Debug.log("File '{?}' doesn't exist!", filename, LIB_ERROR);
		return;
	}
	
	var file = OpenRawFile("~/save/" + filename);
	this.content = JSON.parse(CreateStringFromByteArray(file.read(file.getSize())));
	file.close();
	
	Debug.log("Loaded File '{?}'", filename, LIB_GOOD);
}