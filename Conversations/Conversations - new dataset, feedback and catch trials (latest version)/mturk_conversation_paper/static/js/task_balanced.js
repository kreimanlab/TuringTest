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

	var correctAnswerList = {};
	$.getJSON("/static/dataset/correct_answers.json", function(data) {
		correctAnswerList = data;
	
		const TotalNumConversation = 300;
		const len_list = [3,6,9,12,15,18,21,24];
	
		// Build all possible conversation keys
		let allKeys = [];
		for (let c = 1; c <= TotalNumConversation; c++) {
			for (let l of len_list) {
				allKeys.push(`conv${c}_len${l}`);
			}
		}
	
		// Shuffle keys
		allKeys = _.shuffle(allKeys);
	
		// Select 10 trials balancing 10 human + 10 AI agents total
		let finalConvs = [];
		let humanCount = 0;
		let aiCount = 0;
	
		for (let key of allKeys) {
			if (finalConvs.length >= 10) break;
	
			let label = correctAnswerList[key];
			let h = 0, a = 0;
			if (label === "HH") { h = 2; }
			else if (label === "AIAI") { a = 2; }
			else if (label === "HAI" || label === "AIH") { h = 1; a = 1; }
			else continue;
	
			if ((humanCount + h <= 10) && (aiCount + a <= 10)) {
				finalConvs.push(key);
				humanCount += h;
				aiCount += a;
			}
		}
	
		console.log("Final conversations:", finalConvs);
		console.log(`Humans: ${humanCount}, AIs: ${aiCount}`);
	
		// Reset trial lists
		conversationlist = [];
		option1list = [];
		option2list = [];
		option3list = [];
		option4list = [];
		option5list = [];
	
		for (let key of finalConvs) {
			let base = "/static/dataset/" + key;
			conversationlist.push(base + ".html");
			option1list.push(base + "option1.html");
			option2list.push(base + "option2.html");
			option3list.push(base + "option3.html");
			option4list.push(base + "option4.html");
			option5list.push(base + "option5.html");
		}
	
		// After data is loaded and conversationlist is ready
		psiTurk.showPage('stage.html');
		next(); // start the first trial
		document.getElementById("submittrial").addEventListener("click", mengmiClick);
	});
	

	var wordon; // time word is presented
	//var listening = false; //keep listening  


    // Load the questionnaire snippet
    //psiTurk.showPage("instructions/instruct-worker-info.html");
	

	// Stimuli for a basic Turing experiment	
	psiTurk.recordUnstructuredData("condition", condition);

	
	var next = function() {
		if (conversationlist.length===0) {
			finish();
		}
		else {
			conversationID = conversationlist[0];
			//let conversationKey = conversationID.split("/").pop().replace(".html", "");
			//let correctLabel = correctAnswerList[conversationKey];
			//document.getElementById("debug-info").innerText = `🔍 Debug: ${conversationKey} → ${correctLabel}`;

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
	
			// ADD THIS: Log `beginexp` ONLY for the FIRST trial
			if (trialindex === 0) {
				$.ajax({
					type: "POST",
					url: "/log_beginexp",
					data: {"uniqueId": uniqueId},  
					success: function(response) {
						console.log("BeginExp logged at first trial: ", response);
					},
					error: function(error) {
						console.log("Error logging BeginExp: ", error);
					}
				});
			}
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

	function mengmiClick() {
		// Validate that all responses are selected
		if (!document.querySelector('input[type="radio"][name="Aclass"]:checked') ||
			!document.querySelector('input[type="radio"][name="Agender"]:checked') ||
			!document.querySelector('input[type="radio"][name="Bgender"]:checked') ||
			!document.querySelector('input[type="radio"][name="topic"]:checked')) {
			alert("Warning: please select all the answers");
			return;
		}
	
		// Collect values
		var Aclass = document.querySelector('input[type="radio"][name="Aclass"]:checked').value;
		var Agender = document.querySelector('input[type="radio"][name="Agender"]:checked').value;
		var Bgender = document.querySelector('input[type="radio"][name="Bgender"]:checked').value;
		var topic = document.querySelector('input[type="radio"][name="topic"]:checked').value;
		var combined_response = Aclass + "___" + Agender + "___" + Bgender + "___" + topic;
		var rt = new Date().getTime() - wordon;
	
		// Record trial data
		psiTurk.recordTrialData({
			'phase': "TEST",
			'conversationID': conversationID,
			'response': combined_response,
			'Aclass': Aclass,
			'Agender': Agender,
			'Bgender': Bgender,
			'topic': topic,
			'hit': conversationnum[trialindex],
			'hit_len': lengthlist[trialindex],
			'rt': rt,
			'trial': trialindex + 1
		});
	
		// Disable Submit button to prevent double clicks
		document.getElementById("submittrial").style.display = "none";
	
		// Feedback (only for first half)
		if (trialindex < NumConvPerWorker / 2) {
			let conversationKey = conversationID.split("/").pop().replace(".html", "");
			let correctLabel = correctAnswerList[conversationKey];
	
			// Highlight the correct option in green
			let correctInput = document.querySelector(`input[name="Aclass"][value="${correctLabel}"]`);
			if (correctInput) {
				correctInput.parentElement.style.border = "3px solid green";
				correctInput.parentElement.style.padding = "5px";
				correctInput.parentElement.style.borderRadius = "8px";
			}
	
			// Show "Next Trial" button
			document.getElementById("nexttrial").style.display = "inline";
	
			// Add click listener to advance
			document.getElementById("nexttrial").addEventListener("click", () => {
				// Clear all borders
				document.querySelectorAll('input[name="Aclass"]').forEach(input => {
					input.parentElement.style.border = "none";
					input.parentElement.style.padding = "";
					input.parentElement.style.borderRadius = "";
				});
	
				// Reset inputs
				document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
	
				// Reset buttons
				document.getElementById("nexttrial").style.display = "none";
				document.getElementById("submittrial").style.display = "inline";
	
				next(); // Go to next trial
			}, { once: true });
	
		} else {
			// No feedback → reset and advance immediately
			document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
			document.getElementById("submittrial").style.display = "inline";
			next();
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
    // Log the experiment start time
    $.ajax({
        type: "POST",
        url: "/log_beginexp",
        data: {"uniqueId": uniqueId},  // Ensure uniqueId is passed
        success: function(response) {
            console.log("BeginExp logged: ", response);
        },
        error: function(error) {
            console.log("Error logging BeginExp: ", error);
        }
    });

    // Start the actual experiment
    currentview = new TuringExperiment();
}



// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
// $(window).load( function(){
//     psiTurk.showPage("prequestionnaire.html");
// });

//$(window).load( function(){
//   psiTurk.doInstructions(
//    	instructionPages, // a list of pages you want to display in sequence
//    	function() { currentview = new TuringExperiment(); } // what you want to do when you are done with instructions
//    );
//});
const init = (async () => {
    await psiTurk.preloadPages(pages);
})()

$(window).on('load', async () => {
    await init;
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new StroopExperiment(); } // what you want to do when you are done with instructions
    );
});