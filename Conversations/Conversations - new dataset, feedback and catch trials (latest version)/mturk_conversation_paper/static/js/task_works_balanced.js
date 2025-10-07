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
    // Load the answers synchronously to ensure we have them before proceeding
    $.ajax({
        url: "/static/dataset/correct_answers.json",
        dataType: "json",
        async: false,
        success: function(data) {
            correctAnswerList = data;
        },
        error: function(error) {
            console.error("Error loading correct answers:", error);
        }
    });

    var wordon;
    const TotalNumConversation = 300;
    const NumConvPerWorker = 32; // Changed from 30 to 32
    
    // Group conversations by type
    var hhConvs = [];     // Human-Human
    var aiaiConvs = [];   // AI-AI
    var aihConvs = [];    // AI-Human
    var haiConvs = [];    // Human-AI
    
    // Create lists for base numbers (1-300)
    var baseNumbers = _.range(1, TotalNumConversation + 1);
    
    // Categorize conversations by type
    for (var num of baseNumbers) {
        // We'll use length 3 as a representative sample for categorization
        var key = "conv" + num + "_len3";
        
        if (correctAnswerList[key]) {
            var type = correctAnswerList[key];
            var convInfo = {num: num};
            
            if (type === "HH") {
                hhConvs.push(convInfo);
            } else if (type === "AIAI") {
                aiaiConvs.push(convInfo);
            } else if (type === "AIH") {
                aihConvs.push(convInfo);
            } else if (type === "HAI") {
                haiConvs.push(convInfo);
            }
        }
    }
    
    console.log("HH convs:", hhConvs.length);
    console.log("AIAI convs:", aiaiConvs.length);
    console.log("AIH convs:", aihConvs.length);
    console.log("HAI convs:", haiConvs.length);
    
    // Shuffle each category
    hhConvs = _.shuffle(hhConvs);
    aiaiConvs = _.shuffle(aiaiConvs);
    aihConvs = _.shuffle(aihConvs);
    haiConvs = _.shuffle(haiConvs);
    
    // Set counts for perfect balance - exactly 8 of each type
    var hhCount = 8;
    var aiaiCount = 8;
    var aihCount = 8;
    var haiCount = 8;
    
    // Handle cases where we don't have enough of a particular category
    if (hhConvs.length < 8 || aiaiConvs.length < 8 || aihConvs.length < 8 || haiConvs.length < 8) {
        console.warn("Not enough conversations in at least one category for perfect balance!");
        
        // Determine how many we can take from each category
        hhCount = Math.min(8, hhConvs.length);
        aiaiCount = Math.min(8, aiaiConvs.length);
        aihCount = Math.min(8, aihConvs.length);
        haiCount = Math.min(8, haiConvs.length);
        
        // Calculate how many more we need to reach 32 total
        var totalSelected = hhCount + aiaiCount + aihCount + haiCount;
        var remaining = NumConvPerWorker - totalSelected;
        
        if (remaining > 0) {
            // Distribute the remaining slots to categories with extra capacity
            var categories = [
                {name: "hh", count: hhCount, available: hhConvs.length - hhCount},
                {name: "aiai", count: aiaiCount, available: aiaiConvs.length - aiaiCount},
                {name: "aih", count: aihCount, available: aihConvs.length - aihCount},
                {name: "hai", count: haiCount, available: haiConvs.length - haiCount}
            ];
            
            // Sort by available capacity (descending)
            categories.sort((a, b) => b.available - a.available);
            
            for (var i = 0; i < remaining; i++) {
                var categoryIndex = i % categories.length;
                if (categories[categoryIndex].available > 0) {
                    if (categories[categoryIndex].name === "hh") hhCount++;
                    else if (categories[categoryIndex].name === "aiai") aiaiCount++;
                    else if (categories[categoryIndex].name === "aih") aihCount++;
                    else if (categories[categoryIndex].name === "hai") haiCount++;
                    
                    categories[categoryIndex].available--;
                }
            }
        }
    }
    
    // Select the conversations for this worker
    var selectedConvs = []
        .concat(hhConvs.slice(0, hhCount))
        .concat(aiaiConvs.slice(0, aiaiCount))
        .concat(aihConvs.slice(0, aihCount))
        .concat(haiConvs.slice(0, haiCount));
    
    // Shuffle the selected conversations
    selectedConvs = _.shuffle(selectedConvs);
    
    // Generate enough lengths for 32 conversations
    var lengthOptions = [3, 6, 9, 12, 15, 18, 21, 24];
    var lengthlist = [];
    
    // Create a balanced set of lengths
    for (var i = 0; i < 4; i++) {
        lengthlist = lengthlist.concat(lengthOptions);
    }
    
    // Shuffle the lengths
    lengthlist = _.shuffle(lengthlist);
    
    // Create conversation lists
    var conversationlist = [];
    var option1list = [];
    var option2list = [];
    var option3list = [];
    var option4list = [];
    var option5list = [];
    
    for (var i = 0; i < selectedConvs.length; i++) {
        var conv = selectedConvs[i];
        var length = lengthlist[i];
        
        var conversationname = "/static/dataset/conv" + conv.num + "_len" + length + ".html";    	
        conversationlist.push(conversationname);
        
        var option1name = "/static/dataset/conv" + conv.num + "_len" + length + "option1.html";    	
        option1list.push(option1name);
        var option2name = "/static/dataset/conv" + conv.num + "_len" + length + "option2.html";    	
        option2list.push(option2name);
        var option3name = "/static/dataset/conv" + conv.num + "_len" + length + "option3.html";    	
        option3list.push(option3name);
        var option4name = "/static/dataset/conv" + conv.num + "_len" + length + "option4.html";    	
        option4list.push(option4name);
        var option5name = "/static/dataset/conv" + conv.num + "_len" + length + "option5.html";    	
        option5list.push(option5name);
    }
    
    var conversationID;
    var trialindex = -1;
    
    // The rest of your code remains the same...
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


	// Add this right after psiTurk.showPage('stage.html');
	var styleTag = document.createElement('style');
	styleTag.textContent = `
  		body, html {
    		height: 100%;
			margin: 0;
			padding: 0;
			overflow: hidden;
		}
  
		#container-exp {
			height: 100vh;
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}
				
		#trial {
			display: flex;
			flex-direction: column;
			overflow: hidden;
			height: 100%;
		}
  
		#debug-info {
			background-color:#ffffe0;
			padding: 3px;
			margin-bottom: 3px;
			border: 1px solid #ccc;
			font-family: monospace;
			font-size: 10px;
			flex: 0 0 auto;
		}
		
		center {
			display: block;
			flex: 0 0 auto;
		}
		
		iframe#stimdisplay {
			height: 35vh !important;
			max-height: 35vh !important;
			width: 95% !important;
			margin: 0 !important;
			border: 1px solid #ccc !important;
		}
		
		form {
			margin: 3px 0 !important;
			padding: 0 !important;
			overflow: visible !important; /* Fix for scrollbars */
		}
  
		form b {
			display: inline-block;
			margin-right: 5px;
			font-size: 14px;
		}
		
		.radio-inline {
			margin: 0 5px !important;
			font-size: 14px;
			overflow: visible !important; /* Fix for scrollbars */
		}
		
		/* Fix for scrollbars in radio buttons */
		input[type="radio"] {
			overflow: visible !important;
		}
		
		label {
			overflow: visible !important;
		}
		
		p {
			margin: 3px 0 !important;
			font-size: 14px;
		}
		
		#submittrial, #nexttrial {
			padding: 5px 10px !important;
			font-size: 14px !important;
			margin-top: 3px !important;
		}
  
		/* Make option iframes taller to prevent cutting */
		iframe[id^='stimopt'] {
			height: 30px !important; /* Increased from 20px */
			width: 80px !important;
			overflow: hidden !important;
			border: none !important;
		}
`;
	document.head.appendChild(styleTag);

		// Add a function to handle iframe content after it loads
	function setupIframeHandling() {
		// Create a special style tag that will be injected into the iframe
		var iframeFixStyle = document.createElement('style');
		iframeFixStyle.textContent = `
		/* Fix for the conversation display */
		body {
			font-family: Arial, sans-serif !important;
			font-size: 16px !important;
			line-height: 1.4 !important;
		}
		
		/* Fix the negative margins in paragraphs */
		p {
			margin-bottom: 10px !important; /* Override the negative margins */
		}
		
		/* Make sure text is properly wrapped */
		p {
			white-space: normal !important;
			word-wrap: break-word !important;
		}
		`;
		
		// Try to inject the style into iframes when they load
		document.querySelectorAll('iframe').forEach(function(iframe) {
		iframe.onload = function() {
			try {
			// Try to access the iframe content
			var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
			
			// Inject our style
			iframeDoc.head.appendChild(iframeFixStyle.cloneNode(true));
			
			// Replace problematic characters in text nodes
			var textNodes = [];
			var walk = document.createTreeWalker(iframeDoc.body, NodeFilter.SHOW_TEXT, null, false);
			
			var node;
			while(node = walk.nextNode()) {
				textNodes.push(node);
			}
			
			textNodes.forEach(function(textNode) {
				// Replace common encoding issues
				textNode.nodeValue = textNode.nodeValue
				.replace(/�/g, "'")
				.replace(/�/g, '"')
				.replace(/�/g, '"')
				.replace(/�/g, '...')
				.replace(/�/g, '-');
			});
			} catch(e) {
			console.log("Cannot access iframe due to same-origin policy:", e);
			}
		};
		});
	}
	
	// Use a MutationObserver to handle dynamically added iframes
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
		if (mutation.addedNodes) {
			mutation.addedNodes.forEach(function(node) {
			if (node.tagName === 'IFRAME') {
				setupIframeHandling();
			}
			});
		}
		});
	});
	
	// Start observing for dynamic iframe additions
	observer.observe(document.body, { childList: true, subtree: true });
	
	// Initial setup for existing iframes
	setupIframeHandling();

	// Force the iframe to a fixed height and prevent dynamic adjustment
	setTimeout(function() {
		document.getElementById('stimdisplay').style.height = '35vh';
		
		// Fix option iframes if they're still getting cut off
		var optIframes = document.querySelectorAll('iframe[id^="stimopt"]');
		optIframes.forEach(function(iframe) {
			iframe.style.height = '30px';
			iframe.style.overflow = 'hidden';
			iframe.style.border = 'none';
		});

		// Even more aggressive fix for scrollbars on radio buttons
		document.querySelectorAll('.radio-inline').forEach(function(label) {
			label.style.overflow = 'visible';
			label.style.display = 'inline-block';
			label.style.whiteSpace = 'nowrap';
				
			// Remove any potential problematic styles
			label.style.height = 'auto';
			label.style.maxHeight = 'none';
		});
		
		// Fix the input radio buttons directly
		document.querySelectorAll('input[type="radio"]').forEach(function(radio) {
			radio.style.overflow = 'visible';
			radio.style.display = 'inline-block';
			radio.style.verticalAlign = 'middle';
			
			// Get the parent and make sure it doesn't have scrolling
			var parent = radio.parentNode;
			if (parent) {
				parent.style.overflow = 'visible';
				parent.style.display = 'inline-block';
			}
		});
	}, 100);

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
		
		// Get the correct label from correctAnswerList
		var conversationKey = conversationID.split("/").pop().replace(".html", "");
		var trueLabel = correctAnswerList[conversationKey];
		
		// Record submit timestamp for measuring feedback viewing time
		var submitTime = new Date().getTime();
		
		// Record trial data
		psiTurk.recordTrialData({
			'phase': "TEST",
			'conversationID': conversationID,
			'response': combined_response,
			'Aclass': Aclass,
			'Agender': Agender,
			'Bgender': Bgender,
			'topic': topic,
			'hit': selectedConvs[trialindex].num,
			'hit_len': lengthlist[trialindex],
			'rt': rt,
			'trial': trialindex + 1,
			'trueLabel': trueLabel,
			'submitTime': submitTime  // Record when they submitted their answer
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
				// Record the feedback viewing time
				var feedbackViewTime = new Date().getTime() - submitTime;
				
				// Record the feedback viewing data
				psiTurk.recordUnstructuredData('feedback_view_time_trial_' + trialindex, feedbackViewTime);
				
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
    	function() { currentview = new TuringExperiment(); } // what you want to do when you are done with instructions
    );
});