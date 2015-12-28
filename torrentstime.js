(function(){

	var TT = window.torrentsTime = {};

	TT.setup = {
		tmdb_key:			"57983e31fb435df4df77afb854740ea9",
		isDeviceSupported:	null,
		platform:			null,
		browser:			null,
		isInstalled:		null,
		port:				null,
		publisher_id:		null,
		querySelector:		".torrentsTime",
		id:					null,
		source:				null,
		file:				null,
		fileType:			"video",
		isHidden:			false,
		videoPLayer:		true,
		vpnAlert:			true,
		autoPlay:			false,
		title:				null,
		poster:				null,
		imdbid:				null,
		subtitles:			null,
		style:				{
			backgroundColor:	"#333333",
			textColor:			"#ffffff",
			textSize:			"14px",
			buttonBgColor:		"rgba(0,0,0,0.7)",
			buttonHoverColor:	"#2F6FD6",
			barBgColor:			"rgba(0,0,0,0.9)"

		},

		installerURL:	{
			windows:			"https://cdn.torrents-time.com/torrentsTime-download.exe",
			macintosh:			"https://cdn.torrents-time.com/torrentsTime-download.pkg"
		},
		localhost_domain: "localhost.ttconfig.xyz"
	}


	TT.init = function(settings){

		if(settings instanceof Object){
			for(var i in settings)
				TT.setup[i] = settings[i];
		}


		if(!isDeviceSupported())
			return TT.functions.deviceIsNotSupported();

		DOMReady(function(){

			wrappers = document.querySelectorAll( TT.setup.querySelector );
			if(!wrappers || !wrappers.length)
				return;

			injectCss();


			TT.instances = TT.instances || {};
			for(var i=0; i<wrappers.length; i++){

				var instance = new TTinstance(wrappers[i]);
				instance.id = instance.setup.id || "i"+i;
				TT.instances[instance.id] = TT[instance.id] = instance;
				insertInitScreen(instance);

				//currently supporting only 1 instance per page... so let's stop here please :)
				break;
			}


			TT.isInstalled(function( installed ){
				if(installed) embedTorrentsTime();

				 if(typeof TT.functions.initEnded == 'function')
					TT.functions.initEnded();
			}, 10)

		});

	};


	TT.functions = {

		deviceIsNotSupported: function(){
			DOMReady(function(){
				try{
					var el = document.querySelectorAll( TT.setup.querySelector );
					for(var i=0; i<el.length; i++)
						el[i].parentNode.removeChild(el[i])
				}
				catch(e){}
			})
		},

		plugin_loaded: function(params){
			var instance = TT.instances[params.id];
			instance.plugin.isInitialized = true;

			TT.setup.vpn_state = params.vpn_state;

			if(typeof TT.functions.initialized == 'function')
				TT.functions.initialized(instance);

			if(typeof TT.instances[params.id].loaded == 'function')
				TT.instances[params.id].loaded();
		}
	};

	TT.isInstalled = function(callback, limit, counter){

		callback = callback || function(){};
		limit = limit || 0;
		counter = counter || 0;

		if(limit && counter>limit){
			callback(false)
			return;
		}

		var
		ports 			= ["12400","11400","10400","9400"],
		imgs 			= [],
		cacheBuster 	= Math.random(),
		timer 			= setTimeout(function() { TT.isInstalled(callback,limit, ++counter);}, 1000);


		for(var i=0; i<ports.length; i++){
			imgs[i] = new Image();
			imgs[i].onload = function(){

				TT.setup.isInstalled 	= true;
				TT.setup.port			= this.getAttribute('data-port');
				callback(true);
				clearTimeout(timer);
			};
			imgs[i].onerror = function(){ utils.log(this) };
			imgs[i].setAttribute("data-port", ports[i]);
			imgs[i].src="https://" + TT.setup.localhost_domain + ":" + ports[i] + "/check?version=r1" //&cb=" + cacheBuster;

		}

	}

	TT.downloadInstaller = function(){
		var iframe = document.createElement("iframe");
		iframe.setAttribute("src", TT.setup.installerURL[ TT.setup.platform ]);
		iframe.style.display='none'
		document.getElementsByTagName('body')[0].appendChild(iframe);
		TT.setup.autoPlay=true;
		TT.isInstalled(function(){
			
		for(var instance in TT.instances)
				TT.instances[instance].wrapper.firstChild.className += ' installing';
				
			var stage = TT.setup.browser=='chrome' ? 1:2;
			var handler = function(callback){
				var img = new Image();
				img.onload = function(){
					if(TT.setup.browser=='firefox') navigator.plugins.refresh();
					callback();
				};
				img.onerror = function(){setTimeout(function(){handler(callback)},800)};
				img.src="https://" + TT.setup.localhost_domain + ":" + TT.setup.port + "/check_complete?stage=" + stage + "&cb=" + Math.random();
			}

			handler(TT.init)
		});
		
		for(var instance in TT.instances)
			if(TT.instances[instance].wrapper.firstChild.className.indexOf('_tt_setupDownload') == -1)
				TT.instances[instance].wrapper.firstChild.className += ' _tt_setupDownload';			
	}

	var
	TTinstance = function(wrapper){

		var
		customSettings 	= {},
		setupAttr		= wrapper.getAttribute('data-setup');

		if(setupAttr){
			try{
				customSettings = JSON.parse(setupAttr);
			}
			catch(e){utils.log(e)}
		}

		this.wrapper = wrapper;
		this.setup = {};
		this.start = start;
		this.beforeStart = {};

		for(var key in TT.setup)
			this.setup[key] = (typeof customSettings[key] != 'undefined') ? customSettings[key] : TT.setup[key];
	},
	isDeviceSupported = function(){

		if(TT.isDeviceSupported)
			return true;

		if(typeof document.querySelector == 'undefined')
			return false;

		if(typeof document.querySelectorAll == 'undefined')
			document.querySelectorAll = document.querySelector;

		var
		userAgent = navigator.userAgent,
		browser = userAgent.match(/chrome|firefox|safari|trident/i);
		if(!browser || !(browser instanceof Array))
			return false;

		TT.setup.browser = browser[0].toLowerCase();

		var platform = userAgent.match(/windows|macintosh/i);
		if(!platform || !(platform instanceof Array))
			return false;

		if(userAgent.indexOf("Windows Phone")>-1 || userAgent.indexOf("iemobile")>-1)
			return false;


		TT.setup.platform = platform[0].toLowerCase();

		//Duct tape: currently supporting only chrome on Mac
		//Safari and firefox are around the corent
		if(TT.setup.platform=='macintosh' && TT.setup.browser!='chrome')
			return false;

		TT.setup.isDeviceSupported = true;
		return true;
	},
	injectCss = function(){
		var css = {
			"._tt_wrapper":{
				width: 			"100%",
				height:			"100%",
				"min-height":	"250px",
				"min-width":	"300px",
				position:		"relative",
				background:		TT.setup.style.backgroundColor,
				overflow:		"hidden"
			},
			"._tt_initScreen":{
				height:			"100%",
				overflow:		"hidden",
				cursor:			"pointer"
			},
			"._tt_initScreen ._tt_topbar":{
				"font-size":	TT.setup.style.textSize,
				padding:		"10px;",
				background:		"linear-gradient(to top, rgba(0,0,0,0) 0%, " + TT.setup.style.barBgColor + " 100%)",
				"font-weight":	"bold",
				position:		"relative",
				"z-index":		10
			},
			"._tt_initScreen ._tt_button":{
				position:		"absolute",
				width:			"120px",
				height:			"90px",
				overflow:		"hidden",
				margin:			"-45px 0 0 -60px",
				top:			"50%",
				left:			"50%",
				"border-radius": "10px",
				background:		TT.setup.style.buttonBgColor,
				"z-index":		10
			},
			"._tt_initScreen ._tt_hover":{
				position:		"absolute",
				width:			"2px",
				height:			"2px",
				margin:			"-1px 0 0 -1px",
				top:			"50%",
				left:			"50%",
				"border-radius": "150px",
				background:		TT.setup.style.buttonHoverColor,
				"transition": 	"all 0.15s ease-out",
				"z-index":		11
			},
			"._tt_initScreen:hover ._tt_hover":{
				width:			"150px",
				height:			"150px",
				margin:			"-75px 0 0 -75px"
			},
			"._tt_setupDownload ._tt_hover":{
				display:		"none"
			},
			"._tt_initScreen ._tt_icon":{
				width: 			"100%",
				height: 		"100%",
				background: 	"url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAA8CAYAAADL94L/AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAbdJREFUeNrcmu1twjAURZ0oA3QE2IBu0G7QblA2oBMUJqAb0A1gA9ig2YBsABu8+kqxGrVQ3Mhf913JP8iPiBOf+NmxjYjc2baX7xxtezCM+QEyDK5P2GBuZYne0wLj1HvSAsOhnoxLmerJ+EC9Fy0wQ/VmWmBc1tnVk7A5ZVVP4iSPehI3adWT+EmnnqTLZ/QJrKTPJpZ6dYYxB8qh4C5C37jCo8pYGVrbXquqOmiAcfnooc5smkVTr5SeGaazbT5GvdqUF6yXMIPY/nftVCKMC1a2qE1LZs1Gq1cbjnipxwLjpR6LZtfUQ23aaYBxwXv0jIJbG/5gJv6mpWdcprXRk4kmGKMJ5qwF5mBHs1bDAIA10L2F6dh75h2jGEDwoyEulKj+7fAiG8yvKQwrzApa/fWdoCFRau7eC9Y60/UTyEcfkJJ75qZSDDDeSpUM47XGL/2dgUYrCzEN8Yk2Z8/s+prRhbphw6pUbs2CKnUxiTaYtkmOqdBv/SWAOcXYGcsBs8l2UoNWqUgweZSKAJNPqYAw+yJP2FKdWgoIs5bST9FSnfTzgDlSKnUFZtb/cS6lLuRLgAEAzhfjt/6MW6sAAAAASUVORK5CYII=') center center no-repeat",
				"z-index":		12,
				position:		"relative"
			},
			"._tt_wrapper._tt_setupDownload ._tt_icon": {
				animation: 	"fadeInOut 0.4s ease-out 3",
				background: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA8CAYAAAA34qk1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAadJREFUeNrs2YFRgzAUBmDgOkBHYARGaDfoBuIGuoFO0G5AncAR0AnqBnYDukF88dKTU3iQhLxQ/N9djl5rePkqySWvWSIUSqk1tVr9REOtTJYWv5Dt2CwJWaj+qCTGkAlZ18xn+ZKg0QNQQAEFFFBAAQUUUEABBRRQQAEFNBLUlC73prJXhazkmVwPErm6Ejcd1byS6bNhqoD1QK5TR58nCWjFDLqcCsogr5GHfnS5BNUU1XeNpIv+AgrHcYgsRl7YkUiRxeglFNYCeU7T9C32PP0zZ8fM0RFzsv3jVJFIhQ12CDpbpAOW+7vTrJEOWJ+IixTCzgMZGDstUm+pqH2am+vrbgZYJ6RZ2NrjeP2+j0F2RUys83+yZ2Frkp4NOrvZDoz1Qe76bppwGSPMWa85yTydKtjBm7Zo93Q5WnS5UNtSv4+bqzBYYIMiRUopI7DBkWI1IwYrgtSxktpQaCytCe/08u561KL2TO+fJfKLQQ32aLlAodwJKKCAAgoooDOI1cCxp74xT967WfE9d+LRBRTQ4NDDP3BeMjo6PS4cq8+72y8BBgDCpsnY/DeynQAAAABJRU5ErkJggg==') center center no-repeat"
			},
			"._tt_wrapper._tt_setupDownload.installing ._tt_icon": {
				"background-image": "none !important"
			},
			"._tt_wrapper._tt_setupDownload.installing ._tt_installing":{
				display: "block",
				animation: 	"fadeInOut 0.4s ease-out 3"
			},
			"._tt_wrapper ._tt_installing":{
				display: "none",
				"text-align": "center",
				"font-size":  "13px",
				color: "#fff",
				"line-height": "20px",
				"padding-top": "25%"
			},
			"._tt_wrapper ._tt_ins_prgrsbar":{
				width: "80%",
				height: "10px",
				background: "#fff",
				"border-radius": "3px",
				margin: "0 auto",
				position: "relative",
				"margin-top":"10px"
			},
			"._tt_wrapper ._tt_ins_prgrsbar div":{
				position: "absolute",
				background: TT.setup.style.buttonHoverColor,
				"border-radius": "3px",
				left:"1px",
				top:"1px",
				height: "8px",
				width: "20px",
				animation: 	"sprinter 1s ease-out infinite"
			},
			"._tt_initScreen ._tt_caption":{
				width: 			"100%",
				padding:		"7px",
				background:		TT.setup.style.buttonBgColor,
				"font-size":	"16px",
				"z-index":		12,
				"text-align":	"center",
				position:		"absolute",
				bottom:			"-50px",
				left:			0,
				transition: 	"bottom 0.2s ease-in-out"
			},
			"._tt_initScreen ._tt_caption u":{
				"font-weight":	"bold",
				"cursor":		"pointer"
			},
			"._tt_wrapper._tt_setupDownload ._tt_caption":{
				bottom:		"0 !important"
			},
			"._tt_initScreen ._tt_backdrop":{
				position:		"absolute",
				top:			0,
				left:			0,
				width:			"100%",
				height:			"100%",
				"background-size":"cover",
				"transition": 			"opacity 0.5s ease-in",
				"z-index":		9
			},
			"._tt_initScreen ._tt_backdrop._tt_visible":{
				opacity:		1
			},
			"._tt_initScreen ._tt_backdrop._tt_hidden":{
				opacity:		0
			},
			"._tt_wrapper._tt_prepared ._tt_embed":{
				"top" : "-5000px",
				"left" : "-5000px"
			},
			"._tt_embed":{
				width:		"100%",
				height:		"100%",
				position:	"absolute",
				left:		"0",
				top:		"0",
				"z-index":	8
			},
			"._tt_embed.visible":{
				visibility:	"visible"
			},
			"._tt_pleaseWait":{
				position:	"absolute",
				left:		0,
				top:		"50%",
				width:		"100%",
				"text-align":"center",
				"color":	"#fff",
				"margin-top":"-55px",
				display:	"none"

			},
			"._tt_pleaseWait_box":{
				padding: "15px",
				margin: "0 auto",
				background: "rgba(0,0,0,0.9)",
				"border-radius":"5px",
				width: "80%"
			},
			"._tt_pleaseWait ._tt_s1":{
				"font-size": 		"16px",
				"margin-bottom":	"15px;"
			},
			"._tt_pleaseWait ._tt_s2":{
				"font-size": "36px",
				"font-weight": "bold"
			},
			"._tt_pleaseWait ._tt_progress":{
				height:		"8px",
				width:		"80%",
				margin:		"0 auto",
				border:		"1px #fff solid",
				"border-radius": "3px"

			},
			"._tt_pleaseWait ._tt_bar":{
				width:		0,
				height:		"4px",
				margin:		"2px",
				background: TT.setup.style.buttonHoverColor,
				"border-radius": "3px"
			},
			"._tt_wrapper.init ._tt_pleaseWait":{
				display:	"inline",
				animation: 	"fadeInOut 2s linear infinite"

			},
			"@keyframes fadeInOut{0%{opacity: 1} 50%{opacity:0} 100%{opacity:1}} ._tt_null": {},
			"@keyframes sprinter{0%{left: 0} 50%{left:calc(100% - 20px)} 100%{left:0}} ._tt_null": {}
		},
		cssString = '';
		for(var cls in css){
			cssString += cls + "{";
			for(var prop in css[cls])
				cssString += prop + ":" + css[cls][prop] + ";"
			cssString += "}";
		}

		utils.createElement({
			name: "style",
			props:{innerHTML: cssString}
		}, (document.head || document.body || document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0] || document.documentElement));

	},
	insertInitScreen = function(instance){

		instance.setup.title = instance.setup.title || (instance.setup.source && instance.setup.source.match(/\/?[^\/]+\/?$/)[0].replace(/\//g,'')) || "Torrents Time";

		var style = {};
		for(var prop in TT.setup.style)
			style[prop] = instance.setup.style[prop] || TT.setup.style[prop];
		instance.wrapper.innerHTML='<div class="_tt_wrapper _tt_prepared"></div>';
		if(instance.setup.isHidden)
			return;


		var initScreen = utils.createElement({
			name: "div",
			props: {
				className: 	"_tt_initScreen",
				innerHTML:	'<div class="_tt_topbar">' + instance.setup.title + '</div><div class="_tt_button"><div class="_tt_hover"></div><div class="_tt_icon"><div class="_tt_installing">Installing...<div class="_tt_ins_prgrsbar"><div></div></div></div></div></div><div class="_tt_caption"><u onclick="torrentsTime.downloadInstaller(1)">Click Here</u> if the download doesn\'t start automatically</div>'
			},
			attrs: {style: 		"background:" + style.backgroundColor + ";color:" + style.textColor}
		}, instance.wrapper.firstChild);
		utils.addListener(initScreen, "click", function(){instance.start()});

		instance.displayPoster = displayPoster;
		if(instance.setup.poster)
			instance.displayPoster();
		else if(instance.setup.imdbid){
			
			var backdropsHandler = function(resText) {
				try{
				   var json = JSON.parse(resText);
				   if(json.backdrops instanceof Array){
					  instance.setup.poster = instance.setup.poster || [];
					  for(var i=0; i<json.backdrops.length; i++)
						 if(json.backdrops[i].width==1920)
							instance.setup.poster.push("//image.tmdb.org/t/p/w1920" + json.backdrops[i].file_path);

					  instance.displayPoster();
				   }
				}
				catch(e){}
			};

			utils.xhr("//api.themoviedb.org/3/movie/" + instance.setup.imdbid + "/images?api_key=" + instance.setup.tmdb_key, function(resText){
				if(resText) backdropsHandler(resText);				   
				else{
				   utils.xhr("//api.themoviedb.org/3/find/" + instance.setup.imdbid + "?api_key=" + instance.setup.tmdb_key + '&external_source=imdb_id', function(response){
					  if(response) {
						 try {
							var json = JSON.parse(response);
							if(json.tv_results && json.tv_results[0] && json.tv_results[0].id)
							   utils.xhr("//api.themoviedb.org/3/tv/" + json.tv_results[0].id + "/images?api_key=" + instance.setup.tmdb_key, function(resText){
								  instance.setup.poster = instance.setup.poster || [];
								  instance.setup.poster.push("http://image.tmdb.org/t/p/" + 'w1280' + json.tv_results[0].backdrop_path);
								  if(resText)
									 backdropsHandler(resText);
							   });
						 }catch(e){}
					  }
				   });
				}
			})
		}
	},
	displayPoster = function(counter){

		var
		instance = this,
		initScreen = this.wrapper.querySelector('._tt_initScreen');

		if(!initScreen || !instance.setup.poster)
			return;

		if(typeof instance.setup.poster == 'string')
			instance.setup.poster = [instance.setup.poster];

		counter = counter ? (counter >= instance.setup.poster.length ? 0 : counter) : 0;

		var backdrop_hidden = initScreen.querySelector('._tt_backdrop._tt_hidden');
		if(!backdrop_hidden){
			var backdrop_hidden = utils.createElement(
			{
				name: "div",
				props: {className: "_tt_backdrop ._tt_hidden"}
			}, initScreen);
		}

		var img = new Image;
		img.onload = function(){
			backdrop_hidden.style.backgroundImage = 'url(' + instance.setup.poster[counter] + ')';
			var backdrop_visible = instance.wrapper.querySelector('._tt_backdrop._tt_visible');
			if(backdrop_visible) backdrop_visible.className='_tt_backdrop _tt_hidden';
			backdrop_hidden.className='_tt_backdrop _tt_visible';

			if(instance.setup.poster.length>1)
				setTimeout(function(){instance.displayPoster(++counter)}, 5000);
		}
		img.src = instance.setup.poster[counter];

	},
	embedTorrentsTime = function(){
		var embed = {};
		embed.explorer = embed.firefox = embed.safari = embed.trident = embed.msie = {
			name: "object",
			props: {className: "_tt_embed", width: "100%", height: "100%"},
			attrs: {type: "application/x-ttplugin"}
		};
		embed.chrome = {
			name: "embed",
			props:{
				className: "_tt_embed",
				type:	"application/x-pnacl",
				name:	"nacl_module",
				path:	"pnacl/Release",
				src:	"https://" + TT.setup.localhost_domain + ":" + TT.setup.port + "/ttplugin.nmf",
				width:	"100%", height:	"100%"
			},
			attrs:{}
		}

		for(var id in TT.instances){
			var instance = TT.instances[id];
			if(typeof instance.plugin != 'undefined') continue;
			embed[TT.setup.browser].attrs["data-src"] = instance.setup.source;
			instance.plugin = {
				object: utils.createElement(embed[ TT.setup.browser ], instance.wrapper.firstChild),
				isInitialized: false,
            isReBinded : false,
				initialize: function(){

					if(instance.plugin.isInitialized) return;
               if(TT.setup.browser == 'firefox' && !instance.plugin.isReBinded && instance.plugin.object.pushEvent) {
                  instance.plugin.isRebinded = true;
                  utils.log('horey!');
                  utils.addListener(instance.plugin.object, "eventHandler", getMessage);
               }

					instance.plugin.sendMessage('{"command":"initialize", "id":"' + instance.id + '", "browser":"' + TT.setup.browser + '"}');
					setTimeout(instance.plugin.initialize, 1000);
				},
				sendMessage: sendMessage
			};

			utils.addListener(instance.plugin.object, "message", getMessage);
			utils.addListener(instance.plugin.object, "eventHandler", getMessage);
			instance.plugin.initialize();

			var prepareScreen = utils.createElement({
				name: "div",
				props:{
					className: "_tt_pleaseWait",
					innerHTML: '<div class="_tt_pleaseWait_box"><div class="_tt_s1">' + instance.setup.title + '</div><div class="_tt_s2">DOWNLOADING</div></div>'
				}
			}, instance.wrapper.firstChild);

			if(TT.setup.browser=='chrome'){
				var progressBar = prepareScreen.querySelector('._tt_bar');
				utils.addListener(instance.plugin.object, "progress", function(event){
					if (event.lengthComputable && event.total > 0) {
						var loadPercentString = (Math.floor(event.loaded / event.total * 100.0)-1) + '%';
						prepareScreen.innerHTML = '<div class="_tt_pleaseWait_box"><div class="_tt_s1">Preparing to stream Torrent...</div><div class="_tt_progress"><div class="_tt_bar" style="width:' + loadPercentString + '"></div></div></div>'
					}
				});
			}

			if(instance.setup.autoPlay)
				instance.start();
		}
	},
	sendMessage = function(data){
		utils.log(data);
		if(this.object){
			try{
				if(this.object.postMessage) 	this.object.postMessage(data);
				else if(this.object.pushEvent)	this.object.pushEvent(data)
				else utils.log('no sendMessage1');
			}catch(e){utils.log(e)}
		}
		else if(this.instances instanceof Array){
			for(var i=0; i<this.instances; i++){
				if(this.instances[i].plugin.object){
               try{
                  var send = (this.instances[i].plugin.object.postMessage || this.instances[i].plugin.object.pushEvent);
                  if(send) send(data); else utils.log('no sendMessage2');
               }catch(e){utils.log(e)}
				}
			}
		}
	},
	getMessage = function(event){
		utils.log(event);
		var data = event.data || event.details || event;
		try{
			var msg = JSON.parse(data);

			if(msg.triggers instanceof Object){
				for(var t in msg.triggers){
					var trigger = TT;
					var names = t.split('.');
					for(var i=0; i<names.length; i++){
						if(trigger[ names[i] ])
							trigger = trigger[ names[i] ];
					}
					if(typeof trigger == 'function')
						trigger(msg.triggers[t]);
				}
			}

			if(typeof TT.functions[msg.status] == 'function')
				TT.functions[msg.status](msg.params);

		}
		catch(e){utils.log(e.message)}
	},
	start = function(){
		if(!TT.setup.isInstalled){
			TT.downloadInstaller();
		}
		else{
			this.wrapper.firstChild.className += ' init';
			var initScreen = this.wrapper.querySelector('._tt_initScreen');
			if(initScreen) initScreen.parentNode.removeChild(initScreen);

			var instance = this;
			setTimeout(function(){
				if(instance.setup.poster && instance.setup.poster.length){
					instance.wrapper.firstChild.style.background='#000 url('+this.setup.poster[0]+') no-repeat center center';
					instance.wrapper.firstChild.style.backgroundSize='cover';
				}
			},500)

			if(this.isReady){
				for(var func in this.beforeStart)
					if(!this.beforeStart[func](this)) return;

				this.wrapper.firstChild.className = this.wrapper.firstChild.className.replace(/ init/g, '');
				this.wrapper.firstChild.className = this.wrapper.firstChild.className.replace(/ _tt_prepared/g, '');
				var command = (this.setup.fileType=='video' && this.setup.videoPLayer) ? "open_stream" : "download_link";
				this.plugin.sendMessage('{"command": "' + command + '", "url":"' + this.setup.source + '", "id":"' + this.id + '", "file":"' + (this.setup.file || '') + '"}');
				this.plugin.object.className += ' visible';
			}
			else
				this.ready = this.start;
		}
	},
	DOMReady = function(a){if(document.readyState=='complete'){a();}else{var b=document,c='addEventListener';b[c]?b[c]('DOMContentLoaded',a):window.attachEvent('onload',a)}},
	utils = TT.utils = {
		
		addListener: function(el, name, listener){
         if(el.attachEvent) {
            if(typeof el.attachEvent == 'object') el["on" + name] = listener;
            else  el.attachEvent("on" + name, listener);
         } else if (el.addEventListener) el.addEventListener(name, listener);
		},

		removeListener: function(el, name, listener){
			if (el.removeEventListener) el.removeEventListener(name, listener);
			else el.detachEvent('on' + name, listener);
		},
		xhr:function(url, callback){
         var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP");
			request.onreadystatechange = function(){
				if (request.readyState == 4) {
					if(request.status == 200) callback(request.responseText);
					else callback(false);
				}
			};
			request.open('GET', url);
			request.send();
		},
		createElement: function(el, node){
			try{
				var e = document.createElement(el.name);
				if(el.attrs)
					for(var attr in el.attrs)
						e.setAttribute(attr, el.attrs[ attr ]);

				if(el.props)
					for(var prop in el.props)
						e[prop] = el.props[ prop ];

				(node || document.getElementsByTagName("body")[0]).appendChild(e);
				return e;
			}
			catch(e){utils.log(e)}

		},
		log:function(e){
			if(typeof console == 'object' && typeof console.log == 'function') console.log(e);
		}
	}
})();
