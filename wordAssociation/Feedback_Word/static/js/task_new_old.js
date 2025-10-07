/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);
console.log("here it is 0")
//var mycondition = condition;  // these two variables are passed by the psiturk server process
//var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to

// they are not used in the stroop code but may be useful to you

// All pages to be loaded



console.log("here it is 0.1")
let type_request = [0,1];
type_request  = _.shuffle(type_request);
console.log("here it is 1")
var pages = [
	"prequestionnaire.html"
	"instructions/instruct-1_prompt.html",
	"instructions/instruct-worker-info.html",
	"instructions/instruct-ready.html",
	"stage_prompt.html",

];
psiTurk.preloadPages(pages);
var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-1_prompt.html",
	"instructions/instruct-ready.html"
];
console.log("here it is 2")
// if  (type_request[0] == 0) {
// 	var instructionPages = [ // add as a list as many pages as you like
// 		"instructions/instruct-1_free.html",
// 		"instructions/instruct-ready.html"
// 	];
// 	var pages = [
// 		"prequestionnaire.html",
// 		"instructions/instruct-1_free.html",
// 		"instructions/instruct-worker-info.html",
// 		"instructions/instruct-ready.html",
// 		"stage_free.html",
// 		"prequestionnaire.html"
//
// 	];
//
// } else {
// 	var pages = [
// 		"prequestionnaire.html"
// 		"instructions/instruct-1_prompt.html",
// 		"instructions/instruct-worker-info.html",
// 		"instructions/instruct-ready.html",
// 		"stage_prompt.html",
//
// 	];
// 	var instructionPages = [ // add as a list as many pages as you like
// 		"instructions/instruct-1_prompt.html",
// 		"instructions/instruct-ready.html"
// 	];
//
// }

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
	psiTurk.showPage('prequestionnaire.html');
	psiTurk.recordTrialData({'phase':'prequestionnaire', 'status':'begin'});

	document.getElementById("next").addEventListener("click", mengmiClickQuestionnaire);

	function mengmiClickQuestionnaire()
	{	//let guess_word = document.getElementById("guess_word").value;
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

var TuringExperiment = function() {
	console.log('hi');
	psiTurk.recordUnstructuredData("mode", mode);

	var wordon; // time word is presented
	//var listening = false; //keep listening

	//Mengmi: generate random image list
	const TotalNumAss = 150;
	//const n_groups = 10
	const NumAssPerWorker = 50;//2
	// var conversationnum = _.range(1,TotalNumAss+1);
	// const selected_cat = ["NN","JJ","RB","VB","IN"];


	const n_participants = 150

	let assoc_num_list = _.range(0,TotalNumAss );

	//let groups = _.range(n_groups)

	var Associationslist = [];
	var hitKeysList = [];
	var AssociationID = [];
	var trialindex =-1;
		for (assoc_counter = 0; assoc_counter <  NumAssPerWorker; assoc_counter++)//
		{
			//for (participant_num=0; participant_num < n_participants; participant_num++)
			//{
			assoc_num_list  = _.shuffle(assoc_num_list );
			var cue_word_path = "static/dataset/" + type_request[0].toString() +"/"+ assoc_num_list[0].toString() + ".html";
			console.log(cue_word_path)
			console.log(assoc_num_list[0].toString() )
			Associationslist.push(cue_word_path);
			var cur_key =  assoc_num_list[0].toString()
			hitKeysList.push(cur_key)
			//}
		}


	// Stimuli for a basic Turing experiment
	psiTurk.recordUnstructuredData("condition", condition);


	var next = function() {
		let current_ass
		if (Associationslist.length==0) {
			finish();
		}
		else {
			AssociationID = Associationslist[0];
			console.log('it is the next function')
			console.log("conv ID")
			console.log(AssociationID)
			console.log("conv list")
			console.log(Associationslist)
			current_ass = Associationslist.shift();
			trialindex = trialindex+1;

			$('#stimdisplay').attr('src', current_ass);
			wordon = new Date().getTime();


		}
	};

	var finish = function() {
	    //$("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new Questionnaire();
	};


	// Load the stage.html snippet into the body of the page
if  (type_request[0] == 0) {
	psiTurk.showPage('stage_free.html');
} else {
	psiTurk.showPage('stage_prompt.html');
}

	next();

	document.getElementById("submittrial").addEventListener("click", mengmiClick);

	function mengmiClick()
	{
		let guess_word = document.getElementById("guess_word").value;
		document.getElementById("guess_word").value = "";
		var combined_response = guess_word//Aclass + "___" + Agender + "___" + Aage + "___" + Bclass + "___" + Bgender + "___" + Bage
		console.log("combined response is")
		console.log(combined_response)
		if (combined_response != null  && combined_response.trim().length != 0)
		{
			//document.getElementById("demo").innerHTML = response;
			var rt = new Date().getTime() - wordon;

			psiTurk.recordTrialData({'phase':"TEST", 'type_procedure':type_request[0]  ,
	                                 'AssociationID':AssociationID, //conversation name presented
	                                 'response':combined_response, //worker response for conversation name
					 'guess_word ':guess_word ,
	                                 'hit':hitKeysList[trialindex] , //save the number of tthe word
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
