/**
* Script: hero.js
* Written by: Radnen
* Updated: 6/27/2013
**/

/**
* Generic Hero Object.
**/
function Hero()
{
	this.name      = "player";
	this.atk       = 0;
	this.def       = 0;
	this.inventory = [];
	this.hp        = new Stat(20);
	this.mp        = new Stat(10);
	this.level     = 0;
	this.exp       = new Stat(0);
	this.equipment = {};
	this.equipment["head"] = null;
	this.equipment["body"] = null;
	this.equipment["feet"] = null;
	this.equipment["shield"] = null;
	this.equipment["weapon"] = null;
	this.equipment["trinket"] = null;
	this.equipment["spell"] = null;
	this.coins = 0;
}
	
/**
* Attack Formula:
*  - Overload this method to have a unique formula.
*    The default formula is very generic.
**/
Hero.prototype.atkFunc = function() {
	return this.atk.value + this.lvl.value;
};

/**
* Defence Formula:
*  - Overload this method to have a unique formula.
*    The default formula is very generic.
**/	
Hero.prototype.defFunc = function() {
	return this.def.value + this.lvl.value;
};

/**
* this.compareRequirement(req);
*  - compares an item requirenent.
**/
Hero.prototype.compareRequirement = function(item) {
	return (this[item.req.type].max - item.req.lvl);
}

/**
* getDelta(stat, item);
*  - returns an equipped stat's modifier to compare to the item and stat.
*    if the number is less than 0 then there is a decrease and the item is
*    no good. Greater than 0 means its good; this is used by stat comparer.
**/
Hero.prototype.getDelta = function(stat, item) {
	var d = 0;
	
	if (this.equipment[item.type])
		d = Items[this.equipment[item.type]][stat];
	
	return item[stat]-d;
}

/**
* canEquip(item);
*  - checks to see if the current item can be equipped by the player entity.
*    determination based off of the requirement type. Used by stat comparer.
**/
Hero.prototype.canEquip = function(item) {
	if (!item || !item.reqs) return true;
	var i = item.reqs.length, req;
	while (i--) {
		req = item.reqs[i];
		if (this[req.type] < req.lvl) return false;
	}
	return true;
}

/**
* save(file);
*  - writes the entity to an opened file object.
*  - It does not flush or close the opened file.
**/
Hero.prototype.save = function(savefile) {
	savefile.store("Player", Serialize(this));
}

/**
* load(file);
*  - reads the entity from a file and applies changes.
*  - it does not close the opened file object.
**/
Hero.prototype.load = function(savefile) {
	return Deserialize(savefile.get("Player", "{}"));
}