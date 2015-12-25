# Embedding [Torrents Time](https://torrents-time.com)
Torrents Time is a one of a kind fully customizable bittorrent client, advanced video player and downloads manager which is installed directly on the browser.
Embeding Torrents Time in your website enables you to offer a unique, amazing and one of a kind experience to your websites' visitors.

Torrents Time was designed to fully support and enhance the needs of users on video streaming, downloads and torrents websites, while taking into consideration the needs and wants of those site owners to maximize the value they can gain from embedding Torrents Time on their site.

##Quick start  
Embedding Torrents Time is as simple as adding an `iframe` to your website
```html
<iframe src="https://embed.torrents-time.com/#source=TorrentURL&publisher_id=1"></iframe>
```
Or just even by linking to it directly using an `<a tag`
```html
<a href="https://embed.torrents-time.com/#source=TorrentURL&publisher_id=1">WATCH</a>
```
####Javascript API
For those who don't want to include any 3rd party elements on their site or just seek for some more advanced embedding options, we have created this super simple `Javascript` API which takes about 5 seconds to implement in your site:
```html
<script src="torrentstime.min.js"></script>
<script>
torrentsTime.init({publisher_id:1});
</script>
<div class="torrentsTime" data-setup='{"source": "torrentURL"}'></div>
```

## Settings
You can enhance Torrents Time by simply providing one or more of these optional parameters:
* `source` - **Required**, This is the URL or the magnet link of the torrent file, or any other static file on your server you wish to stream/download using Torrents Time.

* `publisher_id` - **Optional**, This is your unique Publisher ID, if you haven't [registered](http://publishers.torrents-time.com/) yet as a Torrents Time publisher, check out the reasons [why you should register](http://publishers.torrents-time.com/).

* `title` - **Optional**, Set the video/downloaded file title. If not specified, the title will get auto detected from file name or torrent info.

* `autoPlay` - **Optional**, Default: false. providing `true` as the value will auto stream or download the file.

* `imdbid` **Optional**, IMDB ID, If specified, Torrents Time will automatically search for poster images and subtitles across the web.
  
* `poster` **Optional**, The poster parameter sets the image(s) that displays before the video begins playing. As soon as the user clicks play the poster will go away.

####Example
For setting the parameters in the iframe/link URL:
```html
https://embed.torrents-time.com/#source=TorrentURL&title=VideoName&imdb=tt1254207&autoPlay=1&publisher_id=1
```

For using with the implemented Javascript:
```html
<script src="torrentstime.min.js"></script>
<script>
torrentsTime.init({publisher_id:1});
</script>
<div class="torrentsTime" data-setup='{"source": "torrentURL", "title": "VideoName", "imdbid": "tt1254207", "id": "myPlayer"}'></div>
```
<sub>You can set the parameters within the `torrentsTime.init` function or within the `data-setup` attribute of the containment `<div` element.  
The difference is that the parameters within the `torrentsTime.init` function will apply globably for all the Torrents Time instances embeded in the page and the parameters within the `data-setup` attribute will apply only for that specific instance.</sub>  
  
  
****
##Documentation
For more detailed info, please check out our short [Getting Started Guide](./docs/setup.md) to learn everything you need to know about our `Javascript API`.  
And if you're ready to dive in and discover more advanced options, the [documentation](./docs/index.md) is the first place to go for more information.
