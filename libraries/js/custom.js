// JavaScript Document
var courseId = "";
$(document).ready(function () {

    $(".close").click(function () {
        $(this).parents(".profilebox").removeClass("activePopup");
    });
    $('.modal').modal({
        dismissible: false,
    });
    $('#fourmodel').modal({
        dismissible: true
    });
    /* if($(window).width() > 767){
    	$(".profile-lists li a.profileClick").click(function(){
    		var getattr = $(this).attr("data-target");
    		$(getattr).addClass("activePopup");
    	});
    } else {
    	$(".profile-lists li a.profileClick").click(function(){
    		getPages('p1');
    	});			
    } */


    $.preloadImages = function () {
        for (var i = 0; i < arguments.length; i++) {
            $("<img />").attr("src", "course/p1/assets/images/" + arguments[i]);
        }
    }
    $.preloadImages("profile-1_P1OK4_P1MB4.png", "P1MB1NOK1.png", "P1NOK1.png", "P1NOK2.png", "P1NOK3.png", "P1NOK5_P1NOK4.png", "P1OK1.png", "P1OK1NOK1.png", "P1OK1OK1_P1NOK6_P1NOK7.png", "P1OK2.png", "P1OK3_P1MB1_P1MB2.png", "P1OK5.png", "P1OK6.png");


    $(document).on(".profileClick", function () {

    })


});

$(window).load(function () {
    
    var lesson_location = $('#pg_topic').val();
    
    parent.doLMSSetValue("cmi.core.lesson_location", lesson_location);
    
    // Animate loader off screen

    parent.$(".loading").fadeOut("slow");

    if ($(window).width() > 1024) {
        new WOW().init();
    }

});