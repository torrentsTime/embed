[Torrents Time Documentation](./index.md)

#API
The Torrents Time API allows you to interact with the plugin through JavaScript.

##Initialize
First, trigger the `torrentsTime.init` function to start the plugin's initialization process.
The `init` function will embed the plugin `object` in the DOM and will prepare everything you need in order to interact with the plugin.
```javascript
torrentsTime.init();
```

While initializing, Torrents Time will trigger several key functions that you can use as event listeners.

####initEnded
Will anounce the completion of prepration process.
```javascript
torrentsTime.functions.initEnded = function(){
	//The Initialization process completed

	Alert("Is Torrents Time installed: " + torrentsTime.setup.isInstalled)
};
```
####deviceIsNotSupported
Will announce that the user's device is not supported by Torrents Time.
If not supported device is detected, Torrents Time will remove every `class="torrentsTime"` element from the DOM by default.
You can overwrite this behavior by setting your own function for this event:
```javascript
torrentsTime.functions.deviceIsNotSupported = function(){
	Alert("Sorry, Your device is not support by Torrents Time :(");
};
```

####initialized
If the device is supported and the plugin is installed on the user's browser,
Torrents Time will embed the plugin `object` in the DOM and will trigger this function at the moment the plugin is ready for interaction.
```javascript
torrentsTime.init();

torrentsTime.functions.initialized = function( instance ){
	Alert("The Torrents Time instance: " + instance.id + ", is ready for interaction!");
};
```

##interaction
You can interact directly with any Torrents Time instance embedded in the page, by specifying its `instance id`.
You can set the `id` for each instance by passing it in the option parameters inside the `data-setup` attribute of the containment div:
```html
<div class="torrentsTime" data-setup='{"id":"myPlayer", "source": "torrentURL"}'></div>
```
>If the `id` parameter is not specified, the `instance id` will be generated automatically and it will consist of the letter `i` followed by an ascending digit.  
>For example, if you embedded only one instance in your web page and you didn't specify an `id` parameter, the instance id will be set automatically as `i0`
  
After the plugin is embedded in the page, you can access the embedded instance methods and properties. For example:
```javascript
torrentsTime.myPlayer.play();
```
It is possible to reach all the embedded instances in the page by referring to `torrentsTime.instances`
```javascript
var TTinstances = torrentsTime.intances;

//example for pausing all Torrents Time instances at once:
for(var instance in TTinstances){
	TTinstances[ instance ].pause();
}
```
###Instance methods
* [start](#start)
* [beforeStart](#beforestart)
* [play](#play)
* [pause](#pause)
* [stop](#stop)
* [mute](#mute)
* [setVolume](#setvolume)
* [seek](#seek)
* [setFullScreen](#setfullscreen)

####start
The start function will initiate the download process of the file.
This function will be triggered programmatically, or upon user interaction as soon as user hits play.
```javascript
torrentsTime.myPlayer.start()
```

####beforeStart
Just before Torrents Time is actually starting the download, you have the chance to execute your own code.
You can do so, by adding functions to the `beforeStart` object. In a case your function will return `false` as value, the download process will be prevented. For example:
```javascript
torrentsTime.myPlayer.beforeStart.showAdvertisement = function(){
	return confirm('Yes this is a fucking annoying advertisement, just for testing purposes, please do not actually use it in your site! \nDo you want to proceed? ');

	//let’s not show this ad like... EVER!
	delete torrentsTime.myPlayer.beforeStart.showAdvertisement;
}
```

####play
Start playing / download
```javascript
torrentsTime.myPlayer.play()
```

####pause
Pause playback / download
```javascript
torrentsTime.myPlayer.pause()
```

####stop
Stop the playback / download
```javascript
torrentsTime.myPlayer.stop()
```

####mute
`Boolean`
```javascript
torrentsTime.myPlayer.mute(true)
```

####setVolume
`0-100`
```javascript
torrentsTime.myPlayer.setVolume(85)
```

####seek
`seconds`
```javascript
torrentsTime.myPlayer.seek(612)
```

####setFullScreen
`Boolean`
```javascript
torrentsTime.myPlayer.setFullScreen(true)
```

####displayPoster
You can add / update the poster images even after the plugin is loaded and then trigger the `displayPoster` function to update the view
```javascript
torrentsTime.myPlayer.setup.poster = "changePoster.png";
torrentsTime.myPlayer.displayPoster()
```

###Instance properties
* [id](#id)
* [wrapper](#wrapper)
* [setup](#setup)


####id
You can grab the `id` string from any instance object
```javascript
var instance_id = torrentsTime.myPlayer.id
```

####wrapper
A reference to the instance's containment div DOM element
```javascript
var wrappaer_div = torrentsTime.myPlayer.wrapper;
```

####setup
An object containing all the options parameters that were set up at the initialize stage
```javascript
console.log( torrentsTime.myPlayer.setup );
```


##Listeners function
You can set up listeners function that will be triggered upon events.
* [preload_started](#preload_started)
* [preload_ongoing](#preload_ongoing)
* [preload_complete](#preload_complete)
* [playback_complete](#playback_complete)
* [paused](#paused)
* [stopped](#stopped)
* [load_status](#load_status)
* [playback_time](#playback_time)
* [volume_changed](#volume_changed)
* [fullscreen_changed](#fullscreen_changed)
* [vpn_status](#vpn_status)
* [crashed](#crashed)
  
####preload_started
```javascript
torrentsTime.function.preload_started = function( params ){
	var instance_id = params.id
}
```

####preload_ongoing
Gives indication on streaming preloading
```javascript
torrentsTime.function.preload_ongoing = function( params ){
	var instance_id = params.id;
	var percent = params.percent //int
	var seeders = params.seeders //int
	var peers = params.peers //int
	var speed = params.speed //int (bytes)
}
```

####playback_complete
The video playback is completed
```javascript
torrentsTime.function.playback_complete = function( params ){
	var instance_id = params.id
}
```

####preload_complete
Preload is completed and the video is starting to play
```javascript
torrentsTime.function.preload_complete = function( params ){
	var instance_id = params.id
}
```

####paused
Playback / download has paused
```javascript
torrentsTime.function.paused = function( params ){
	var instance_id = params.id
}
```

####stopped
Playback / download has stopped
```javascript
torrentsTime.function.stopped = function( params ){
	var instance_id = params.id
}
```

####load_status
```javascript
torrentsTime.function.load_status = function( params ){
	console.log( params );
}
```


####playback_time
```javascript
torrentsTime.function.playback_time = function( params ){
	var instance_id = params.id
	console.log( params );
}
```


####volume_changed
```javascript
torrentsTime.function.volume_changed = function( params ){
	var instance_id = params.id
	var level = params.state;
}
```

####fullscreen_changed
```javascript
torrentsTime.function.fullscreen_changed = function( params ){
	var instance_id = params.id
	var isFullScreen = params.state
}
```


####vpn_status
Indicates if the VPN status has changed
* `0` - VPN is not installed
* `1` - VPN is deactivated
* `2` - VPN is turned off
* `3` - VPN is turned on

```javascript
torrentsTime.function.fullscreen_changed = function( params ){
	var instance_id = params.id
	var VPN_status = params.state;
}
```


####crash
An unexpected error occurred.
Try to re-initialize the whole process
```javascript
torrentsTime.function.crash = function( params ){
	var instance_id = params.id
}
```
