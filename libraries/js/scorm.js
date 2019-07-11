var lesson_location = "";
var suspend_data = "";

var arrayTopic;
var strUserAnswer;
var strAvgScore;

function getLMSdata() {
    lesson_location = doLMSGetValue('cmi.core.lesson_location');
    suspend_data = doLMSGetValue('cmi.suspend_data');
    
    
    if (lesson_location != "" && lesson_location != null) {
         if (confirm("Would you like to return to the bookmarked page?")) {
            //alert("arrayTopic:: "+arrayTopic)
            bookMark(lesson_location)

        }
    }
    
    if (lesson_location != "" && lesson_location != null) {
        var suspendData = suspend_data.split("|");
        //var result = suspendData[0];
        //var chartData = suspendData[1];
        localStorage.setItem('result', suspendData[0]);
        localStorage.setItem('chartData', suspendData[1]);
    }
    //alert("suspend_data"+suspend_data)

    /*if (suspend_data != "" && suspend_data != null) {
        arrayTopic = suspend_data.split("|")[1];

        strUserAnswer = suspend_data.split("|")[2];

        strAvgScore = suspend_data.split("|")[3];


        if (confirm("Would you like to return to the bookmarked page?")) {
            //alert("arrayTopic:: "+arrayTopic)
            bookMark(arrayTopic)

        }
    }*/


}

function setLMSdata() {
    suspend_data = doLMSGetValue('cmi.suspend_data');
    doLMSCommit();
    doLMSFinish();
}

function bookMark(topic) {
    $(".launch-wrap").addClass('hidewrap');
    gotopage(topic);
    
   /* if (topic == "obj") {
        parent.window.document.getElementById("frame").src = "objective.html";
        $(".launch-wrap").addClass('hidewrap');
    } else if (topic == "sim") {
        parent.window.document.getElementById("frame").src = "simulation.html";
        $(".launch-wrap").addClass('hidewrap');
    } else {
        parent.window.document.getElementById("frame").src = "simulation.html";

        $(".launch-wrap").addClass('hidewrap');

        setTimeout(loadSimPage, 1000);
    }*/

}

/*function loadSimPage() {
    var temp = "'" + arrayTopic + "'";
    parent.window.document.getElementById("frame").contentWindow.getPages('p1', temp);
    parent.simulationHelpPopup = false;
    setTimeout(loadPages, 1000);
}

function loadPages() {
    var temp = arrayTopic;
    parent.window.document.getElementById("frame").contentWindow.loadPage(temp);
    //alert(parent.window.document.getElementById("frame").contentWindow.assessmentScore.userScore+" UPAR loadPages ")
    if ((strUserAnswer != "") && (strUserAnswer != undefined)) {
        parent.window.document.getElementById("frame").contentWindow.assessmentScore.userScore = strUserAnswer.split("$$$$");
        //alert(parent.window.document.getElementById("frame").contentWindow.assessmentScore.userScore+" loadPages ")
    } else {
        parent.window.document.getElementById("frame").contentWindow.assessmentScore.userScore = [];
    }

    if ((strAvgScore != "") && (strAvgScore != undefined)) {
        parent.window.document.getElementById("frame").contentWindow.resultByStage.avgScore = strAvgScore.split("$$$$");
        //alert(parent.window.document.getElementById("frame").contentWindow.resultByStage.avgScore+" loadPages ")
    } else {
        parent.window.document.getElementById("frame").contentWindow.resultByStage.avgScore = [];
    }

}*/