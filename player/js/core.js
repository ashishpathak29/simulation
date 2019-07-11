var course;
var courseTitle= '';
var pages;
var pageType='';
var speedometer = 0;
var simulationStart = false;
var assessmentScore = {
	stageNo:[],
	pageId: [],
	maxScore:[],
	userScore:[],
	userAns:[],
	user:[],
	feedback:[]
};
var resultByStage = {
	maxScore:[],
	userScore: [],
	avgScore:[],
	stgTitle:[]
};
var chartData = {
	labels:[],
	data:[],
	uAns:[],
	u:[],
	coach:[]
};
var answerData = [];
var profileData = [];
var coachData = [];


function getPages(e){
	
	$('.arrow_prev').hide();
	$('.arrow_next').hide();
	$('.help_pagination').css("position","static");
	$('.help_pagination').css("display","block");
	if($(window).width() < 767){
		window.parent.document.querySelector('header').style = 'display:block';
		window.parent.document.querySelector('header').classList.remove('hide');
		window.parent.document.querySelector('.main-content').style = 'padding-bottom: calc(100vh - 55px)';
		
	}
	if($(window).width() > 767){
		window.parent.document.querySelector('header').style = 'display:block';
		window.parent.document.querySelector('header').classList.remove('hide');
		window.parent.document.querySelector('.main-content').style = 'padding-bottom: calc(100vh - 75px)';
	}
	var xmlpath = e;	
	$.ajax({
		type: 'GET',
		url: 'course/' + xmlpath + '/pages.xml',
		dataType: 'xml',
		success: function (data) {
			pages = $(data);
			var firstpageid = pages.find('page').first().attr('page-id');
			loadPage(firstpageid);
			if($(".assessment-area").attr("data-pageid")=="P1"){
				$(".assessment-area .assessment-que h3").fadeIn();
				$(".assessment-area .assessment-user .coachbtn").addClass("no-animate");
				$(".assessment-area .assessment-user .coachbtn .arrowindi").addClass("shown");
			}
            $('.modal').modal('close');
			//setTimeout(function(){ $('#modal1-profile').modal('open'); }, 2000);            
			parent.simulationStart = true;
			parent.simulationStart2 = true;
			
			//$('.arrowleft').attr('onclick', 'parent.gotopage("help.html")')
			
			resetCourse();
			
			if (parent.simulationHelpPopup) {
				parent.openHelpScreen();	
				parent.simulationHelpPopup = false;
			}
		}		
	});	
	setTimeout(function(){ $(".meter").fadeIn(); }, 1000);	
	parent.parentsetPageId = e;
	$('.startcon').hide();
	$('.prev-arrw').show();
}

function loadPage(id){ 
	var pageid = id;	
	var pagedata = pages.find('page[page-id='+ pageid +']');
	var pageType = pagedata.attr('page-type');
	
	var stage = pagedata.attr('stage-id');
	var stageNum = stage.match(/\d+/g).map(Number);
	var stageImg = pages.find('stageImg').html();
	var stageTitle = pages.find('stage[stage-id='+ stage +']').find('stageTitle').text();
	
	var coursedatacontent = '';
		
	var stageList = '<div class="stage-list"><ul class="align-content-space">';
	pages.find('stage').each( function(){
		var stgId = $(this).attr('stage-id');
		var sNo = stgId.match(/\d+/g).map(Number);
		if(!(sNo == 0)){
			stageList += '<li class="stg-'+ sNo;
			if (sNo[0] == stageNum[0]) {
				stageList += ' active'
			}
			stageList += '"><div class="stg-img-bg"><img src="player/images/stg-'+ sNo +'.png" alt="'+ $(this).text() +'"/></div><h5>'+ $(this).text() +'</h5></li>';			
		}
	});
	stageList += '</ul></div>';	
	if(pageType == 'failure'){
		parent.blnNavigation = false;
		parent.blnSimulation = false;
		parent.blnDropoff = true;
		rPage();
		storageResult();
		
		var failureData = '<div class="modelheader"><h3>'+ pagedata.find("failureHeader").text() + '</h3></div>';
		failureData += '<div class="modeltxt">'+ pagedata.find("bodyContent").text() + '</div>';		
		$('#modal4 .modal-content').html(failureData);
		$('#modal4').modal('open');
		$(".feedbackPopup").removeClass("open");
		parent.simulationStart = false;
		parent.$('.next-btn').addClass('disabled');
		parent.$('.prev-btn').addClass('disabled');
		
	//$('.simulation-area').html(coursedatacontent);
	
	} else if(pageType == 'assessment') {
		
		coursedatacontent += '<div class="assessment-area full" data-pageid="'+ pageid +'" data-stageNo="'+ stage +'"><div class="container"><div class="row"><div class="col s12 m12 l12 center"><h2 class="profile-title">'+ pages.find('profileTitle').text() +'</h2></div><div class="col s12 m12 l6 assessment-user">'
		coursedatacontent += '<div class="imgContentbox">'+pagedata.find("bodyContent").text()+''+pagedata.find("imgContent").text();		
		pages.find('character').each( function(){
			var charId = $(this).attr('character-id');
			coursedatacontent += '<span class="character wow fadeInUp '+ charId +'">'+ $(this).text() +'</span>';
			
		});
		coursedatacontent += '</div>';
		if( pagedata.find("feedback").length > 0 ){
			coursedatacontent += '<div class="feedbackPopup" id="feedbackPopup"><h3 class="bluehead align-left"><img src="player/images/Coach-for-Coachsays.png" alt="Coach"/>Coach Says</h3><a href="javascript:void(0);" onClick="closePopup()" class="close waves-effect waves-light"><i class="material-icons "></i></a><div class="feedbckTxt">'+ pagedata.find("feedback").text() +'</div></div>';
		}
				
		coursedatacontent += '<div class="profilesummary align-content-space"><a class="profileBtn align-content" href="#!" onClick="openProfile();"><div class="bgimg"></div><span>customer</br> profile</span></a><div class="meter"><div class="customercircle"><img src="player/images/meterbg-2.png" alt=""><div class="movearrow" style="transform:rotate(' + speedometer + 'deg);"><img src="player/images/movearrow2.png" class="arrowrotate" alt=""/></div></div><span>Customer</br> Satisfaction Meter</span></div><a class="coachbtn align-content" onClick="openFeedback();" href="#!"><div class="bgimg"></div><span>Coach Says</span><div class="arrowindi align-content"><img src="player/images/show-arrw.png" alt="arrow"/><div class="arrowdesc">Click here to view coaching tips on the best way to handle the conversion</div></div></a></div>';
		
/*		coursedatacontent += '<div class="customerprofile" id="modal1-profile"><h3 class="bluehead align-left"><img src="player/images/Customer-profile.png" alt="Customer Profile"/>Customer Profile</h3><a href="javascript:void(0);" onClick="closePopup()" class="close waves-effect waves-light"><i class="material-icons "></i></a><div class="leftboxprofile"><p><strong>Customer Name: </strong> Rhea Scullin</p><p> <strong>Occupation:  </strong>Senior Sales VP</p><p><strong> Age:</strong> 58 years</p><p><strong> Vehicle  Requirement:</strong> GLE 350</p><p><strong> Vehicle Usage:</strong> Work  commute</p><p><strong> Mileage:</strong> 10,000  miles per year</p><p> <strong>Highlights: </strong> Prefers cash purchase. Trades in car every two to three years. </p></div></div>';*/
		coursedatacontent += '<div class="customerprofile" id="modal1-profile"><h3 class="bluehead align-left"><img src="player/images/Customer-profile.png" alt="Customer Profile"/>Rhea Scullin<span class="age_text">|58 years</span></h3><div class="customer_desc"><p>Senior Sales VP</p></div><a href="javascript:void(0);" onClick="closePopup()" class="close waves-effect waves-light"><i class="material-icons "></i></a><div class="leftboxprofile"><p><strong> Vehicle  Requirement:</strong> GLE 350</p><p><strong> Vehicle Usage:</strong> Work  commute</p><p><strong> Mileage:</strong> 10,000  miles per year</p><p> <strong>Highlights: </strong> Prefers cash purchase. Trades in car every two to three years. </p></div></div>';
		
		coursedatacontent += '</div><div class="col s12 m12 l6 assessment-que align-content">'
		coursedatacontent += '<h3>'+ pagedata.find("question").text() +'</h3>';
		coursedatacontent +='<h5 class="instruction">'+ pagedata.find("helpText").text() +'</h5>';
		var answerNum = 0;
		pagedata.find('answer').each(function () {			
			coursedatacontent += '<div class="input-box"><input onClick="submitAnswer()" data-score="'+ $(this).attr('score') +'" data-goto="'+ $(this).attr('goto') +'" class="" name="profile1" type="radio" id="popt'+ answerNum +'" /><label for="popt'+ answerNum +'" class="">' + $(this).text() +'</label></div>';
			answerNum++;			
		});		
		//coursedatacontent += '<button class="btn waves-effect waves-light submitBtn btn-yellow m-t-30" type="submit" name="action" >Submit</button>';
		
		coursedatacontent += '</div></div></div></div>';
		
	coursedatacontent += stageList;
	//coursedatacontent += '</div>';
	$('.simulation-area').html(coursedatacontent);
		
		parent.blnNavigation = false;
		parent.blnSimulation = true;
		parent.blnDropoff = false;
	//if (assessmentScore.userAns.length != 0 && pageType != 'success') {
	//			$(".feedbackPopup").addClass("open");
	//		}	
		parent.$('.next-btn').removeClass('disabled');
		parent.$('.prev-btn').removeClass('disabled');
		
	} else if(pageType == 'success'){
		rPage();
		storageResult();
		
		var successData = '<div class="modelheader"><h3>'+ pagedata.find("successHeader").text() + '</h3></div>';
		successData += '<div class="modeltxt">'+ pagedata.find("bodyContent").text() + '</div>';		
		$('#modal2 .modal-content').html(successData);
		$('#modal2').modal('open');	
		$(".feedbackPopup").removeClass("open");
		parent.simulationStart = false;
		parent.$('.next-btn').addClass('disabled');
		parent.$('.prev-btn').addClass('disabled');
        
        parent.doLMSSetValue("cmi.core.lesson_status", "completed");
        
	}

}
function jumpTo(e) {
	var pageid = $(e).attr('data-jumpto');
	loadPage(pageid);
}

function submitAnswer() {
	//console.log($(this).index())
	if ($('input[type=radio]:checked').length > 0) {
		meterData();
		if($('.assessment-que input[type=radio]:checked')){
			$('.assessment-que input[type=radio]:checked').attr('disabled','disabled');
			$('.assessment-que input[type=radio]:checked').parent(".input-box").siblings().find("input").attr('disabled','disabled');
		}
		var marks = []
		$('.assessment-area input[type=radio]').each(function () {
			marks.push($(this).attr('data-score'));
		});
		var max = Math.max.apply(null, marks);
		assessmentScore.maxScore.push(max);
		
		var checked = $('.assessment-area input[type=radio]:checked');
		assessmentScore.userScore.push(parseInt(checked.attr('data-score')));
		
		var pid = $('.assessment-area').attr('data-pageid');
		assessmentScore.pageId.push(pid);

		var sid = $('.assessment-area').attr('data-stageNo');
		assessmentScore.stageNo.push(sid);
		
		var userCom = $('.assessment-area').find(".user1comment").text();
		userCom += '<br>' + $('.assessment-area').find(".user2comment").text();
		assessmentScore.user.push(userCom);
		
		var coachCorner = $('.assessment-area').find(".feedbckTxt").text();
		assessmentScore.feedback.push(coachCorner);
				
		var quesstep = $('.assessment-area input[type=radio]:checked').attr('data-goto');
		
		var userattempt = $('.assessment-area input[type=radio]:checked').attr('data-goto');
		assessmentScore.userAns.push(userattempt);
		
		
		setTimeout(function(){ loadPage(quesstep); }, 1000);
		
		//$(".feedbackPopup").addClass("open");
			
	} else {
		alert('Please Choose Any Option');
	}
		
}
function closePopup(){
	$("#feedbackPopup").removeClass("open");
	$(".user1comment, .user2comment").fadeIn();
	$(".customerprofile").removeClass("open");
	//assessmentScore.userAns.length=0;
	//assessmentScore.pageId.length=0;
}
function getSum(total, num) {
    return total + num;
}

function rPage(){	
	for(i=0; i < pages.find('stage').length; i++){
		if (i != 0) {
			var stageId = pages.find('stage').eq(i).attr('stage-id');
			var stageMaxScore=0;
			var stageUserScore=0;
			var stageNotFind=0;
			for(k=0; k<assessmentScore.stageNo.length;k++){
				if (assessmentScore.stageNo[k] == stageId) {
					stageMaxScore += assessmentScore.maxScore[k];
					stageUserScore += assessmentScore.userScore[k];
				} else {
					stageNotFind++;
				}
			}
			if (stageNotFind == assessmentScore.stageNo.length) {
				resultByStage.maxScore.push('0');
				resultByStage.userScore.push('0');
				resultByStage.avgScore.push('0');
				resultByStage.stgTitle.push(pages.find('stage').eq(i).text());
			} else {
				var stageAvgScore = stageUserScore * 100 / stageMaxScore;
				resultByStage.maxScore.push(stageMaxScore);
				resultByStage.userScore.push(stageUserScore);
				resultByStage.avgScore.push(stageAvgScore);
				resultByStage.stgTitle.push(pages.find('stage').eq(i).text());
			}
		}
		
	}	
	
}

function storageResult() {
	var str1 = "";
	for (k = 0; k < resultByStage.maxScore.length; k++) {
		if (k != 0){
			str1 = str1 + '_';
		}
		str1 = str1 + resultByStage.maxScore[k] + '#' + resultByStage.userScore[k]+ '#' + resultByStage.avgScore[k] +'#'+ resultByStage.stgTitle[k];
	}
	//localStorage.setItem('result', str1);
	parent.parentResult = str1;
	
	var str2 = "";
	for(j = 0; j < assessmentScore.userScore.length; j++){
		if (j != 0){
			str2 = str2 + '_';
		}
		str2 = str2 + assessmentScore.userScore[j] + '#' + assessmentScore.pageId[j] + '#' + assessmentScore.userAns[j] + '#';

		/* + assessmentScore.stageNo[j] + '#' + assessmentScore.user[j] + '#' + assessmentScore.userAns[j] + '#' + assessmentScore.feedback[j]; */
	}	
	//localStorage.setItem('chartData', str2);
    parent.parentChartData = str2;
	
    var suspendData = str1 + "|" + str2;
    parent.doLMSSetValue("cmi.suspend_data", suspendData);
    
}

function getResult() {
	
	//var result = localStorage.getItem('result');
	var result = parent.parentResult;
	var result1 = result.split("_");
	$(result1).each(function (k, s) {
		var ndata = s.split('#');
		resultByStage.maxScore[k] = ndata[0];
		resultByStage.userScore[k] = ndata[1];
		resultByStage.avgScore[k] = ndata[2];
		resultByStage.stgTitle[k] = ndata[3];
	});
	
	
	var courseId1 = parent.parentsetPageId;

	var xmlpath = 'course/'+courseId1+'/pages.xml';

	//var chartData = localStorage.getItem('chartData');
	var chartData = parent.parentChartData;
	
	var chartData1 = chartData.split("_");
	var assesScore = [];
	answerData = [];
	profileData = [];
	coachData = [];
	$.ajax({
		type: 'GET',
		url: xmlpath,
		dataType: 'xml',
		success: function (xml) {			
			$(chartData1).each(function (k, s) {
				var ndata = s.split('#');
				assessmentScore.userScore[k] = ndata[0];
				assessmentScore.pageId[k] = ndata[1];
				/* assessmentScore.stageNo[k] = ndata[2]; */

				assessmentScore.userAns[k] = ndata[2];
				
				answerData.push($(xml).find("page[page-id='"+assessmentScore.pageId[k]+"']").children("answer[goto='"+assessmentScore.userAns[k]+"']").text());
				ndata[2] = answerData[k];
				
				var rrr123 = $(xml).find("page[page-id='"+assessmentScore.pageId[k]+"']").find("user1Comment").text();
				var rrr124 = $(xml).find("page[page-id='"+assessmentScore.pageId[k]+"']").find("user2Comment").text();
				rrr123 = $(rrr123).text().replace("<![CDATA[", "").replace("]]>", "");
				rrr124 = $(rrr124).text().replace("<![CDATA[", "").replace("]]>", "");

				profileData.push(rrr123 + "<br/>" +  rrr124);
				ndata[3] = profileData[k];
				
				coachData.push($(xml).find("page[page-id='"+assessmentScore.pageId[k]+"']").children("feedback").text());
				ndata[4] = coachData[k];

			});
								
		},
		complete:function(){
			resultByStage;
			var showStgProgress = '<div class="row"><div class="col s12 m12 l12">';
			for(i=0; i<resultByStage.avgScore.length;i++){
				showStgProgress += '<div class="stgEvaluation stgBar-'+ i +'"><div class="sTitle">'+ resultByStage.stgTitle[i] +'</div><div class="progress"><div class="determinate" style="width: '+ (100 - resultByStage.avgScore[i]) +'%"></div></div><div class="sScore">'+ Math.round(resultByStage.avgScore[i]) +'%</div></div>';
			}
			
			showStgProgress += '<div class="result-desktop"><a href="#modal5" class="btn waves-effect waves-light btn-yellow m-t-50">Restart Scenario</a><div class="instruction result">Click to restart the simulation.</div><div class="instruction result">To Exit the course, please click the ‘X’ button on the top-right corner.</div>';
			showStgProgress += '</div></div>';
			showStgProgress += '<div class="col s12 m12 l6 canvasGraph"><!--<canvas id="myChart" width="400" height="300"></canvas>--><div id="chartjs-tooltip"><div class="pointPopup"></div></div><div class="canvasmapLeft center">Customer Satisfaction</div><div class="canvasmapBttm center">Conversation</div><div class="result-mobile"><a href="#modal5" class="btn waves-effect waves-light btn-yellow m-t-50">Restart Scenario </a> <div class="instruction result">Click to restart the simulation.</div><div class="instruction result">To Exit the course, please click the ‘X’ button on the top-right corner.</div>  </div></div>';
			showStgProgress += '</div>';
				
			$('#test-swipe-1').html(showStgProgress);
			ChartData();
			//buildChart();
		},
		error:function(e){
			alert("error" +e)
		}
	});
	parent.$('.next-btn').removeClass('disabled');
		parent.$('.prev-btn').removeClass('disabled');
}

function showResult() {

	getResult();

	localStorage.removeItem('chartData');
	localStorage.removeItem('result');
	//resetCourse();
}

function userEvaluation() {
	var uScore = assessmentScore.userScore;
	var mScore = assessmentScore.maxScore;
	var totalScore = uScore.reduce(getSum) * 100 / mScore.reduce(getSum);
	return(totalScore);
}

/*function stgScore(){
	assessmentScore.userScore
}*/

//new WOW().init();

function ChartData() {
	var chartScore = 0;
	//debugger;

	for(var j = 0; j < assessmentScore.userScore.length; j++){
		
		chartData.labels[j] = assessmentScore.pageId[j];
				
		if (assessmentScore.userScore[j] == '5') {
			chartData.data[j] = chartScore = chartScore + 5;
		} else if (assessmentScore.userScore[j] == '3') {
			chartData.data[j] = chartScore = chartScore + 0;
		} else {
			chartData.data[j] = chartScore = chartScore - 5;
		}
		
		chartData.uAns[j] = answerData[j];
		chartData.u[j] = profileData[j];
		chartData.coach[j] = coachData[j];
		
	}
	
}

function meterData(){
	var dataScoreVal = $(".assessment-que input[type='radio']:checked").attr("data-score");
	if(dataScoreVal == 5){
		if(speedometer == 0){
			speedometer += 65;
		} else if(speedometer == 65){
			speedometer += 0;
		} else if(speedometer == -65){
			speedometer += 65;
		}
		$(".movearrow").css('transform', 'rotate(' + speedometer + 'deg)');
	} else if(dataScoreVal == 3){
		speedometer += 0;
		$(".movearrow").css('transform', 'rotate(' + speedometer + 'deg)');
	} else {
		if(speedometer == 0){
			speedometer -= 65;
		} else if(speedometer == 65){
			speedometer -= 65;
		} else if(speedometer == -65){
			speedometer -= 0;
		}
		$(".movearrow").css('transform', 'rotate(' + speedometer + 'deg)');
	}
	/* if (dataScoreVal == '5') {			
		speedometer = 90;
		$(".movearrow").css('transform', 'rotate(' + speedometer + 'deg)');
	} else if (dataScoreVal == '3') {
		speedometer = 0;
		$(".movearrow").css('transform', 'rotate(' + speedometer + 'deg)');
	} else {
		speedometer = -90;
		$(".movearrow").css('transform', 'rotate(' + speedometer + 'deg)');
	}*/
}

function buildChart() {
	var ctx = document.getElementById("myChart");
	
	$('#chartjs-tooltip').on('mouseleave', function(){
		document.getElementById('chartjs-tooltip').style.visibility = 'hidden';
	});

	var customTooltips = function(tooltip) {
			// Tooltip Element
			var tooltipEl = document.getElementById('chartjs-tooltip');

			if (!tooltipEl) {
				tooltipEl = document.createElement('div');
				tooltipEl.id = 'chartjs-tooltip';
				//tooltipEl.innerHTML = "<table></table>"
				this._chart.canvas.parentNode.appendChild(tooltipEl);
			}

			// Hide if no tooltip
			if (tooltip.opacity === 0) {
				tooltipEl.style.opacity = 0;
				tooltipEl.style.visibility = 'hidden';
				return;
			}

			// Set caret Position
			tooltipEl.classList.remove('above', 'below', 'no-transform');
			if (tooltip.yAlign) {
				tooltipEl.classList.add(tooltip.yAlign);
			} else {
				tooltipEl.classList.add('no-transform');
			}

			function getBody(bodyItem) {
				return bodyItem.lines;
			}

			// Set Text
			if (tooltip.body) {
				var userText = chartData.uAns[tooltip.dataPoints[0].index];
				var profileText = chartData.u[tooltip.dataPoints[0].index];
				var coachText = chartData.coach[tooltip.dataPoints[0].index];
				var innerHtml='<a href="javascript:void(0);" onClick="closeTooltip()" class="tooltipclose waves-effect waves-light" title="Close"><i class="material-icons "></i></a>';				
				if(profileText.length > 0){								
					innerHtml += '<div class="profile-text profilecmmt">'+profileText+'</div>';
				}
				if(userText.length > 0){
					innerHtml += '<div class="profile-text"><strong>You Said: </strong>'+userText+'</div>';
				}
				if(coachText.length > 0){
					innerHtml += '<div class="usertext"><strong>Coach’s Corner: </strong>'+coachText+'</div>'
				}
				
				var tableRoot = tooltipEl.querySelector('div');
				tableRoot.innerHTML = innerHtml;
			}

			var positionY = this._chart.canvas.offsetTop;
			var positionX = this._chart.canvas.offsetLeft;

			// Display, position, and set styles for font
			tooltipEl.style.opacity = 1;
			tooltipEl.style.visibility = 'visible';
			tooltipEl.style.left = positionX + tooltip.caretX + 'px';
			tooltipEl.style.top = positionY + tooltip.caretY + 'px';
			tooltipEl.style.fontFamily = tooltip._fontFamily;
			tooltipEl.style.fontSize = tooltip.fontSize;
			tooltipEl.style.fontStyle = tooltip._fontStyle;
			tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
			tooltipEl.focus();
};
	
	
	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: chartData.labels,
			datasets: [{
				label: '',
				data: chartData.data,
				backgroundColor: 'rgba(255,255,255,0)',
				borderColor: '#0ba4de',
				borderWidth: 1,
				pointRadius: 10,
				pointHoverRadius:10,
				pointBorderColor: 'rgb(224, 82, 124)',
                pointBackgroundColor: 'rgb(255, 255, 255)',
			}]
		},
		options: {
			events: ['click'],
			legend: {
				//display: false,				
				labels: {
                    usePointStyle: false,
					boxWidth: 0
                }
			},
			scales: {
				yAxes: [{
					display: false,
					ticks: {
						/* max: 30,
						min: -30, */
						beginAtZero:true,
						stepSize: 5
					}
				}]
			},
			elements: {
				line: {
					tension: 0, // disables bezier curves
				}
			},
			tooltips: {
				enabled: false,
				mode: 'index',
				position: 'average',
				custom: customTooltips
			}

		}
	});
	if($(window).width() > 992){		
		var chartht = $('#myChart').height() - 47;
		
	} else if($(window).width() == 768){
		var chartht = $('#myChart').height();
	} else {
		var chartht = $('#myChart').height() - 16;
	}
	$('.canvasmapBttm').css('top',chartht);
	$('.canvasmapLeft').css('width',chartht);
};

function openFeedback(){
	if($(".customerprofile").hasClass("open")){
		$(".customerprofile").removeClass("open");
		$(".user1comment, .user2comment").fadeIn();
	}
	$(".feedbackPopup").addClass("open");
	
	$(".user1comment, .user2comment").fadeOut();
    $(".coachbtn").removeClass("ani-infinite");
	
}

function openProfile(){
	$(".customerprofile").addClass("open");
	$(".user1comment, .user2comment").fadeOut();
   
}

function closeTooltip(){
	$('#chartjs-tooltip').css({'opacity':'0','visibility':'hidden'});
}

var urlhash = window.location.hash.substr(1);

if (urlhash != '') {
	getPages(urlhash);
	
	
}

function resetCourse(){
	parent.blnNavigation = false;
	parent.blnSimulation = true;
	parent.blnDropoff = false;
	resultByStage.maxScore.length=0;
	resultByStage.userScore.length=0;
	resultByStage.avgScore.length=0;
	assessmentScore.userScore.length=0;
	assessmentScore.stageNo.length=0;
	assessmentScore.user.length=0;
	assessmentScore.userAns.length=0;
	assessmentScore.feedback.length=0;
	localStorage.setItem('result', '');
	localStorage.setItem('chartData', '');
	speedometer = 0;
	$(".movearrow").css('transform', 'rotate(' + speedometer + 'deg)');



}

$(document).on('click','.perf-summry',function(){
	parent.gotopage('result.html')	
});
$(document).on('click','.perf-start',function(){
//	parent.gotopage('customer_profile.html')	
	getPages('p1'); // By manish

});

$(document).on("click",".glossary_popup",function() {
							  
	window.parent.document.querySelector('.glossaryscreen').classList.add('open');
	window.parent.document.querySelector('.glossaryscreen').classList.add('marginGlossary');
	window.parent.document.getElementById('glossary').style = 'display:block';
	
	//var iframe = document.getElementById('frame');
	//var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
	//innerDoc.querySelector('.modal-overlay').style = 'display:block';
	//window.parent.document.getElementById('glossary').style = 'margin-top:78px';
	//window.document.getElementById('modal4').style = 'display:none';
});	
