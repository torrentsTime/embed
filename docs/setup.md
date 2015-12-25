[Torrens Time Documentation](./index.md)

#Getting started
>This guide is here to give information about embedding Torrents Time using the `Javascript` API. You can also embed Torrents Time on your web page by simply using an `iframe` or an `<a tag` if you prefer, see [README](./../README.md) for examples.
  
Torrents Time is pretty easy to set up. In just a few seconds you can get the plugin up and running on your web page.
  
##Step 1: Include the Javascript file in your web page
You can download the [torrentstime.min.js](./../torrentstime.min.js) source and host it on your own servers, or use the free CDN hosted version.
```html
<script src="torrentstime.min.js"></script>
```
#### CDN Version
For those who are OK with including 3rd party elements in their site, it is recommended to use the CDN version in order to ensure that the code is up to date at all times.
```html
<script src="//cdn.torrents-time.com/torrentstime.min.js"></script>
```  
  
##Step 2: Add an HTML Div tag to your page.
```html
<div class="torrentsTime" data-setup='{"source": "TorrentURL"}'></div>
```
In addition to the basic markup, Torrents Time needs a few extra pieces:  
  1. The `data-setup` attribute, contains one required `source` parameter and can have a few more optional parameters (in JSON format) for customizing Torrents Time to your needs. For more information see [Options guide](./options.md).
  
  2. The `class` attribute which contains the `torrentsTime` class name.

##Step 3: Initialize Torrents Time
Trigger the `torrentsTime.init` function to initialize Torrents Time
```html
<script>
torrentsTime.init()
</script>
```
If you are registered as a Torrents Time publisher, don't forget to include your publisher ID in the `torrentstime.init()` parameters
```html
<script>
torrentsTime.init({publisher_id: 1})
</script>
```
If you haven't registered as a Torrents Time publisher yet, check out the reasons [why you should](http://publishers.torrents-time.com).  
Except for the `publisher_id` parameter, the `torrentsTime.init` function contains more optional parameters for customizing Torrents Time to your needs.
For more info see [Options guide](./options.md).

##Full code
```html
<script src="//cdn.torrents-time.com/torrentstime.min.js"></script>
<script>
torrentsTime.init({publisher_id:1});
</script>
<div class="torrentsTime" data-setup='{"source": "torrentURL", "id": "myPlayer"}'></div>
```
****
See [Options guide](./options.md) for more advanced options.
