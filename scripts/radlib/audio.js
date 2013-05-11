/**
* Script: audio.js
* Written by: Radnen
* Updated: 5/10/2013
**/

/**
* Audio Package
* ============================================
* - Provides easy access into sphere's audio
*   library.
*/

RequireScript("RadLib/tween.js");

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
    var volume_tween = new Tween();	
    
    /**
    * Play(filename : string);
    *  - Streams music from your storage device.
    **/
    function Play(filename) {
        if (!Assert.checkArgs(arguments, "string")) return;
        
        /*if (!Assert.fileExists(Audio.musicPath, filename)) {
            Debug.log("Music file '{?}' does not exist.", filename, LIB_WARN);
            return;
        }*/
        
        if (songs[0]) songs[0].music.stop();
        
        var s = new Song(filename);
        s.music.play(true);
        s.music.setVolume(Audio.volume);
        songs[0] = s;
    }
    
    function FadeIn(time)
    {
        volume_tween.setup(0, 255, time, Tweens.quad);
    }
    
    function FadeOut(time)
    {
        volume_tween.setup(255, 0, time, Tweens.quad);
    }
    
    function Update()
    {
        if (songs[0] && volume_tween.update()) {
            songs[0].music.setVolume(volume_tween.value);
		}
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
        sound.setVolume(Audio.svolume);
    }
	
    /**
    * SetVolume(value : number);
    *  - Sets the volume to the corresponding value.
    **/
	function SetVolume(value) {
		if (value < 0)   { Debug.log("Invalid music volume: {?}", value, LIB_WARN); value = 0;   }
		if (value > 255) { Debug.log("Invalid music volume: {?}", value, LIB_WARN); value = 255; }
		if (songs[0]) songs[0].music.setVolume(value);
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

        savefile.store("Audio.volume", this.volume);
        savefile.store("Audio.svolume", this.svolume);
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
        
        this.volume = savefile.get("Audio.volume", 255);
        this.svolume = savefile.get("Audio.svolume", 255);
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
        stop: Stop,
        save: Save,
		setVolume: SetVolume,
        svolume: 220,
        volume: 240
    }
})();