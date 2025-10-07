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
	"stage.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
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
	const TotalNumConversation = 46;
	const NumConvPerWorker = 2;//2
	var conversationnum = _.range(1,TotalNumConversation+1);
	var lengthlist = [3,6,9,12,15]
	var conversationlist = [];
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
			trialindex = trialindex+1;	
			
			$('#stimdisplay').attr('src', current_conversation);
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
		var Aclass = document.getElementById("Aclass").value;
		var Agender = document.getElementById("Agender").value;
		var Aage = document.getElementById("Aage").value;
		var Bclass = document.getElementById("Bclass").value;
		var Bgender = document.getElementById("Bgender").value;
		var Bage = document.getElementById("Bage").value;
		
		var combined_response = Aclass + "___" + Agender + "___" + Aage + "___" + Bclass + "___" + Bgender + "___" + Bage
		console.log("combined response is")
		console.log(combined_response)
		if (! combined_response.includes("notchosen")) 
		{
			//document.getElementById("demo").innerHTML = response;
			var rt = new Date().getTime() - wordon;

			psiTurk.recordTrialData({'phase':"TEST",
	                                 'conversationID':conversationID, //conversation name presented                                
	                                 'response':combined_response, //worker response for conversation name
	                                 //'Aclass':Aclass,
	                                 'Agender':Agender,
	                                 'Aage':Aage,
	                                 'Bclass':Bclass,
	                                 'Bgender':Bgender,
	                                 'Bage':Bage,
	                                 
	                                 'hit':conversationnum[trialindex], //index of conversation name
	                                 'rt':rt, //response time
	                             	 'trial': trialindex+1} //trial index starting from 1
	                               );
	                               
	                //reset dropdown menus
	                $('select').val('notchosen');

		    next();
		}
	    else
	    {
	    	window.alert("Warning: please choose all the six responses before submitting your response!");
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
	
	document.getElementById("next").addEventListener("click", mengmiClickQuestionnaire);
	
	function mengmiClickQuestionnaire() 
	{
		var Wgender = document.getElementById("Wgender").value;
		var Wage = document.getElementById("Wage").value;
		var Wlanguage = document.getElementById("Wlanguage").value;
		var Wdegree = document.getElementById("Wdegree").value;
		var Wfield = document.getElementById("Wfield").value;
		
		
		var Wcombined_response = Wgender + "___" + Wage + "___" + Wlanguage + "___" + Wdegree + "___" + Wfield
		console.log("W combined response is")
		console.log(Wcombined_response)
		if (! Wcombined_response.includes("notchosen")) 
		{
			//document.getElementById("demo").innerHTML = response;
			
			psiTurk.recordTrialData({'phase':"postquestionnaire",
	                                 'Wresponse':Wcombined_response, //worker response for conversation name
	                                 //'Aclass':Aclass,
	                                 'Wgender':Wgender,
	                                 'Wage':Wage,
	                                 'Wlanguage':Wlanguage,
	                                 'Wdegree':Wdegree,
	                                 'Wfield':Wfield,} 
	                               );
		    //next();
	    	    record_responses();
		    psiTurk.saveData({
		    success: function(){
		    	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
		    },
		    error: prompt_resubmit});
		}
	    else
	    {

	    	window.alert("Warning: please choose all the responses before submitting your response!");
	    }

	}

	$("#next").click(function () {

	});


};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new TuringExperiment(); } // what you want to do when you are done with instructions
    );
});
