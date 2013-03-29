/**
* Script: audio.js
* Written by: Radnen
* Updated: 3/29/2013
**/

/**
* Audio Package
* ============================================
* - Provides easy access into sphere's audio
*   library.
*/

var Audio = (function() {
	/**
	* internal: Song(filename : string);
	*  - generates a simple object that represents 
	*    a music file and filename.
	**/
	function Song(filename) {
		return {
			music: LoadSound(filename, true),
		  filename: filename
		};
	}
	
	var songs = [null, null];
	
	/**
	* Play(filename : string);
	*  - Streams music from your storage device.
	**/
	function Play(filename) {
		if (!Assert.checkArgs(arguments, "string")) return;
		
		if (!Assert.fileExists(Audio.musicPath, filename)) {
			Debug.log("Music file '{?}' does not exist.", filename, LIB_WARN);
			return;
		}
		
		if (songs[0]) songs[0].stop();
		
		var s = new Song(filename);
		songs[0] = s;
		s.music.play(false);
		s.music.setVolume(this.volume);
	}
	
	/**
	* Stop();
	*  - Stops playing the current song.
	**/
	function Stop() {
		if (songs[0]) {
			songs[0].music.stop();
			songs[0] = null;
		}
		else Debug.log("Redundant Audio Stop", LIB_WARN);
	}
	
	/**
	* PlaySound(sound : sound);
	*  - Plays a sound object.
	**/
	function PlaySound(sound) {
		if (!sound || sound.toString() != "[object sound]") {
			Debug.log("Not a sound: {?}", sound.toString(), LIB_ERROR);
			return;
		}
		
		if (sound.isPlaying()) sound.stop();
		sound.play(false);
		sound.setVolume(this.svolume);
	}
	
	/**
	* GetMusicFilename();
	*  - Grabs the filename of the current song.
	**/
	function GetMusicFilename() {
		if (!songs[0]) return "";
		return songs[0].filename;
	}
	
	/**
	* Save(savefile : SaveFile);
	*  - Saves the audio properties to a save file.
	*    good for writing custom options files.
	**/
	function Save(savefile) {
		if (!Assert.checkArgs(arguments, SaveFile)) return;

		savefile.store("Audio.volume", this.volume);
		savefile.store("Audio.svolume", this.svolume);
		savefile.store("Audio.music", GetMusicFilename());
	}
	
	/**
	* Load(savefile : SaveFile);
	*  - Loads the audio properties from a save file.
	*    good for writing custom options files.
	**/
	function Load(savefile) {
		if (!Assert.checkArgs(arguments, SaveFile)) return;
		
		this.volume = savefile.get("Audio.volume", 255);
		this.svolume = savefile.get("Audio.svolume", 255);
		var music = savefile.get("Audio.music");
		if (!Assert.isNullOrEmpty(music)) Play(music);
	}
	
	return {
		getMusicFilename: GetMusicFilename,
		load: Load,
		musicPath: "~/music/",
		play: Play,
		playSound: PlaySound,
		stop: Stop,
		save: Save,
		svolume: 220,
		volume: 240
	}
})();