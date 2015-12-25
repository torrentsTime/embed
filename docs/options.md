[Torrents Time Documentation](./index.md)

#Options
##Setting options
You can set options parameters within the `torrentsTime.init` function or within the `data-setup` attribute of the containment `<div` element.  
The difference is that the parameters within the `torrentsTime.init` function will apply globally for all Torrents Time instances embedded in the page and the parameters within the `data-setup` attribute will apply only for that specific instance.

Example of passing options with the `data-setup` attribute in a JSON format:
```html
<div class="torrentsTime" data-setup='{"source": "torrentURL", "poster": "https://image.tmdb.org/t/p/w1000/aHLST0g8sOE1ixCxRDgM35SKwwp.jpg"}'></div>
```

Example of passing options in an object with the javascript `torrentsTime.init` function:
```html
<script>
torrentsTime.init({publisher_id:1, autoPlay: true})
</script>
```

##Parameters
All parameters are optional except for the `source` parameter that tells Torrents Time what file to stream or download.
><sub>Every parameter in that list can be passed through the URL in case you are embedding Torrents Time using an `iframe` or an `<a tag`. See [README](./../README.md) for more details.</sub>

<sub>
* [source](#source)
* [title](#title)
* [autoPlay](#autoplay)
* [imdbid](#imdbid)
* [poster](#poster)
* [querySelector](#queryselector)
* [id](#id)
* [tmdb_key](#tmdb_key)
* [subtitles](#subtitles)
* [file](#file)
* [videoPlayer](#videopLayer)
* [style](#style)
* [publisher_id](#publisher_id)
* [vpnAlert](#vpnalert)
</sub>
  
###source  
This is the URL or the magnet link of the torrent or any other static file on your server you wish to stream / download.
```javascript
{ "source": "https://torcache.net/torrent/88594AAACBDE40EF3E2510C47374EC0AA396C08E/[kat.cr]big.buck.bunny.1080p.30fps.torrent"}
```

###title
Set the file title. If not specified, the title will get auto detected from file name or torrent info.
```javascript
{ "title": "Big Buck Bunny" }
```

###autoPlay  
`Default: false`. Providing `true` as the value will auto stream or download the file.
```javascript
{ "autoPlay": true }
```

###imdbid
IMDB ID, If specified, Torrents Time will automatically search for posters and subtitles across the web.
```javascript
{ "imdbid": "tt1254207" }
```

###poster
The poster parameter sets the image(s) that displays before the video starts playing. As soon as the user hits play the poster will disappear.  
If a valid `imdbid` parameter is specified, Torrens Time will fetch poster images automatically from the web.
You can set the poster image yourself by simply passing a URL for an image file.  
In case you wish to display multiple poster images (each one displaying for 5 seconds) you should pass an `Array` of images URLs
  
Example of setting up a single poster image:
```javascript
{ "poster": "imageFile.png" }
```

Example of setting up multiple poster images:
```javascript
{ "poster": ["imageFile1.png", "imageFile2.png"] }
```
> You can dynamically change the poster images, even after the plugin was loaded  
using the [`displayPoster` method](./api_usage.md#displayposter) provided with the API
  
###querySelector
By default, Torrents Time plugin will be embedded directly inside any DOM element with a `class="torrentsTime"` attribute.
If you wish to change this, you can specify another selector string that will be used for DOM elements you wish to embed Torrents Time inside of.
The selector string should be a valid CSS2 selector.
```html
<script>
torrentsTime.init({ querySelector: "#embedHere" })
</script>
<div id="embedHere" data-setup='{"source": "torrentURL"}'></div>
```
###id
If you have more than 1 instance of Torrents Time embedded in your page, you can specify an ID for each of them in order to make it easy for you to later interact with each instance.
```html
<div class="torrentsTime" data-setup='{"id":"foo", "source": "foofile.torrent"}'></div>
<div class="torrentsTime" data-setup='{"id":"bar", "source": "barfile.torrent"}'></div>
<script>
torrentsTime.init();
torrentsTime.foo.start();
</script>
```
In a case you will not specify an `id` parameter for a Torrents Time instance, that instance `id` will be set automatically.  
For more information on interaction with embedded instances see our [API usage guide](./api_usage.md)
  
###tmdb_key
If you have your own API key from [themoviedb.org](https://www.themoviedb.org/documentation/api) you can specify it in this parameter and Torrents Time will be able to fetch additional data and poster images from [themoviedb.org](https://www.themoviedb.org/documentation/api) API
```javascript
{ "tmdb_key": "YourApiKey" }
```

###subtitles
If a valid `imdbid` parameter is specified, Torrents Time will fetch subtitles automatically from the web.
In case you wish to provide subtitles of your own, you can specify a URL for a single `.srt` or `.vtt` file or for a `.zip` containing multiple `.srt` or `.vtt` files.
```javascript
{ "subtitles": "subtitles.zip" }
```

###file
For torrents which contain more than one file, you can specify a specific file to stream or download
```javascript
{ "file": "movie.mp4" }
```
  
###videoPlayer
`Default: false`
If you specified a video torrent or a video file as a source for Torrents Time, the plugin will automatically display a video player and start to stream the video.
In a case you just wish to download the torrent without playing the video, you can set the value to `false`.
```javascript
{ "videoPlayer": false }
```

###Style
You can overwrite basic style options
* backgroundColor `Default: #333333`
* textColor `Default: #ffffff`
* textSize `Default: 14px`
* buttonBgColor `Default: rgba(0,0,0,0.7)`
* buttonHoverColor `Default: #2F6FD6`
* barBgColor `Default: rgba(0,0,0,0.9)`
```javascript
{ "style": { "backgroundColor": "#000", "textColor": "#ccc", "textSize": "16px" } }
```
> For additional styling options you will need to edit the [Javascript source](./../torrentstime.js) file. Look for the `injectCss()` function.

###publisher_id
This is your unique Publisher ID, if you haven't [registered](http://publishers.torrents-time.com/) yet as a Torrents Time publisher, check out the reasons [why you should](http://publishers.torrents-time.com/).
```javascript
{ "publisher_id": 1 }
```

###vpnAlert
`Default: true`  
If not disabled by the user, Torrents Time displays a warning message upon downloading if a VPN connection is not activated.
You can disable this message yourself by setting `false` as value.
```javascript
{ "vpnAlert": false }
```
****
See [API usage guide](./api_usage.md) to learn how to interact with Torrents Time.
