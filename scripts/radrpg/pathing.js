/**
* Script: pathing.js
* Written by: Radnen
* Updated: 10/26/2010
**/

function GetPath(name, x, y, layer, TargetX, TargetY)
{
	// internal helper function:
	function CheckBlock(xOff, yOff, x, y, name)
	{	
		var x = (xOff+x) * GetTileWidth()  + 7;
		var y = (yOff+y) * GetTileHeight() + 7;
		return IsPersonObstructed(name, x, y);
	}
	
	// internal helper function:
	function IsPathValid(x, y, layer, path)
	{
		var lw = GetLayerWidth(layer), lh = GetLayerHeight(layer);
		return (x >= 0 && x < lw && y >= 0 && y < lh && path[x][y] == undefined);
	}
	
	if (x < 0 || y < 0) {
		x = Math.floor(GetPersonX(name)/GetTileWidth());
		y = Math.floor(GetPersonY(name)/GetTileHeight());
	}
	
	// Set up pathing array //
	var Path = [];
	var i = GetLayerWidth(layer);
	while(i--) Path[i] = new Array(GetLayerHeight(layer));
	
	var TempPath = [];
	var LastBlocks1 = [], LastBlocks2 = [];

	// Set Players position into array //
	LastBlocks1[0] = x;
	LastBlocks1[1] = y;
	
	// The players current position //
	var CurrentX = 0, CurrentY = 0;
	
	// Loop controls //
	var Found = false, Stop = false;
	var PathString = "";
	
	// Index trackers for LastBlocks 1 & 2 //
	var Counter1 = 0, Counter2 = 0, Round = 0;
	
	// Yes, accuse me of micro optimization. //
	while(!Found && !Stop) {
		while (LastBlocks1[Counter1<<1] != undefined) {
			CurrentX = LastBlocks1[(Counter1<<1)];
			CurrentY = LastBlocks1[(Counter1<<1)+1];
			
			if (!CheckBlock(-1, 0, CurrentX, CurrentY, name) && IsPathValid(CurrentX-1, CurrentY, layer, Path)) { // LEFT
				Path[CurrentX-1][CurrentY] = "E";
				LastBlocks2[Counter2<<1] = CurrentX-1;
				LastBlocks2[(Counter2<<1)+1] = CurrentY;
				Counter2++;
				
				if (CurrentX-1 == TargetX && CurrentY == TargetY) { Found = true; break; }
			}

			if (!CheckBlock(0, -1, CurrentX, CurrentY, name) && IsPathValid(CurrentX, CurrentY-1, layer, Path)) { // TOP
				Path[CurrentX][CurrentY-1] = "S";
				LastBlocks2[Counter2<<1] = CurrentX;
				LastBlocks2[(Counter2<<1)+1] = CurrentY-1;
				Counter2++;
				
				if (CurrentX == TargetX && CurrentY-1 == TargetY) { Found = true; break; }
			}
			
			if (!CheckBlock(1, 0, CurrentX, CurrentY, name) && IsPathValid(CurrentX+1, CurrentY, layer, Path)) { // RIGHT
				Path[CurrentX+1][CurrentY] = "W";
				LastBlocks2[Counter2<<1] = CurrentX+1;
				LastBlocks2[(Counter2<<1)+1] = CurrentY;
				Counter2++;
				
				if (CurrentX+1 == TargetX && CurrentY == TargetY) { Found = true; break; }
			}

			if (!CheckBlock(0, 1, CurrentX, CurrentY, name) && IsPathValid(CurrentX, CurrentY+1, layer, Path)) { // BOTTOM
				Path[CurrentX][CurrentY+1] = "N";
				LastBlocks2[Counter2<<1] = CurrentX;
				LastBlocks2[(Counter2<<1)+1] = CurrentY+1;
				Counter2++;
				
				if (CurrentX == TargetX && CurrentY+1 == TargetY) { Found = true; break; }
			}
			
			Counter1++;
		}

		// Reset Counters //
		Counter1 = 0;
		if (Counter2 == 0) Stop = true; // And stop round if unreachable.
		Counter2 = 0;
		
		// Move Information Over From LastBlocks2 //
		var i = 0;
		while (LastBlocks1[i] != undefined || LastBlocks2[i] != undefined) {
			if (LastBlocks2[i] != undefined) {
				LastBlocks1[i] = LastBlocks2[i];
				LastBlocks2[i] = undefined;
			}
			else LastBlocks1[i] = undefined;
			i++;
		}
		
		Round++;
	}
	
	if (Found) {
		CurrentX = TargetX; CurrentY = TargetY;
		for (var i = 0; i < Round; ++i) {
			if (CurrentX == x && CurrentY == y) break;
			
			if (Path[CurrentX][CurrentY] == "E") {
				TempPath[i] = "W";
				CurrentX++;
			}
			else if (Path[CurrentX][CurrentY] == "N") {
				TempPath[i] = "S";
				CurrentY--;
			}
			else if (Path[CurrentX][CurrentY] == "W") {
				TempPath[i] = "E";
				CurrentX--;
			}
			else if (Path[CurrentX][CurrentY] == "S") {
				TempPath[i] = "N";
				CurrentY++;
			}
		}
		
		PathString = "";
		
		var i = Round;
		while(i--) PathString += TempPath[i]; // flip order
	}
	else PathString = "";
	
	return PathString + "F";
}