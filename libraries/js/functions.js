	// Grayscale images on Safari and Opera browsers
	if(getBrowser()=='opera' || getBrowser()=='safari'){
		var $images = $(".container img")
		, imageCount = $images.length
		, counter = 0;

		// One instead of on, because it need only fire once per image
		$images.one("load",function(){
			// increment counter every time an image finishes loading
			counter++;
			if (counter == imageCount) {
				// do stuff when all have loaded
				grayscale($('.container img'));
				$(".container img").hover(
					function () {
						grayscale.reset($(this));
					}, 
					function () {
						grayscale($(this));
					}
				);
			}
		}).each(function () {
		if (this.complete) {
			// manually trigger load event in
			// event of a cache pull
				$(this).trigger("load");
			}
		});
	};
	
	
	// Grayscale images only on browsers IE10+ since they removed support for CSS grayscale filter
	function grayscaleIE10(src){
		
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			var imgObj = new Image();
			console.log("imgObj",imgObj)
			imgObj.src = src;
			console.log("imgObj1",imgObj.height)
			canvas.width = '100';
			canvas.height = '100'; 
			ctx.drawImage(imgObj, 0, 0); 
			var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
			for(var y = 0; y < imgPixels.height; y++){
				for(var x = 0; x < imgPixels.width; x++){
					var i = (y * 4) * imgPixels.width + x * 4;
					var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
					imgPixels.data[i] = avg; 
					imgPixels.data[i + 1] = avg; 
					imgPixels.data[i + 2] = avg;
				}
			}
			ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
			return canvas.toDataURL();
		};
	if (getInternetExplorerVersion() >= 10){
			
	}
	
	// This block simply ads a corresponding class to the body tag so that we can target browsers with CSS classes
	if(getBrowser()=='mozilla'){
		// Mozilla
		$('body').addClass('mozilla');
	}
	else if(getBrowser()=='ie'){
		// IE Favourite
		$('body').addClass('ie');
	}
	else if(getBrowser()=='opera'){
		// Opera
		$('body').addClass('opera');
	}           
	else if (getBrowser()=='safari'){ // safari
		// Safari
		$('body').addClass('safari');
	}
	else if(getBrowser()=='chrome'){
		// Chrome
		$('body').addClass('chrome');
	};
	if (getInternetExplorerVersion() >= 10){
		$('body').addClass('ie11');
	};

	// Detection function to tell what kind of browser is used
	function getBrowser(){
		var userAgent = navigator.userAgent.toLowerCase();
		var chrome = /chrome/.test(userAgent);
		var safari= /webkit/.test(userAgent);
		var opera=/opera/.test(userAgent);
		var msie=/msie/.test( userAgent ) && !/opera/.test( userAgent );
		var mozilla= /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent ) || /firefox/.test(userAgent);

		if(chrome) return "chrome";
		if(mozilla) return "mozilla";
		if(opera) return "opera";
		if(safari) return "safari";
		if(msie) return "ie";
	};
	
	// Since IE11 can not be detected like this because the new user agent on IE11 is trying to hide as Mozilla
	// we detect IE11 with this function
	function getInternetExplorerVersion(){
		var rv = -1;
		if (navigator.appName == 'Microsoft Internet Explorer'){
			var ua = navigator.userAgent;
			var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null)
			rv = parseFloat( RegExp.$1 );
		}
		else if (navigator.appName == 'Netscape'){
			var ua = navigator.userAgent;
			var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null)
			rv = parseFloat( RegExp.$1 );
		}
		return rv;
	};
