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
	});

	var wordon; // time word is presented
	//var listening = false; //keep listening  

	//Mengmi: generate random image list 
	const TotalNumConversation = 300;//700
	const NumConvPerWorker = 30; //20;//20
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
    	var conversationname = "/static/dataset/conv" + conversationnum[i] + "_len" + lengthlist[i] + ".html";    	
    	conversationlist.push(conversationname);
    	var option1name = "/static/dataset/conv" + conversationnum[i] + "_len" + lengthlist[i] + "option1.html";    	
    	option1list.push(option1name);
    	var option2name = "/static/dataset/conv" + conversationnum[i] + "_len" + lengthlist[i] + "option2.html";    	
    	option2list.push(option2name);
    	var option3name = "/static/dataset/conv" + conversationnum[i] + "_len" + lengthlist[i] + "option3.html";    	
    	option3list.push(option3name);
    	var option4name = "/static/dataset/conv" + conversationnum[i] + "_len" + lengthlist[i] + "option4.html";    	
    	option4list.push(option4name);
    	var option5name = "/static/dataset/conv" + conversationnum[i] + "_len" + lengthlist[i] + "option5.html";    	
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