var accessToken = "c34ce98ba9bc4896a5ed4f6d0d5713ff";
    //var accessToken = "3d1b632aa4914975830ea290546a2dc4";
    
	var baseUrl = "https://api.api.ai/v1/";
	
	$(document).ready(function(){
		$("#input").keypress(function(event) {
            if (event.which == 13) {
				event.preventDefault();	
                var text = $(this).val();
                if(text !=""){
                    var currentTime = new Date();
		            currentTime = currentTime.toLocaleTimeString();
				    
                    $("ol.discussion").append('<li class="other"><div class="avatar"><span><img src="player/images/Layer-371.png" class="" alt="" /></span> </div><div class="messages"><p>'+text+'</p><time>'+currentTime+'</time> </div></li>');
                    
                    $("ol.discussion").animate({ scrollTop: $("ol.discussion").prop("scrollHeight")}, 500);
				    send();
                    $(this).val('');
                }
            }
        });
        
        $("#rec").click(function(event) {
            switchRecognition();
        });
		
		setTimeout(function(){
			//$(this).hide().removeClass("bounceOutDown");
			/* $(".tutorial-text").show().addClass("bounceInUp"); */
			$(".chat-icon").removeClass("disable");
            setTimeout(function(){$(".tutorial-text").removeClass("bounceInUp").removeClass("bounceOutDown");},1000);
			
		},1500);
        /*setTimeout(function(){
			//$(this).hide().removeClass("bounceOutDown");
			$(".chat_box").show().addClass("bounceInUp");
			setTimeout(function(){$(".chat_box").removeClass("bounceInUp").removeClass("bounceOutDown");},1000);
			
		},3000);*/
		
		/*$(document).on("click",".chat-icon",function(){
            if($(".tutorial-text").css("display")!="block"){
                if($(".chat_box").css("display")=="block"){
                    $(".chat_box").addClass("bounceOutDown");
                    setTimeout(function(){
                        $(".chat_box").hide().removeClass("bounceOutDown");
                        setTimeout(function(){
                            $(".chat-icon").removeClass("bounceInUp").removeClass("bounceOutDown");},1000);
                    },500);
                } else {
                    $(".chat_box").show().addClass("bounceInUp");
                    setTimeout(function(){$(".chat_box").removeClass("bounceInUp").removeClass("bounceOutDown");},1000);
                }
            }
		});*/
        
        $(document).on("click",".tutorial-text a", function(){
            $(".tutorial-text, .chat-icon").fadeOut();
            $(".chat-icon").removeClass("disable");
            $(".chat_box").show().addClass("bounceInUp");
            setTimeout(function(){
                $(".chat_box").removeClass("bounceOutDown");
                setTimeout(function(){$(".chat_box").removeClass("bounceInUp").removeClass("bounceOutDown");},1000);
                $("#input").focus()
            },500);
            
            return false;
        });
	   
		$(document).on("click",".chat-icon",function(){
            if(!$(this).hasClass("disable")){
                $(this).removeClass("bounce").addClass("bounceOutDown");
                setTimeout(function(){
                    $(this).hide().removeClass("bounceOutDown");

                    $(".chat_box").show().addClass("bounceInUp");
                    setTimeout(function(){$(".chat_box").removeClass("bounceInUp").removeClass("bounceOutDown");},1000);

                },500);
            }
		});	
		
		$(document).on("click",".close-chat",function(){
			$(".chat_box").addClass("bounceOutDown");
			setTimeout(function(){
				$(".chat_box").hide().removeClass("bounceOutDown");
				
				$(".chat-icon").show().addClass("bounceInUp");
				setTimeout(function(){$(".chat-icon").removeClass("bounceInUp").removeClass("bounceOutDown");},1000);
				
			},500);
		});	
		
		$(document).on("click","#type",function(){
            var currentTime = new Date();
		    currentTime = currentTime.toLocaleTimeString();
			var helpText = $("#input").val();
			$("ol.discussion").append('<li class="other"><div class="avatar"><span><img src="player/images/Layer-371.png" class="" alt="" /></span> </div><div class="messages"><p>'+helpText+'</p><time>'+currentTime+'</time> </div></li>');
			$("ol.discussion").animate({ scrollTop: $("ol.discussion").prop("scrollHeight")}, 500);
			send();
			$("#input").val("");
		});	
        
        $(document).on("click",".play_help_video",function(){
            var videoname = $(this).attr("data-attr");
           showChatVideo(videoname);
        });
        
        $(document).on("click",".close-chat-video",function(){
            hideChatVideo();
        });
        
	});
	
	var recognition;
    function startRecognition() {
        recognition = new webkitSpeechRecognition();
        recognition.onstart = function(event) {
            updateRec();
        };
        recognition.onresult = function(event) {
            var text = "";
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                text += event.results[i][0].transcript;
            }
            setInput(text);
            stopRecognition();
        };
        recognition.onend = function() {
            stopRecognition();
        };
        recognition.lang = "en-US";
        recognition.start();
    }

    function stopRecognition() {
        if (recognition) {
            recognition.stop();
            recognition = null;
        }
        updateRec();
    }
    
    function switchRecognition() {
        if (recognition) {
            stopRecognition();
        } else {
            startRecognition();
        }
    }
    
    function setInput(text) {
        $("#input").val(text);
        var currentTime = new Date();
		currentTime = currentTime.toLocaleTimeString();
       
        $("ol.discussion").append('<li class="other"><div class="avatar"><span><img src="player/images/Layer-371.png" class="" alt="" /></span> </div><div class="messages"><p>'+text+'</p><time>'+currentTime+'</time> </div></li>');
        
        $("ol.discussion").animate({ scrollTop: $("ol.discussion").prop("scrollHeight")}, 500);
        send();
    }
    
    function updateRec() {
        if (recognition) {
            $("#rec").addClass("stop");
        } else {
            $("#rec").removeClass("stop");
            $("#input").val("");
        }
    }
    
    function send() {
        var text = $("#input").val();
        $.ajax({
            type: "POST",
            url: baseUrl + "query?v=20150910",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
            success: function(data) {
                setResponse(JSON.stringify(data, undefined, 2));
            },
            error: function() {
                setResponse("Internal Server Error");
            }
        });
        setResponse("Loading...");
    }
    
    function setResponse(val) {
       if (val.result) {
            var say=""; 
            say = val.result.fulfillment.speech;

            synth = window.speechSynthesis;
            var utterThis = new SpeechSynthesisUtterance(say);
            //utterThis.lang = "en-US";
            synth.speak(utterThis);
        }

        if(val != "Loading..."){
            var json = JSON.parse(val);
            var currentTime = new Date();
            currentTime = currentTime.toLocaleTimeString();
            var responseText = json["result"]["fulfillment"].speech;
            
            //responseText = responseText.replace(/(?:\r\n|\r|\n)/g, '<br />');
            //var imagePath = json["result"]["fulfillment"].messages[1].imageUrl;
            //console.log(imagePath)
            $("ol.discussion").append('<li class="self"><div class="avatar"><span><img src="player/images/imagesleyla_logo.png" class="" alt="" /></span> </div><div class="messages"><div class="response">'+responseText+'</div><time>'+currentTime+'</time> </div></li>');
            
            $("ol.discussion").animate({ scrollTop: $("ol.discussion").prop("scrollHeight")}, 500);
            
            //console.log(json["result"].action)
            //action(json["result"].action);
        }
    }
    
    function action(actionString){
        switch(actionString){
            case "play_login_video": 
                //alert(111);
                break;

        }

    }
    
    
    function showChatVideo(videoName){
        $(".overlay-popup, .videopopup").fadeIn();
        var videoTitle = videoName.replace(/([a-z])([A-Z])/g, '$1 $2')
        $(".videopopup h3").text(videoTitle);
        var video = document.getElementById('chatVideo');
        video.setAttribute("src", videoUrl+"/"+videoName+".mp4");
    }
    function hideChatVideo(){
        var video = document.getElementById('chatVideo');
        video.pause();
        $(".overlay-popup, .videopopup").fadeOut();
    }
    