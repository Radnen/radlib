/**
* Script: people.js
* Written by: Radnen
* Updated: 5/14/2013
**/

const PI = Math.PI;

/**
* Advanced Entity Movement Engine
**/
var PeopleEngine = ({
	people: [],
	
	setBehavior: function(AI) {
		this.people.push({name: GetCurrentPerson(), ai: AI});
	},
	
	updatePeople: function() {
		var i = this.people.length;
		while(i--) {
			this.people[i].ai(this.people[i].name);
		}
	},
	
	purge: function() {
		this.people = [];
	},
});

// Returns an angle between 0 and 2PI, between two entities
function GetAngleBetweenEntities(person1, person2)
{
	var dx = GetPersonX(person1)-GetPersonX(person2);
	var dy = GetPersonY(person1)-GetPersonY(person2);
	
	return Math.atan2(dy, dx)+PI;
}

function GetAngleDirection(person1, person2)
{
	var angle = GetAngleBetweenEntities(person1, person2);
	
	if (angle > 5*PI/4 && angle < 7*PI/4) return "north";
	else if (angle > 3*PI/4 && angle < 5*PI/4) return "west";
	else if (angle > PI/4 && angle < 3*PI/4) return "south";
	else return "east";
}

// person "name" faces person "person".
function FacePerson(name, person)
{
	if (!person) person = Game.player.name;
	SetPersonDirection(name, GetAngleDirection(name, person));
}

function IsPersonInRadius(name, radius, person)
{
	radius = radius*radius;
	if (!person) person = Game.player.name;
	
	var dx = GetPersonX(name)-GetPersonX(person);
	var dy = GetPersonY(name)-GetPersonY(person);
	
	var dist = dx*dx+dy*dy;
	return (dist <= radius);
}

// A field is a 45deg arc about the facing direction.
function IsPersonInField(name, radius, person)
{
	if (person == undefined) player = ActionEngine.input;
	if (!IsPersonInRadius(name, radius, person)) return false;
		
	var angle = GetAngleBetweenEntities(name, person);
	var direction = GetPersonDirection(name);
	
	if (direction == "north" && (angle > 5*PI/4 && angle < 7*PI/4)) return true;
	else if (direction == "west" && (angle > 3*PI/4 && angle < 5*PI/4)) return true;
	else if (direction == "south" && (angle > PI/4 && angle < 3*PI/4)) return true;
	else if (direction == "east") return true;
	
	return false;
}

function OffsetPerson(name, x, y)
{
	if (name < 0) { name = GetCurrentPerson(); }
	SetPersonX(name, GetPersonX(name)+x);
	SetPersonY(name, GetPersonY(name)+y);
}