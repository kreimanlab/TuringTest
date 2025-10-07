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
	const {promises: fs} = require('fs')
	var wordon; // time word is presented
	//var listening = false; //keep listening  

	//Mengmi: generate random image list 
	// const TotalNumAss = 500;
	//const n_groups = 16
	//const NumAssPerWorker = 80;//2
	// var conversationnum = _.range(1,TotalNumAss+1);
	//const selected_cat = ["JJ","NN","RB","VB","IN"];
	
	
	//const n_participants = 25

	//let participants_num_list = _.range(0,n_participants );
	//let groups = _.range(n_groups)
	var numCueWordsToTake = 50;
	let human_or_AI = [0,1];
	var pairsList = [];
	var storeResponseList = [];
	//var AssociationID = [];
	var trialindex =-1;
	var allCueWords = [];

	var testFolder2 = 'static/dataset/cue_words/'
	fs.readdirSync(testFolder2).forEach(file => {
		if (! file.includes('.')) {
			allCueWords.push(file);
		}

	});

    // Load the questionnaire snippet
    //psiTurk.showPage("instructions/instruct-worker-info.html");
	const getNumFiles = async(dir) => {
		const files = await fs.readdir(dir)
		console.log('num files to use')
		console.log(files.length)

	}
	var dir_cue_words = getNumFiles('static/dataset/cue_words/')

    //conversationnum = _.shuffle(conversationnum);

    // lengthlist = _.shuffle(lengthlist)
	let num_files_per_cue
	let optional_vals
	let addi

	let guess_word_to_use = [];
	let cue_word_to_use = [];
	let cue_word_cur = '';
	let guess_path = '';
	for (cue_word_num = 0; cat_word_num <  numCueWordsToTake; cue_word_num ++)
    {
		allCueWords = _.shuffle(allCueWords)
		cue_word_cur = allCueWords.shift();
		human_or_AI = _.shuffle(human_or_AI)
		if (human_or_AI[0] == 0) {
			guess_path = 'static/dataset/cue_words/'+ cue_word_cur + '/human'
			//num_files_per_cue = getNumFiles(guess_path )
			addi = 'human'
		}
		else
		{
			guess_path = 'static/dataset/cue_words/'+ cue_word_cur + '/AI';
			//num_files_per_cue = getNumFiles(guess_path  )
			addi = 'AI'
		}
		fs.readdirSync(guess_path).forEach(file => {
			if ( file.includes('.')) {
				optional_vals.push(file);
			}

		});

		//optional_vals = _.range(0, num_files_per_cue)
		optional_vals = _.shuffle(optional_vals)



		var guess_word_path = "static/dataset/cue_words/" +  cue_word_cur +"/" + addi + "/" + optional_vals[0] ;
		//Associationslist.push(cue_word_path);
		guess_word_to_use.push(guess_word_path)
		cue_word_to_use.push(cue_word_cur)
		var cur_key = 'cue_' + cue_word_cur + '_guess_' + optional_vals[0] + '_by_' + addi
			//selected_cat[cat_num] + '_group_'+groups[group_num].toString() + '_participant_' + participants_num_list[0].toString()
		storeResponseList.push(cur_key)
			//}
		}
     }

	// Stimuli for a basic Turing experiment	
	psiTurk.recordUnstructuredData("condition", condition);

	
	var next = function() {
		let current_ass
		if (Associationslist.length===0) {
			finish();
		}
		else {
			AssociationID = guess_word_to_use[0];
			console.log("conv ID")
			console.log(AssociationID)
			console.log("conv list")
			console.log(Associationslist)
			current_path = guess_word_to_use.shift();
			trialindex = trialindex+1;	
			
			$('#stimdisplay').attr('src', path);
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
		let choice_agent = document.getElementsByName("choice").value;
		//var Agender = document.getElementById("Agender").value;
		//var Aage = document.getElementById("Aage").value;
		//var Bclass = document.getElementById("Bclass").value;
		//var Bgender = document.getElementById("Bgender").value;
		//var Bage = document.getElementById("Bage").value;
		
		var combined_response = choice_agent//Aclass + "___" + Agender + "___" + Aage + "___" + Bclass + "___" + Bgender + "___" + Bage
		console.log("combined response is")
		console.log(combined_response)
		if (combined_response != null  && combined_response.trim().length != 0)
		{
			//document.getElementById("demo").innerHTML = response;
			var rt = new Date().getTime() - wordon;

			psiTurk.recordTrialData({'phase':"TEST",
	                                 'AssociationID':AssociationID, //conversation name presented
	                                 'response':combined_response, //worker response for conversation name
	                                 //'Aclass':Aclass,
	                                 //'Agender':Agender,
	                                 //'Aage':Aage,
	                                 //'Bclass':Bclass,
	                                 //'Bgender':Bgender,
	                                 //'Bage':Bage,
									  'choice ':choice_agent ,

	                                 'hit':storeResponseList[trialindex] //conversationnum[trialindex], //index of conversation name
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
