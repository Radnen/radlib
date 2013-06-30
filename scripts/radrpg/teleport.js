/**
* Script: teleport.js
* Written by: Radnen
* Updated: 11/5/2010
**/

/**
* Teleport(map, x, y [, direction, music]);
*  - map: map to change to.
*  - x: x position to teleport to.
*  - y: y position to tele port to.
*  - direction: optional direction to face.
*  - music: optional music to change to.
**/
function Teleport(map, x, y, direction, music)
{
	ChangeMap(map);
	
	var base = GetPersonBase(Game.player.name);
	var bw = base.x2-base.x1;
	var bh = base.y2-base.y1;
	
	SetPersonXYFloat(Game.player.name, x*GetTileWidth()+bw/2, y*GetTileHeight()+bh/2);
	
	if (direction)
		SetPersonDirection(Game.player.name, direction);
	
	if (music) Audio.play(music, true);
}