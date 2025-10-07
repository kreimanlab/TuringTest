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
	"instructions/instruct-1_free.html"
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
* STROOP TEST       *
********************/
var TurExperiment  = function() {
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


	const n_participants = 150
	var max_trials = 50;
	let participants_num_list = _.range(0,n_participants );
	//let groups = _.range(n_groups)

	var Associationslist = [];
	var hitKeysList = [];
	var AssociationID = [];
	var trialindex =-1;
	var AI_human = ["AI", "human"]
	//let random_AI_human = _.range(0,2);

	var n = 25
	let random_AI_human = new Array(max_trials);//n_participants
	for (let i=0; i< n; ++i) random_AI_human[i] = 0;
	for (let j=n; j< max_trials; ++j) random_AI_human[j] = 1;
	// Log to console
	//console.log(a)

	let random_model = _.range(0,5);
	let current_ass = ''
	var models = ["word2vec","gpt2","gpt3emb","gpt3promptcurie","gpt3promptdav"];
    // Load the questionnaire snippet
    //psiTurk.showPage("instructions/instruct-worker-info.html");


    //conversationnum = _.shuffle(conversationnum);

    // lengthlist = _.shuffle(lengthlist)

		for (participant= 0; participant <   max_trials; participant++)//
		{
			//for (participant_num=0; participant_num < n_participants; participant_num++)
			//{
			participants_num_list  = _.shuffle(participants_num_list );
			random_AI_human = _.shuffle(random_AI_human);
			//var cue_word_path = "static/dataset/cue_words/" +  selected_cat[cat_num] +"/" + groups[group_num].toString() + "/" + participants_num_list[0].toString() + ".html";
			if (random_AI_human[0] === 0) {
					var cue_word_path = "static/dataset/human/" +  random_model[0].toString() + "/" +  participants_num_list[0].toString() + ".html";
			} else {
				random_model = _.shuffle(random_model);
				var cue_word_path = "static/dataset/AI/" + random_model[0].toString() + "/" +  participants_num_list[0].toString() + ".html";
			}


			console.log(cue_word_path)
			console.log(participants_num_list[0].toString() )
			Associationslist.push(cue_word_path);
			var cur_key = 'participant_' + participants_num_list[0].toString()
			current_ass = Associationslist[0]
			hitKeysList.push(cur_key)
			participants_num_list.shift()
			random_AI_human.shift()
			//}
		}


	// Stimuli for a basic Turing experiment
	psiTurk.recordUnstructuredData("condition", condition);


	var next = function() {
		//let current_ass
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
			console.log('questionnaire')
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
	for (const checkbox of document.querySelectorAll('.imChecked')) {
	checkbox.checked = false //for unselection
	}

	// for (const checkbox2 of document.querySelectorAll('.imChecked_gender')) {
	// checkbox2.checked = false //for unselection
	// }
	function mengmiClick()
	{
		console.log('mengmi clicked')
		let guess_decision_zero = document.getElementById("guess_decision");
		let guess_decision = guess_decision_zero.elements["guess_decision"].value
		//let guess_gender_zero = document.getElementById("guess_gender");
		//let guess_gender = guess_gender_zero.elements["guess_gender"].value
		console.log('should print now')
		document.getElementById("guess_decision").value = "";
		document.getElementById("guess_decision").checked = false;
		//document.getElementById("guess_gender").checked = false;
		//document.querySelector("guess_decision").checked = false;
		//document.querySelectorAll('.imChecked').forEach(c=> c.checked=1)
		for (const checkbox of document.querySelectorAll('.imChecked')) {
		checkbox.checked = false //for unselection
		}

		// for (const checkbox2 of document.querySelectorAll('.imChecked_gender')) {
		// checkbox2.checked = false //for unselection
		// }

		//var Agender = document.getElementById("Agender").value;
		//var Aage = document.getElementById("Aage").value;
		//var Bclass = document.getElementById("Bclass").value;
		//var Bgender = document.getElementById("Bgender").value;
		//var Bage = document.getElementById("Bage").value;
		//+'_' + guess_gender +
		var combined_response = "guessis_" + guess_decision + "_realis_" + AI_human[random_AI_human] + "_model_" + models[random_model[0]] + "_prompt_" + current_ass  //Aclass + "___" + Agender + "___" + Aage + "___" + Bclass + "___" + Bgender + "___" + Bage
		console.log("combined response is")
		console.log(combined_response)
		//&& guess_gender != null  && guess_gender.trim().length != 0 && guess_gender.indexOf(' ') < 0
		if (guess_decision != null  && guess_decision.trim().length != 0 && guess_decision.indexOf(' ') < 0 )
		{
			//document.getElementById("demo").innerHTML = response;
			var rt = new Date().getTime() - wordon;

			psiTurk.recordTrialData({'phase':"TEST",
																'prompt': current_ass,
	                                 'AssociationID':AssociationID, //conversation name presented
	                                 'response':combined_response, //worker response for conversation name
					 											 'guess_decision':guess_decision ,

	                                 'hit':hitKeysList[trialindex] , //conversationnum[trialindex], //index of conversation name
	                                 'rt':rt, //response time
	                             	 'trial': trialindex+1,
															 'model': models[random_model[0]],
															 'real_agent': AI_human[random_AI_human]
														 } //trial index starting from 1
													 );//'guess_gender':guess_gender ,

	                //reset dropdown menus
	                $('select').val('notchosen');

		   next();


		}
	    else
	    {
	    	window.alert("Warning: please answer both questions!");
	    }


	}


};

//
// = function() {
//
// 	var wordon; // time word is presented
//
// 	var imagelist = [];
//     var trialindex =-1;
//
//     var TOTAL_IMAGES = 1000;
//     var NUM_TRIALS = 10;
//     var TRIAL_IMAGES = _.range(1, TOTAL_IMAGES+1);
//     TRIAL_IMAGES = _.shuffle(TRIAL_IMAGES);
//     TRIAL_IMAGES = TRIAL_IMAGES.slice(0, NUM_TRIALS);
//
//     for (i = 0; i < NUM_TRIALS; i++)
//     {
//         imagenum = TRIAL_IMAGES[i].toString();
//         while (imagenum.length < 4) imagenum = "0" + imagenum;
//
//         var imagename = "/static/images/imgset/" + imagenum + ".jpg";
//         imagelist.push(imagename);
//     }
//
//     psiTurk.preloadImages(imagelist);
//
// 	var next = function() {
// 		if (imagelist.length===0) {
// 			finish();
// 		}
// 		else {
// 			wordon = new Date().getTime();
//             current_img = imagelist.shift();
//             trialindex = trialindex + 1;
//             d3.select("#stim").html('<img src='+current_img+' alt="stimuli" width="680" height="680">');
//
// 			// d3.select("#stim").html('<img src="/static/images/imgset/0099.jpg" alt="stimuli" width="600" height="530">');
// 			document.getElementById("submittrial").addEventListener("click", submitClick);
//
//             speaker_ai.checked = false;
//             speaker_human.checked = false;
//
//             gender_female.checked = false;
//             gender_male.checked = false;
// 		}
// 	};
//
//
// 	var finish = function() {
// 	    // $("body").unbind("keydown", response_handler); // Unbind keys
// 	    currentview = new Questionnaire();
// 	};
//
//
// 	// Load the stage_free.html snippet into the body of the page
// 	psiTurk.showPage('stage_free.html');
//
//     const speaker_ai = document.getElementById("ai");
//     const speaker_human = document.getElementById("human");
//
//     const gender_female = document.getElementById("female");
//     const gender_male = document.getElementById("male");
// 	// Register the response handler that is defined above to handle any
// 	// key down events.
// 	// $("body").focus().keydown(response_handler);
//
// 	// Start the test
// 	next();
//
// 	document.getElementById("submittrial").addEventListener("click", submitClick);
//
//
// 	function submitClick()
// 		{
//             let response_speaker;
//             let response_gender;
//
// 			var rt = new Date().getTime() - wordon;
//
//
//             if ((speaker_ai.checked || speaker_human.checked) && (gender_female.checked || gender_male.checked) && rt > 3000)
// 			{
//
//                 if (speaker_ai.checked)
//                 {
//                     response_speaker = "ai";
//                 }
//
//                 if (speaker_human.checked)
//                 {
//                     response_speaker = "human";
//                 }
//
//                 if (gender_female.checked)
//                 {
//                     response_gender = "female";
//                 }
//
//                 if (gender_male.checked)
//                 {
//                     response_gender = "male";
//                 }
//
// 				psiTurk.recordTrialData({'phase': "TEST",
// 		                                 'imageID': current_img, //image name presented
// 		                                 'caption': '', //worker response for image name
//                                          // 'groundtruth': ,
//                                          'response_speaker': response_speaker,
//                                          'response_gender': response_gender,
//                                          'hit': true,
// 		                                 'counterbalance': mycounterbalance+1, //type of choices in that trial
// 		                                 'rt':rt, //response time
// 		                             	 'trial': trialindex+1} //trial index starting from 1
// 		                               );
// 			    next();
// 			}
// 		    else
// 		    {
//                 if (rt <= 3000)
//                 {
//                     window.alert("Warning: Please view the image and read the caption carefully!!");
//                 }
//                 if (!((speaker_ai.checked || speaker_human.checked) && (gender_female.checked || gender_male.checked)))
//                 {
//                     window.alert("Warning: Please answer all questions!!");
//                 }
// 		    }
// 		}
// };
//

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
        //gender = document.getElementById("gender").value;
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


function begin_experiment() {
		console.log('begin')
    currentview = new TurExperiment();
}


// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.showPage("prequestionnaire.html");
});

// Task object to keep track of the current phase
// var currentview;
//
// /*******************
//  * Run Task
//  ******************/
// $(window).load( function(){
//     psiTurk.doInstructions(
// 			console.log('do inst')
//     	instructionPages, // a list of pages you want to display in sequence
// 			console.log('do inst 2')
//     	function() { currentview = new TuringExperiment(); } // what you want to do when you are done with instructions
//     );
// });
