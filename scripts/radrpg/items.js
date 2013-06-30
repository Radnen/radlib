/**
* Script: items.js
* Written by: Radnen
* Updated: 5/5/2012
**/

function Requirement(type, lvl)
{
	this.type = type;
	this.lvl = lvl;	
}

// these are properties all objects are assumed to have:
function Item(name, price, image, desc)
{
	this.name = name;
	this.price = price;
	this.image = Resources.images[image];
	this.desc = desc;
	this.type = "none";
	
	this.equip   = function(){};
	this.unequip = function(){};
	this.use     = function(){};
}

function Weapon(name, price, image, atk, req, desc)
{
	this.inherit = Item;
	this.inherit(name, price, image, desc);
	
	this.atk = atk;
	this.req = req;
	this.type = "weapon";
	
	this.equip = function() {
		Game.player.atk += this.atk;
	}
	
	this.unequip = function() {
		Game.player.atk -= this.atk;
	}	
}

function Armor(name, price, image, def, req, desc, type)
{
	this.inherit = Item;
	this.inherit(name, price, image, desc);
	
	this.def = def;
	this.req = req;
	this.type = type;
	
	this.equip = function() {
		Game.player.def += this.def;
	}
	
	this.unequip = function() {
		Game.player.def -= this.def;
	}
}

var Items = ({
	addItem: function(item) {
		this[item.name] = item;
	},
	
	getItem: function(name) {
		return this[name];
	}
});

/*
Items["null"] = null;
Items.addItem(new Weapon("Dagger", 8, "dagger", 5, new Requirement("str", 1), "Better than a butter knife."));
Items.addItem(new Weapon("Longsword", 16, "longsword", 7, new Requirement("str", 4), "A long and pointy sword."));
Items.addItem(new Armor("Green Shirt", 6, "shirt", 1, new Requirement("end", 0), "A nice green shirt.", "body"));
Items.addItem(new Armor("Chain Shirt", 6, "chainshirt", 6, new Requirement("end", 8), "A light chain shirt.", "body"));
Items.addItem(new Armor("Leather Cap", 10, "leathercap", 2, new Requirement("end", 2), "A snug leather cap.", "head"));
Items.addItem(new Armor("Leather Boots", 10, "leatherboots", 1, new Requirement("end", 2), "Warm leather boots.", "feet"));
Items.addItem(new Armor("Wooden Shield", 10, "woodshield", 2, new Requirement("end", 2), "A sturdy wooden shield.", "shield"));
*/