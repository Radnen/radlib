/**
* Script: audio.js
* Written by: Radnen
* Updated: 6/29/2013
**/

/**
* Audio Package
* ============================================
* - Provides easy access into sphere's audio
*   library.
*/

RequireScript("RadLib/tween.js");

var Audio = (function() {
	var songs = [null, null];
	var vtween = new Tween();
	var done = false, mute = false;
	var volume = 240, svolume = 220;
	var maxVolume = 240;

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
		
	/**
	* Play(filename : string);
	*  - Streams music from your storage device.
	**/
	function Play(filename) {
		if (!Assert.checkArgs(arguments, "string")) return;
		
		if (!Path.exists(filename)) {
			Debug.log("Music file '{?}' does not exist.", filename, LIB_WARN);
			return;
		}
		
		if (songs[0]) songs[0].music.stop();
		
		var s = new Song(filename);
		s.music.play(true);
		s.music.setVolume(mute ? 0 : maxVolume);
		volume = maxVolume;
		songs[0] = s;
	}
	
	function FadeIn(time)
	{
		vtween.setup(0, maxVolume, time, Tweens.quad);
		done = false;
	}
	
	function FadeOut(time)
	{
		vtween.setup(maxVolume, 0, time, Tweens.quad);
		done = false;
	}
	
	function Update()
	{
		if (songs[0] && vtween.update()) {
			volume = vtween.value;
			songs[0].music.setVolume(mute ? 0 : volume);
		}
		done = vtween.isFinished();
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
	
	function ForceFinish() {
		vtween.forceFinish();
		volume = vtween.value;
		if (songs[0]) songs[0].music.setVolume(mute ? 0 : volume);
		done = true;
	}
	
	/**
	* PlaySound(sound : sound, [override : bool]);
	*  - Plays a sound object.
	*  - If override is false, it'll not stop the current sound.
	**/
	function PlaySound(sound, override) {
		if (override === undefined) override = true;
		
		if (!sound || sound.toString() != "[object sound]") {
			Debug.log("Not a sound: {?}", sound.toString(), LIB_ERROR);
			return;
		}
		
		if (override && sound.isPlaying()) sound.stop();
		sound.play(false);
		sound.setVolume(mute ? 0 : svolume);
	}
	
	/**
	* SetMaxVolume(value : number);
	*  - Sets the max music volume to the corresponding value.
	**/
	function SetMaxVolume(value) {
		if (value < 0)   { Debug.log("Invalid music volume: {?}", value, LIB_WARN); value = 0;   }
		if (value > 255) { Debug.log("Invalid music volume: {?}", value, LIB_WARN); value = 255; }
		maxVolume = value;
		vtween.to = vtween.value = value;
	}

	/**
	* SetVolume(value : number);
	*  - Sets the music volume to the corresponding value.
	**/
	function SetVolume(value) {
		if (value < 0)   { Debug.log("Invalid music volume: {?}", value, LIB_WARN); value = 0;   }
		if (value > 255) { Debug.log("Invalid music volume: {?}", value, LIB_WARN); value = 255; }
		volume = value;
		if (songs[0]) songs[0].music.setVolume(mute ? 0 : volume);
	}
	
	/**
	* SetSVolume(value : number);
	*  - Sets the max sound volume to the corresponding value.
	**/
	function SetSVolume(value) {
		if (value < 0)   { Debug.log("Invalid music volume: {?}", value, LIB_WARN); value = 0;   }
		if (value > 255) { Debug.log("Invalid music volume: {?}", value, LIB_WARN); value = 255; }
		svolume = value;
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
		var separate = false;
		
		if (!savefile) {
			separate = true;
			savefile = new SaveFile();
		}
		
		if (!Assert.checkArgs(arguments, SaveFile)) return;

		savefile.store("Audio.volume", maxVolume);
		savefile.store("Audio.svolume", svolume);
		savefile.store("Audio.music", GetMusicFilename());
		
		if (separate) savefile.save("audio");
	}
	
	/**
	* Load(savefile : SaveFile);
	*  - Loads the audio properties from a save file.
	*    good for writing custom options files.
	**/
	function Load(savefile) {       
		if (!savefile) savefile = new SaveFile("audio");
		if (!Assert.checkArgs(arguments, SaveFile)) return;
		
		maxVolume = savefile.get("Audio.volume", 255);
		svolume = savefile.get("Audio.svolume", 255);
		
		var music = savefile.get("Audio.music");
		if (!Assert.isNullOrEmpty(music)) Play(music);
	}
	
	return {
		getMusicFilename: GetMusicFilename,
		load: Load,
		fadeIn: FadeIn,
		fadeOut: FadeOut,
		update: Update,
		musicPath: "~/music/",
		play: Play,
		playSound: PlaySound,
		forceFinish: ForceFinish,
		setMaxMusicVolume: SetMaxVolume,
		setMaxSoundVolume: SetSVolume,
		setVolume: SetVolume,
		stop: Stop,
		save: Save,
		get done() { return done; },
		get volume() { return maxVolume; },
		get svolume() { return svolume; },
		get mute() { return mute; },
		set mute(value) { mute = value; if (songs[0]) songs[0].music.setVolume(value ? 0 : volume); }
	}
})();