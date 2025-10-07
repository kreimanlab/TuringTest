/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	"instructions/instruct-1.html",
	"instructions/instruct-worker-info.html",
	"instructions/instruct-ready.html",
	"prequestionnaire.html",
	"stage.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"prequestionnaire.html",
	"instructions/instruct-1.html",
	"instructions/instruct-ready.html"
];



/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and
* insert them into the document.
*
********************/

/********************
* TURING TEST       *
********************/

var TuringExperiment = function() {
	console.log('hi');
	psiTurk.recordUnstructuredData("mode", mode);

	var wordon; // time word is presented
	//var listening = false; //keep listening  

	//Mengmi: generate random image list 
	const TotalNumConversation = 160;//700
	const NumConvPerWorker = 20;//20
	var conversationnum = _.range(1,TotalNumConversation+1);
	var lengthlist = [3,6,9,12,15,18,21,24,3,6,9,12,15,18,21,24,3,6,9,12,15,18,21,24,3,6,9,12,15,18,21,24,]
	var conversationlist = [];
	var option1list = [];
	var option2list = [];
	var option3list = [];
	var option4list = [];
	var option5list = [];
	var conversationID = [];
	var trialindex =-1;

    // Load the questionnaire snippet
    //psiTurk.showPage("instructions/instruct-worker-info.html");
	

    conversationnum = _.shuffle(conversationnum);
    lengthlist = _.shuffle(lengthlist)
    for (i = 0; i < NumConvPerWorker; i++) 
    { 
    	var conversationname = "static/dataset/conv" + conversationnum[i] + "_len" + lengthlist[i] + ".html";    	
    	conversationlist.push(conversationname);
    	var option1name = "static/dataset/conv" + conversationnum[i] + "_len" + lengthlist[i] + "option1.html";    	
    	option1list.push(option1name);
    	var option2name = "static/dataset/conv" + conversationnum[i] + "_len" + lengthlist[i] + "option2.html";    	
    	option2list.push(option2name);
    	var option3name = "static/dataset/conv" + conversationnum[i] + "_len" + lengthlist[i] + "option3.html";    	
    	option3list.push(option3name);
    	var option4name = "static/dataset/conv" + conversationnum[i] + "_len" + lengthlist[i] + "option4.html";    	
    	option4list.push(option4name);
    	var option5name = "static/dataset/conv" + conversationnum[i] + "_len" + lengthlist[i] + "option5.html";    	
    	option5list.push(option5name);
	} 

	// Stimuli for a basic Turing experiment	
	psiTurk.recordUnstructuredData("condition", condition);

	
	var next = function() {
		if (conversationlist.length===0) {
			finish();
		}
		else {
			conversationID = conversationlist[0];
			console.log("conv ID")
			console.log(conversationID)
			console.log("conv list")
			console.log(conversationlist)
			current_conversation = conversationlist.shift();
			current_option1 = option1list.shift();
			current_option2 = option2list.shift();
			current_option3 = option3list.shift();
			current_option4 = option4list.shift();
			current_option5 = option5list.shift();				
			trialindex = trialindex+1;	
			
			$('#stimdisplay').attr('src', current_conversation);
			$('#stimopt1').attr('src', current_option1);
			$('#stimopt2').attr('src', current_option2);
			$('#stimopt3').attr('src', current_option3);
			$('#stimopt4').attr('src', current_option4);
			$('#stimopt5').attr('src', current_option5);
			wordon = new Date().getTime();	
			
		}
	};

	var finish = function() {
	    //$("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new Questionnaire();
	};
	

	// Load the stage.html snippet into the body of the page
	psiTurk.showPage('stage.html');

	// Register the response handler that is defined above to handle any
	// key down events.
	//$("body").focus().keydown(response_handler);

	// Start the test; initialize everything
	next();
	document.getElementById("submittrial").addEventListener("click", mengmiClick);

	function mengmiClick() 
	{
	
		if(!document.querySelector('input[type="radio"][name="Aclass"]:checked') || !document.querySelector('input[type="radio"][name="Bclass"]:checked') || !document.querySelector('input[type="radio"][name="topic"]:checked')){
			alert("Warning: please select all the answers");
		} 
		
		//var Aclass = document.getElementById("Aclass").value;
		var Aclass = document.querySelector('input[type="radio"][name="Aclass"]:checked').value;
		var Agender = document.querySelector('input[type="radio"][name="Agender"]:checked').value;
		//var Aage = document.querySelector('input[type="radio"][name="Aage"]:checked').value;
		//var Agender = document.getElementById("Agender").value;
		//var Aage = document.getElementById("Aage").value;
		//var Bclass = document.getElementById("Bclass").value;
		var Bclass = document.querySelector('input[type="radio"][name="Bclass"]:checked').value;
		var Bgender = document.querySelector('input[type="radio"][name="Bgender"]:checked').value;
		//var Bage = document.querySelector('input[type="radio"][name="Bage"]:checked').value;
		//var Bgender = document.getElementById("Bgender").value;
		//var Bage = document.getElementById("Bage").value;
		
		//var combined_response = Aclass + "___" + Agender + "___" + Aage + "___" + Bclass + "___" + Bgender + "___" + Bage
		var topic = document.querySelector('input[type="radio"][name="topic"]:checked').value;
		
		//var combined_response = Aclass + "___" + Bclass
		//var combined_response = Aclass + "___" + Agender + "___" + Aage + "___" + Bclass + "___" + Bgender + "___" + Bage + "___" + topic
		var combined_response = Aclass + "___" + Agender + "___" + Bclass + "___" + Bgender + "___" + topic
		
		console.log("combined response is")
		console.log(combined_response)
		if (! combined_response.includes("notchosen")) 
		{
			//document.getElementById("demo").innerHTML = response;
			var rt = new Date().getTime() - wordon;
			
			psiTurk.recordTrialData({'phase':"TEST",
	                                 'conversationID':conversationID, //conversation name presented                                
	                                 'response':combined_response, //worker response for conversation name
	                                 'Aclass':Aclass,
	                                 'Agender':Agender,
	                                 'Bclass':Bclass,
	                                 'Bgender':Bgender,
	                                 'topic':topic,
	                                 
	                                 'hit':conversationnum[trialindex], //index of conversation name
	                                 'hit_len':lengthlist[trialindex], //length of the current snippet
	                                 'rt':rt, //response time
	                             	 'trial': trialindex+1} //trial index starting from 1
	                               );
	                               
	                //reset dropdown menus
	                $('input[name="Aclass"]').attr('checked',false);
	                $('input[name="Bclass"]').attr('checked',false);
	                $('input[name="Agender"]').attr('checked',false);
	                $('input[name="Bgender"]').attr('checked',false);
	                $('input[name="Aage"]').attr('checked',false);
	                $('input[name="Bage"]').attr('checked',false);
	                $('input[name="topic"]').attr('checked',false);

		    next();
		
		}
	    else
	    {
	    	window.alert("Warning: please choose all the two responses before submitting your response!");
	    }

	}


};


/****************
* Questionnaire *
****************/

var Questionnaire = function() {


	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});

	};

	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);

		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt);
				psiTurk.completeHIT();
			},
			error: prompt_resubmit
		});
	};

	
	// Load the questionnaire snippet
	psiTurk.showPage('postquestionnaire.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'begin'});
	

	$("#next").click(function () {
	    record_responses();
	    psiTurk.saveData({
            success: function(){
                psiTurk.computeBonus('compute_bonus', function() { 
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 
            }, 
            error: prompt_resubmit});

	});


};

function preques_submit() {
	
    record_responses = function() {
        age = document.getElementById("age").value;
        gender = document.getElementById("gender").value;
        education = document.getElementById("education").value;
        country = document.getElementById("country").value;
        native = document.getElementById("native").value;
        
        if (age.length>0 && gender.length>0 && education.length>0 && country.length>0 && native.length>0)
        {
            psiTurk.recordTrialData({'phase':'prequestionnaire', 'status':'submit'});
            psiTurk.recordUnstructuredData('age', age);
            psiTurk.recordUnstructuredData('gender', gender);
            psiTurk.recordUnstructuredData('education', education);
            psiTurk.recordUnstructuredData('country', country);
            psiTurk.recordUnstructuredData('native', native);
            psiTurk.showPage("instructions/instruct-1.html")
        }
        else
        {
            window.alert("Warning: Please answer all the question!!");
        }
	};
    record_responses();
}

function instruct_ready() {
     psiTurk.showPage("instructions/instruct-ready.html")
}

function begin_experiment() {
    currentview = new TuringExperiment();
}


// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.showPage("prequestionnaire.html");
});

//$(window).load( function(){
//   psiTurk.doInstructions(
//    	instructionPages, // a list of pages you want to display in sequence
//    	function() { currentview = new TuringExperiment(); } // what you want to do when you are done with instructions
//    );
//});
