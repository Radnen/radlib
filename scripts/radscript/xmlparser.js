/**
* Script: xmlparser.js
* Written by: Radnen
* Updated: 3/29/2012
**/

// XML reader
var XMLReader = (function() {
	
	/******************************************
	* Parse Layer: open and read an xml file. *
	*******************************************/
	function parseFile(filename) {
		file = OpenRawFile(filename);
		var text = CreateStringFromByteArray(file.read(file.getSize()));
		file.close();
		return this.parseText(text);
	}
	
	function parseText(text, start) {
		if (start === undefined) start = 0;
		
		var pos = text.indexOf("<", start);
		var elem = new Element();
		
		// Find element separators:
		var carrot_end = text.indexOf(">", pos);
		var space_end = text.indexOf(" ", pos);
		var contains_slash = text.charAt(carrot_end - 1) == "/";
		var contains_startslash = text.charAt(pos + 1) == "/";
		pos++;
		
		// Get name of element:
		if (contains_slash) {
			elem.name = text.substr(pos, space_end - pos);
			elem.end = carrot_end;
			
			//Utility.alert(elem.name + " is early-escaped");
			
			return elem; // an early-escaped element.
		}
		
		if (contains_startslash) {
			elem.name = text.substr(pos, carrot_end - pos);
			elem.end = carrot_end;
			return elem; // an ending element.
		}

		if (carrot_end < space_end) {
			elem.name = text.substr(pos, carrot_end - pos);
		}
		else {
			elem.name = text.substr(pos, space_end - pos);
			
			// Get Attributes: (btwn space and carrot end):
			var equals_end, quote_end, attribute;
			while (space_end < carrot_end) {
				equals_end = text.indexOf("=\"", space_end);
				quote_end = text.indexOf("\"", equals_end+2);
				
				attribute = new Attribute();
				attribute.name = text.substr(space_end + 1, equals_end - space_end - 1);
				attribute.value = text.substr(equals_end + 2, quote_end - equals_end - 2);
				elem.attributes.push(attribute);
				
				// Utility.alert("Added attribute: \"" + attribute.name + "\"=\"" + attribute.value + "\" to: " + elem.name);

				space_end = text.indexOf(" ", quote_end);
			}
		}
		
		// Get Inner Text:
		var carrot_start = text.indexOf("<", carrot_end);
		if (carrot_start != -1) {
			elem.innerText = text.substr(carrot_end + 1, carrot_start - carrot_end - 1);
			elem.innerText = elem.innerText.replace("\t", "", "g");

			var elem2 = this.parseText(text, carrot_start);
			while (elem2.name != "/"+elem.name) {
				elem.children.push(elem2);
				elem2 = this.parseText(text, elem2.end);
			}
			
			elem.end = elem2.end;
			// Utility.alert("Finished: " + elem.name + "\n" + elem.innerText);
			return elem;
		}
		else throw "Invalid tag ending for node starting: " + elem.name;
	}

	/*************************************************
	* Base Element Layer: used for storing XML data. *
	**************************************************/
	function Element()
	{
		this.end = 0;
		this.name = "";
		this.innerText = "";
		this.children = [];
		this.attributes = [];
	}
	
	function Attribute()
	{
		this.name = "";
		this.value = 0;
	}
	
	/************
	* Interface *
	*************/
	return {
		parseFile: parseFile,
		parseText: parseText
	}
})();