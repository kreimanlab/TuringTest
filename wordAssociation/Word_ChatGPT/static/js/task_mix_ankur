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
	"instructions/instruct-1_free.html",
	"instructions/instruct-worker-info.html",
	"instructions/instruct-ready.html",
	"prequestionnaire.html",
	"stage_free.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"prequestionnaire.html",
	"instructions/instruct-1_free.html",
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
	const TotalNumAss = 500;
	//const n_groups = 10
	const NumAssPerWorker = 50;//2
	// var conversationnum = _.range(1,TotalNumAss+1);
	//const selected_cat = ["NN","JJ","RB","VB","IN"];


	const n_participants = 5

	let participants_num_list = _.range(0,n_participants );
	//let groups = _.range(n_groups)

	var Associationslist = [];
	var hitKeysList = [];
	var AssociationID = [];
	var trialindex =-1;

    // Load the questionnaire snippet
    //psiTurk.showPage("instructions/instruct-worker-info.html");


    //conversationnum = _.shuffle(conversationnum);

    // lengthlist = _.shuffle(lengthlist)

		for (participant= 0; participant <   n_participants; participant++)//
		{
			//for (participant_num=0; participant_num < n_participants; participant_num++)
			//{
			participants_num_list  = _.shuffle(participants_num_list );
			//var cue_word_path = "static/dataset/cue_words/" +  selected_cat[cat_num] +"/" + groups[group_num].toString() + "/" + participants_num_list[0].toString() + ".html";
			var cue_word_path = "static/dataset/0/" + participants_num_list[0].toString() + ".html";
			console.log(cue_word_path)
			console.log(participants_num_list[0].toString() )
			Associationslist.push(cue_word_path);
			var cur_key = 'participant_' + participants_num_list[0].toString()
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
	psiTurk.showPage('stage_free.html');

	// Register the response handler that is defined above to handle any
	// key down events.
	//$("body").focus().keydown(response_handler);

	// Start the test; initialize everything
	next();

	document.getElementById("submittrial").addEventListener("click", mengmiClick);

	function mengmiClick()
	{
		let guess_word = document.getElementById("guess_word").value;
		document.getElementById("guess_word").value = "";
		//var Agender = document.getElementById("Agender").value;
		//var Aage = document.getElementById("Aage").value;
		//var Bclass = document.getElementById("Bclass").value;
		//var Bgender = document.getElementById("Bgender").value;
		//var Bage = document.getElementById("Bage").value;

		var combined_response = guess_word//Aclass + "___" + Agender + "___" + Aage + "___" + Bclass + "___" + Bgender + "___" + Bage
		console.log("combined response is")
		console.log(combined_response)
		if (combined_response != null  && combined_response.trim().length != 0 && combined_response.indexOf(' ') >= 0)
		{
			//document.getElementById("demo").innerHTML = response;
			var rt = new Date().getTime() - wordon;

			psiTurk.recordTrialData({'phase':"TEST",
	                                 'AssociationID':AssociationID, //conversation name presented
	                                 'response':combined_response, //worker response for conversation name
					 'guess_word ':guess_word ,
	                                 'hit':hitKeysList[trialindex] , //conversationnum[trialindex], //index of conversation name
	                                 'rt':rt, //response time
	                             	 'trial': trialindex+1} //trial index starting from 1
	                               );

	                //reset dropdown menus
	                $('select').val('notchosen');

		   next();


		}
	    else
	    {
	    	window.alert("Warning: please write a valid answer (one word, no spaces)!");
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
                psiTurk.computeBonus('compute_bonus', function(){
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                });


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


function instruct_ready() {
     psiTurk.showPage("instructions/instruct-ready.html")
}

function preques_submit() {

    record_responses = function() {

        native = document.getElementById("native").value;
        age = document.getElementById("age").value;
        gender = document.getElementById("gender").value;
        education = document.getElementById("education").value;
        country = document.getElementById("country").value;

        if (native.length>0 && age.length>0 && gender.length>0 && education.length>0 && country.length>0)
        {
            psiTurk.recordTrialData({'phase':'prequestionnaire', 'status':'submit'});
            psiTurk.recordUnstructuredData('native', native);
            psiTurk.recordUnstructuredData('age', age);
            psiTurk.recordUnstructuredData('gender', gender);
            psiTurk.recordUnstructuredData('education', education);
            psiTurk.recordUnstructuredData('country', country);
            psiTurk.showPage("instructions/instruct-1_free.html")
        }
        else
        {
            window.alert("Warning: Please answer all the question!!");
        }
	};
    record_responses();
}

//
// function begin_experiment() {
//     currentview = new TurExperiment();
// }


// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
// $(window).load( function(){
//     psiTurk.showPage("prequestionnaire.html");
// });

//
// /****************
// * Questionnaire *
// ****************/
//
// var Questionnaire = function() {
//
//
// 	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";
//
// 	record_responses = function() {
//
// 		psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});
//
// 		$('select').each( function(i, val) {
// 			psiTurk.recordUnstructuredData(this.id, this.value);
// 		});
//
// 	};
//
// 	prompt_resubmit = function() {
// 		document.body.innerHTML = error_message;
// 		$("#resubmit").click(resubmit);
// 	};
//
// 	resubmit = function() {
// 		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
// 		reprompt = setTimeout(prompt_resubmit, 10000);
//
// 		psiTurk.saveData({
// 			success: function() {
// 			    clearInterval(reprompt);
// 				psiTurk.completeHIT();
// 			},
// 			error: prompt_resubmit
// 		});
// 	};
//
//
// 	// Load the questionnaire snippet
// 	psiTurk.showPage('postquestionnaire.html');
// 	psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'begin'});
//
// 	document.getElementById("next").addEventListener("click", mengmiClickQuestionnaire);
//
// 	function mengmiClickQuestionnaire()
// 	{	//let guess_word = document.getElementById("guess_word").value;
// 		var Wgender = document.getElementById("Wgender").value;
// 		var Wage = document.getElementById("Wage").value;
// 		var Wlanguage = document.getElementById("Wlanguage").value;
// 		var Wdegree = document.getElementById("Wdegree").value;
// 		var Wfield = document.getElementById("Wfield").value;
//
//
// 		var Wcombined_response = Wgender + "___" + Wage + "___" + Wlanguage + "___" + Wdegree + "___" + Wfield
// 		console.log("W combined response is")
// 		console.log(Wcombined_response)
// 		if (! Wcombined_response.includes("notchosen"))
// 		{
// 			//document.getElementById("demo").innerHTML = response;
//
// 			psiTurk.recordTrialData({'phase':"postquestionnaire",
// 	                                 'Wresponse':Wcombined_response, //worker response for conversation name
// 	                                 //'Aclass':Aclass,
// 	                                 'Wgender':Wgender,
// 	                                 'Wage':Wage,
// 	                                 'Wlanguage':Wlanguage,
// 	                                 'Wdegree':Wdegree,
// 	                                 'Wfield':Wfield,}
// 	                               );
// 		    //next();
// 	    	    record_responses();
// 		    psiTurk.saveData({
// 		    success: function(){
// 		    	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
// 		    },
// 		    error: prompt_resubmit});
// 		}
// 	    else
// 	    {
//
// 	    	window.alert("Warning: please choose all the responses before submitting your response!");
// 	    }
//
// 	}
//
// 	$("#next").click(function () {
//
// 	});
//
//
// };
//
// // Task object to keep track of the current phase
// var currentview;
//
// /*******************
//  * Run Task
//  ******************/
$(window).load( function(){
    psiTurk.doInstructions(

    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new TuringExperiment(); } // what you want to do when you are done with instructions
    );
});
