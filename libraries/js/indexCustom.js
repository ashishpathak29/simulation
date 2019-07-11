// JavaScript Document
var simulationStart = false;
var simulationHelpPopup = true;

var blnNavigation = false;
var blnSimulation = false;
var blnDropoff = false;


var parentResult = '';
var parentChartData = '';
var parentsetPageId = '';

var gotopageurl = '';
var iFrameDOM = '';
function gotopage(link) {
	window.parent.document.querySelector('header').style = 'display:block';
	window.parent.document.querySelector('header').classList.remove('hide');
		
	if (!simulationStart) {
		document.getElementById('frame').src = link;
		$(".loading").show();
	} else {
		gotopageurl = link;
		$('#modal3').modal('open');
	}
}

function changeState()
{
	if(blnNavigation)
	{
		$('.helpScreen .result-tabs .tab a').removeClass('active');		
		$('.helpScreen .result-tabs li a').eq(0).addClass('active');
		$('#test-swipe-1').addClass('active');
		$('#test-swipe-1').css('display','block');
		$('#test-swipe-2').removeClass('active');
		$('#test-swipe-2').css('display','none');
		$('#test-swipe-3').removeClass('active');
		$('#test-swipe-3').css('display','none');
	}
	if(blnSimulation)
	{
		$('.helpScreen .result-tabs .tab a').removeClass('active');
		$('#test-swipe-1').removeClass('active');
		$('#test-swipe-1').css('display','none');
		$('#test-swipe-2').addClass('active');
		$('#test-swipe-2').css('display','block');
		$('#test-swipe-3').removeClass('active');
		$('#test-swipe-3').css('display','none');
		$('.helpScreen .result-tabs li a').eq(1).addClass('active');
		
	}
	if(blnDropoff)
	{
		$('.helpScreen .result-tabs .tab a').removeClass('active');
		$('#test-swipe-1').removeClass('active');
		$('#test-swipe-1').css('display','none');
		$('#test-swipe-2').removeClass('active');
		$('#test-swipe-2').css('display','none');
		$('#test-swipe-3').addClass('active');
		$('#test-swipe-3').css('display','block');
		$('.helpScreen .result-tabs li a').eq(2).addClass('active');
		
	}
	
}

$("li.tab a").click(function () {
	$('.helpScreen .result-tabs .tab a').removeClass('active');
	$('#test-swipe-1').removeClass('active');
	$('#test-swipe-1').css('display','none');
	$('#test-swipe-2').removeClass('active');
	$('#test-swipe-2').css('display','none');
	$('#test-swipe-3').removeClass('active');
	$('#test-swipe-3').css('display','none');
	});
	
	
function yes() {
	document.getElementById('frame').src = gotopageurl;
	$('#modal3').modal('close');
	simulationStart = false;
	//resetCourse();
}

function openHelpScreen() {
	if($(window).width() < 767){
	
	if (simulationStart) {
		$('#simulationHelpPopup').modal('open');
		window.parent.document.querySelector('header').style = 'display:block';
		window.parent.document.querySelector('.main-content').style = 'padding-bottom: calc(100vh - 55px)';
		window.parent.document.querySelector('header').classList.remove('hide');
		}
	}
	if($(window).width() > 767){
		if (simulationStart) {
		$('#simulationHelpPopup').modal('open');
		window.parent.document.querySelector('header').style = 'display:block';
		window.parent.document.querySelector('header').classList.remove('hide');
		window.parent.document.querySelector('.main-content').style = 'padding-bottom: calc(100vh - 75px)';
		} else {
			$('#helpScreen').modal('open');
		}
	}
	
}

	

	

$(document).ready(function () {
	iFrameDOM = $("iframe#frame").contents();

	//var windWidth = $(document).width();
	
	//if (windWidth < 767 ){
    $(".fixed-nav").click(function(){
        $(this).toggleClass("activebutton");			
    });
	
	

	

	


	$(".launch-wrap .btn-blue").click(function () {
		$(".launch-wrap").addClass('hidewrap');
		// $("#frame").attr('src','objective.html');
	});
	$(".modal-overlay").click(function () {
		return false;
	});


	$(".dropdown-button").click(function () {
		$(".pageoverlay").addClass("active");
	});

	$(".pageoverlay").click(function () {
		$(this).removeClass("active");
		$(".dropdown-button").removeClass("active");
	});


	$('.modal').modal({dismissible: false});
	$('#helpScreen, #simulationHelpPopup').modal({dismissible: true});	
	$('.prev-btn').hide();
	$('.next-btn').on('click', function(){		
		$('#frame').contents().find('.next-arrw').trigger('click');
		//$(this).hide();
		//$('.prev-btn').show();
	});
	$('.prev-btn').on('click', function(){			
		$('#frame').contents().find('.prev-arrw').trigger('click');	
		//$(this).hide();
		//$('.next-btn').show();
	});

});

	
$(window).load(function () {
	// Animate loader off screen

	$(".loading").fadeOut("5000");

	if ($(window).width() > 1024) {
		new WOW().init();
	}
});
$(document).on("click","#glossary .modal-content a.close",function() {
																 
	//var iframe = document.getElementById('frame');
	//var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
	//innerDoc.querySelector('.modal-overlay').style = 'display:none';
	$(this).parents().find('.glossaryscreen').removeClass('open');
	$(this).parents().find('.glossaryscreen').removeClass('show');
	window.parent.document.querySelector('.glossaryscreen').classList.remove('open');
	$(this).parents().find('#glossary').removeClass('marginGlossary');
	//$(this).parents().find('.modal-overlay').css('display', 'none');

	
	
	//$("iframe#frame").find('.modal-overlay').hide();

});	


	

	
	

