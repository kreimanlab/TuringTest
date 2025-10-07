/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

// Add this function to get URL parameters
function getUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    const output = {};
    for (const [key, value] of params.entries()) {
        output[key] = value;
    }
    return output;
}

// Retrieve Prolific IDs from localStorage
var prolific_pid = localStorage.getItem('prolific_pid') || '';
var study_id = localStorage.getItem('study_id') || '';
var session_id = localStorage.getItem('session_id') || '';

if (!prolific_pid || !study_id || !session_id) {
    const params = new URLSearchParams(window.location.search);
    prolific_pid = prolific_pid || params.get('PROLIFIC_PID') || params.get('prolific_pid') || params.get('PID');
    study_id = study_id || params.get('STUDY_ID');
    session_id = session_id || params.get('SESSION_ID');
    
    if (prolific_pid) psiTurk.recordUnstructuredData('prolific_pid', prolific_pid);
    if (study_id) psiTurk.recordUnstructuredData('study_id', study_id);
    if (session_id) psiTurk.recordUnstructuredData('session_id', session_id);
}

// Record in unstructured data
psiTurk.recordUnstructuredData('prolific_pid', prolific_pid);
psiTurk.recordUnstructuredData('study_id', study_id);
psiTurk.recordUnstructuredData('session_id', session_id);


var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to

// All pages to be loaded
var pages = [
	"instructions/instruct-1.html",
	"instructions/instruct-worker-info.html",
	"instructions/instruct-ready.html",
    "instructions/instruct-quit.html",
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

// Right after you define the TuringExperiment function (before categorizing conversations)

var TuringExperiment = function() {
    console.log('hi');
    psiTurk.recordUnstructuredData("mode", mode);

    var correctAnswerList = {};
    // Load the answers synchronously
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
    const NumConvPerWorker = 32; // 32 total trials
    
    // Define the catch conversations (obviously human-AI)
    var catchConversations = [301, 302, 304]; // Assuming you'll name them conv301.html, etc.
    
    // Shuffle the catch conversations and select 2
    catchConversations = _.shuffle(catchConversations);
    var selectedCatchConvs = catchConversations.slice(0, 3);

	//Record catch trials
	psiTurk.recordUnstructuredData("catch_trials", selectedCatchConvs);

    
    // Define fixed positions for catch conversations (e.g., positions 10 and 20)
    var catchPositions = [4, 10, 20]; // These are 0-indexed positions
    
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
    
    // Shuffle each category
    hhConvs = _.shuffle(hhConvs);
    aiaiConvs = _.shuffle(aiaiConvs);
    aihConvs = _.shuffle(aihConvs);
    haiConvs = _.shuffle(haiConvs);
    
    // Set counts for almost-perfect balance (we'll replace 2 of these with catch trials)
    var hhCount = 8;
    var aiaiCount = 8;
    var aihCount = 7;
    var haiCount = 6;
    
    // Adjust for 2 catch trials
    //hhCount -= 1;
    //aiaiCount -= 1;
    
    // Handle cases where we don't have enough
    hhCount = Math.min(hhCount, hhConvs.length);
    aiaiCount = Math.min(aiaiCount, aiaiConvs.length);
    aihCount = Math.min(aihCount, aihConvs.length);
    haiCount = Math.min(haiCount, haiConvs.length);
    
    // Select the conversations for this worker
    var selectedConvs = []
        .concat(hhConvs.slice(0, hhCount))
        .concat(aiaiConvs.slice(0, aiaiCount))
        .concat(aihConvs.slice(0, aihCount))
        .concat(haiConvs.slice(0, haiCount));
    
    // Shuffle the selected conversations
    selectedConvs = _.shuffle(selectedConvs);
    
    // Add catch conversations at fixed positions
    for (var i = 0; i < selectedCatchConvs.length; i++) {
        // Create a catch conversation object
        var catchConv = {
            num: selectedCatchConvs[i],
            isCatch: true
        };
        
        // Insert at the specified position (if position is valid)
        if (catchPositions[i] < selectedConvs.length) {
            selectedConvs.splice(catchPositions[i], 0, catchConv);
        } else {
            // If position is invalid, just add to the end
            selectedConvs.push(catchConv);
        }
    }
    
    // Ensure we have exactly 32 conversations
    if (selectedConvs.length > NumConvPerWorker) {
        selectedConvs = selectedConvs.slice(0, NumConvPerWorker);
    }
    
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
        
        // For catch conversations, use fixed format
        if (conv.isCatch) {
            var conversationname = "/static/dataset/catch/conv" + conv.num + ".html";
            conversationlist.push(conversationname);
            
            // Assuming you have option files for catch conversations too
            var option1name = "/static/dataset/catch/conv" + conv.num + "_option1.html";
            option1list.push(option1name);
            var option2name = "/static/dataset/catch/conv" + conv.num + "_option2.html";
            option2list.push(option2name);
            var option3name = "/static/dataset/catch/conv" + conv.num + "_option3.html";
            option3list.push(option3name);
            var option4name = "/static/dataset/catch/conv" + conv.num + "_option4.html";
            option4list.push(option4name);
            var option5name = "/static/dataset/catch/conv" + conv.num + "_option5.html";
            option5list.push(option5name);
        } else {
            // For regular conversations, use length-specific files
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
    }
    
    // Load the stage.html snippet into the body of the page
    psiTurk.showPage('stage.html');

    setupPerformanceTracker();

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
        
		/*
        #debug-info {
            background-color:#ffffe0;
            padding: 3px;
            margin-bottom: 3px;
            border: 1px solid #ccc;
            font-family: monospace;
            font-size: 10px;
            flex: 0 0 auto;
        }
        */

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
			display: inline-flex !important;
			align-items: center !important;
			white-space: nowrap !important;
			margin: 0 10px !important;
		}

		form:first-of-type .radio-inline {
        margin: 0 10px !important; /* More spacing between topic options */
        display: inline-block !important;
        white-space: nowrap !important;
    	}

		#container-exp {
        min-width: fit-content !important;
        width: auto !important;
    	}
        
        /* Fix for scrollbars in radio buttons */
		input[type="radio"] {
			margin-right: 4px !important;
			margin-top: 0 !important;
			vertical-align: middle !important;
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

		form:first-of-type {
			white-space: nowrap !important;
			display: block !important;
			overflow-x: auto !important;
			margin-bottom: 10px !important;
		}
    
		/* Ensure labels stay inline */
		form:first-of-type .radio-inline {
			display: inline-block !important;
			white-space: nowrap !important;
			margin: 0 10px !important;
			padding: 0 !important;
		}
		
		/* Make the iframe wider to accommodate all options */
		iframe#stimdisplay {
			height: 35vh !important;
			max-height: 35vh !important;
			width: 100% !important; /* Use full width */
			margin: 0 !important;
			border: 1px solid #ccc !important;
		}
		
		/* Ensure the container uses full width */
		center {
			width: 100% !important;
		}
    `;
    document.head.appendChild(styleTag);

    function setupPerformanceTracker() {
        // Create performance display element
        const performanceDisplay = document.createElement('div');
        performanceDisplay.id = 'performanceTracker';
        performanceDisplay.style.position = 'fixed';
        performanceDisplay.style.top = '10px';
        performanceDisplay.style.right = '10px';
        performanceDisplay.style.backgroundColor = '#f8f8f8';
        performanceDisplay.style.border = '2px solid #ddd';
        performanceDisplay.style.borderRadius = '5px';
        performanceDisplay.style.padding = '8px 12px';
        performanceDisplay.style.fontWeight = 'bold';
        performanceDisplay.style.zIndex = '1000';
        performanceDisplay.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        
        // Initialize counters
        window.correctTopics = 0;
        window.totalTrials = 0;
        
        // Update display
        performanceDisplay.innerHTML = `
          <div style="font-size: 14px; margin-bottom: 5px;">Performance Tracker</div>
          <div style="font-size: 16px;">
            <span id="correctCount">0</span> / 
            <span id="totalCount">0</span> correct topics
          </div>
          <div style="font-size: 12px; margin-top: 5px; color: green">
            Need 20/32 to qualify
          </div>
        `;
        
        document.body.appendChild(performanceDisplay);
        
        // Add function to update the tracker
        window.updatePerformanceTracker = function(isCorrect) {
          if (isCorrect) window.correctTopics++;
          window.totalTrials++;
          
          document.getElementById('correctCount').textContent = window.correctTopics;
          document.getElementById('totalCount').textContent = window.totalTrials;
          
          // Calculate if on track to meet qualification
          const remaining = 32 - window.totalTrials;
          const needCorrect = Math.max(0, 20 - window.correctTopics);
          const canStillQualify = needCorrect <= remaining;
          const isOnTrack = window.correctTopics >= Math.ceil(window.totalTrials * 0.625); // 20/32 = 0.625
          
          // Update status text and color
          const statusElement = performanceDisplay.querySelector('div:last-child');
          
          if (!isOnTrack) {
            if (canStillQualify) {
              statusElement.style.color = 'orange';
              statusElement.textContent = `Need ${needCorrect} more correct to qualify`;
            } else {
              statusElement.style.color = 'red';
              statusElement.textContent = `Cannot reach qualification threshold`;
            }
          } else {
            statusElement.style.color = 'green';
            statusElement.textContent = `On track to qualify (${Math.ceil(window.correctTopics/window.totalTrials*100)}%)`;
          }
          
          // Visual feedback based on performance
          const performanceRatio = window.correctTopics / window.totalTrials;
          if (performanceRatio < 0.5) {
            performanceDisplay.style.backgroundColor = '#ffecec';
            performanceDisplay.style.borderColor = '#ff5555';
          } else if (performanceRatio < 0.625) {
            performanceDisplay.style.backgroundColor = '#fff6e6';
            performanceDisplay.style.borderColor = '#ffa500';
          } else {
            performanceDisplay.style.backgroundColor = '#e6ffe6';
            performanceDisplay.style.borderColor = '#55aa55';
          }
        };

        window.correctHumanAI = 0; // Number of correct human/AI classifications
        window.totalHumanAI = 0;   // Total number of human/AI decisions made
      }

    // Add the debug info box at the top of the page
    //var debugDiv = document.createElement('div');
    //debugDiv.id = 'debug-info';
    //var containerExp = document.getElementById('container-exp');
    //containerExp.insertBefore(debugDiv, containerExp.firstChild);
    
    // Function to handle iframe content after it loads
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
    
    // Function to add scroll indicator
	function addScrollIndicator() {
		var stimFrame = document.getElementById('stimdisplay');
		
		if (stimFrame) {
			setTimeout(function() {
				try {
					var doc = stimFrame.contentDocument || stimFrame.contentWindow.document;
					var docHeight = doc.body.scrollHeight;
					var frameHeight = stimFrame.clientHeight;
					
					if (docHeight > frameHeight + 20) {
						if (!document.getElementById('scroll-indicator')) {
							var indicator = document.createElement('div');
							indicator.id = 'scroll-indicator';
							indicator.innerHTML = '⬇️<br>Scroll<br>down<br>⬇️';
							indicator.style.backgroundColor = 'rgba(255, 255, 0, 0.7)';
							indicator.style.color = '#000';
							indicator.style.padding = '8px';
							indicator.style.textAlign = 'center';
							indicator.style.fontSize = '12px';
							indicator.style.fontWeight = 'bold';
							indicator.style.position = 'absolute';
							indicator.style.right = '10px'; // Position on the right
							indicator.style.top = '50%'; // Center vertically
							indicator.style.transform = 'translateY(-50%)';
							indicator.style.width = 'auto';
							indicator.style.zIndex = '1000';
							indicator.style.border = '1px solid #ccc';
							indicator.style.borderRadius = '3px';
							
							var parent = stimFrame.parentNode;
							parent.style.position = 'relative';
							parent.appendChild(indicator);
							
							var count = 0;
							var flashInterval = setInterval(function() {
								indicator.style.opacity = indicator.style.opacity === '0.5' ? '1' : '0.5';
								count++;
								if (count > 6) {
									clearInterval(flashInterval);
									indicator.style.opacity = '1';
								}
							}, 500);
							
							stimFrame.onscroll = function() {
								indicator.style.display = 'none';
							};
						}
					}
				} catch(e) {
					console.log("Cannot check iframe content:", e);
				}
			}, 500);
		}
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
    
    var conversationID;
    var trialindex = -1;
    
// Modify the next function to remove any previous scroll indicator
var next = function() {
    if (conversationlist.length===0) {
        finish();
    }
    else {
        // Remove any existing scroll indicator before loading the next trial
        if (document.getElementById('scroll-indicator')) {
            document.getElementById('scroll-indicator').remove();
        }
        
        conversationID = conversationlist[0];
        console.log("conv ID");
        console.log(conversationID);
        console.log("conv list");
        console.log(conversationlist);
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
    
        // Get the conversation key and true label for debugging
        var conversationKey = conversationID.split("/").pop().replace(".html", "");
        var trueLabel = correctAnswerList[conversationKey];
        
		/*
        // Update the debug information
        document.getElementById('debug-info').innerHTML = 
            `<strong>DEBUG INFO</strong> | 
             Conversation: ${conversationKey} | 
             True Label: ${trueLabel} | 
             Trial: ${trialindex + 1}/${NumConvPerWorker} | 
             Conv#: ${selectedConvs[trialindex].num} | 
             Length: ${lengthlist[trialindex]}`;
		*/
        
        // Add scroll indicator after a delay
        setTimeout(function() {
            addScrollIndicator();
        }, 600);

        
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
        currentview = new Questionnaire();
    };
    
    // Force the iframe to a fixed height and prevent dynamic adjustment
    setTimeout(function() {
		// Set iframe height
		document.getElementById('stimdisplay').style.height = '35vh';
		
		// Fix option iframes
		document.querySelectorAll('iframe[id^="stimopt"]').forEach(function(iframe) {
			iframe.style.height = '30px';
			iframe.style.overflow = 'hidden';
			iframe.style.border = 'none';
		});
	
		// Basic reset for forms
		document.querySelectorAll('form').forEach(function(form) {
			form.style.display = 'block';
			form.style.marginBottom = '10px';
		});
	
		// Fix for topic options row
		var topicForm = document.querySelector('form:first-of-type');
		if (topicForm) {
			topicForm.style.whiteSpace = 'nowrap';
			topicForm.style.overflowX = 'auto';
		}
	
		// Adjust all radio buttons - simple approach that won't remove any content
		document.querySelectorAll('input[type="radio"]').forEach(function(radio) {
			radio.style.verticalAlign = 'middle';
			radio.style.marginRight = '3px';
			
			// Style the parent label without changing its content
			var label = radio.parentElement;
			if (label) {
				label.style.display = 'inline-block';
				label.style.marginRight = '12px';
				label.style.marginBottom = '4px';
				label.style.verticalAlign = 'middle';
			}
		});
	}, 100);
    
    // Start the test; initialize everything
    next();


    function checkTopicCorrect(topic, conversationNum) {
        // We need to determine the correct topic based on conversation number
        let correctTopic;
        
        // Implement the topic mapping based on the provided ranges
        if ((conversationNum >= 1 && conversationNum <= 25) || 
            (conversationNum >= 126 && conversationNum <= 150) || 
            (conversationNum >= 161 && conversationNum <= 170) || 
            (conversationNum >= 211 && conversationNum <= 220) || 
            (conversationNum >= 261 && conversationNum <= 270)) {
          correctTopic = "1";
        } else if ((conversationNum >= 26 && conversationNum <= 50) || 
                   (conversationNum >= 151 && conversationNum <= 160) || 
                   (conversationNum >= 171 && conversationNum <= 180) || 
                   (conversationNum >= 221 && conversationNum <= 230) || 
                   (conversationNum >= 271 && conversationNum <= 280)) {
          correctTopic = "2";
        } else if ((conversationNum >= 51 && conversationNum <= 75) || 
                   (conversationNum >= 181 && conversationNum <= 190) || 
                   (conversationNum >= 231 && conversationNum <= 240) || 
                   (conversationNum >= 281 && conversationNum <= 290)) {
          correctTopic = "3";
        } else if ((conversationNum >= 76 && conversationNum <= 100) || 
                   (conversationNum >= 191 && conversationNum <= 200) || 
                   (conversationNum >= 241 && conversationNum <= 250) || 
                   (conversationNum >= 291 && conversationNum <= 300)) {
          correctTopic = "4";
        } else if ((conversationNum >= 101 && conversationNum <= 125) || 
                   (conversationNum >= 201 && conversationNum <= 210) || 
                   (conversationNum >= 251 && conversationNum <= 260)) {
          correctTopic = "5";
        } else {
          // For catch trials or any other special cases, default to topic 3
          correctTopic = "3";
        }
        
        return topic === correctTopic;
      }

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
        
        const isTopicCorrect = checkTopicCorrect(topic, selectedConvs[trialindex].num);
        window.updatePerformanceTracker(isTopicCorrect);

        // Get the correct label from correctAnswerLists
        var conversationKey = conversationID.split("/").pop().replace(".html", "");
        var trueLabel = correctAnswerList[conversationKey];

         // Check if human/AI classification was correct
        const userResponse = Aclass;
        const isHumanAICorrect = (userResponse === trueLabel);
        
        // Record submit timestamp for measuring feedback viewing time
        var submitTime = new Date().getTime();

        // Determine if this trial has feedback
        var hasFeedback = trialindex < NumConvPerWorker / 2;
        
        // Update accuracy counters
        if (isHumanAICorrect) {
            window.correctHumanAI++;
        }
        window.totalHumanAI++;
                
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
            'submitTime': submitTime,  // Record when they submitted their answer
			'isCatch': selectedConvs[trialindex].isCatch || false, 
            'hasFeedback': hasFeedback 
        });

            // Check if this is the catch trial at position 5 (trial index 4)
        if (trialindex === 4 && selectedConvs[trialindex].isCatch) {
            // If they got the catch trial wrong, redirect to quit page
            if (!isHumanAICorrect) {
                psiTurk.recordUnstructuredData('failed_catch_trial', true);
                psiTurk.recordUnstructuredData('failed_catch_trial_position', trialindex + 1);
                psiTurk.recordUnstructuredData('failed_catch_trial_num', selectedConvs[trialindex].num);
                
                // Save data before showing quit page
                psiTurk.saveData({
                    success: function() {
                        // Show quit page after data is saved
                        psiTurk.showPage("instructions/instruct-quit.html");
                        document.getElementById("exit").addEventListener("click", exitClick);
                    },
                    error: function() {
                        // Even if there's an error saving, still show quit page
                        console.error("Error saving data for failed catch trial");
                        psiTurk.showPage("instructions/instruct-quit.html");
                        document.getElementById("exit").addEventListener("click", exitClick);
                    }
                });
            }
        }
        
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

// Add the exit function
function exitClick() {
    // Save data before exiting
    psiTurk.saveData({
        success: function() {
            psiTurk.completeHIT();
        },
        error: function() {
            // If there's an error, try again
            psiTurk.completeHIT();
        }
    });
}

/****************
* Questionnaire *
****************/

var Questionnaire = function() {


	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

        const params = getUrlParameters();
        const prolific_pid = params.PROLIFIC_PID || null;
        const study_id = params.STUDY_ID || null;
        const session_id = params.SESSION_ID || null;
        
        if (prolific_pid) psiTurk.recordUnstructuredData('prolific_pid', prolific_pid);
        if (study_id) psiTurk.recordUnstructuredData('study_id', study_id);
        if (session_id) psiTurk.recordUnstructuredData('session_id', session_id);

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});

        if (typeof window.correctTopics !== 'undefined') {
            psiTurk.recordUnstructuredData('correct_topics', window.correctTopics);
            psiTurk.recordUnstructuredData('total_trials', window.totalTrials);
            psiTurk.recordUnstructuredData('topic_accuracy', (window.correctTopics / window.totalTrials).toFixed(4));
            psiTurk.recordUnstructuredData('qualified', window.correctTopics >= 20 ? 'yes' : 'no');
        }

        if (typeof window.correctHumanAI !== 'undefined') {
            psiTurk.recordUnstructuredData('correct_humanai', window.correctHumanAI);
            psiTurk.recordUnstructuredData('total_humanai', window.totalHumanAI);
            psiTurk.recordUnstructuredData('humanai_accuracy', (window.correctHumanAI / window.totalHumanAI).toFixed(4));
        }

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
	
// Add this code right before the $("#next").click handler in the Questionnaire function
console.log("Setting up click handler for #next button");

$("#next").click(function () {
    console.log("Next button clicked");
    record_responses();
    
    psiTurk.saveData({
        success: function() {
            console.log("Data saved successfully");
            // Make a direct GET request to the compute_bonus endpoint
            $.get("/compute_bonus", { uniqueId: uniqueId })
                .done(function(response) {
                    console.log("Bonus computed:", response);
                    psiTurk.completeHIT();
                })
                .fail(function(err) {
                    console.error("Error computing bonus:", err);
                    // Try to complete anyway
                    psiTurk.completeHIT();
                });
        }, 
        error: function(err) {
            console.error("Error saving data:", err);
            prompt_resubmit();
        }
    });
});


	//$("#next").click(function () {
	//    record_responses();
	//   psiTurk.saveData({
    //        success: function(){
    //            psiTurk.computeBonus('compute_bonus', function() { 
    //            	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
    //            }); 
    //        }, 
    //        error: prompt_resubmit});

	//});


};

function preques_submit() {
	
    record_responses = function() {
        age = document.getElementById("age").value;
        gender = document.getElementById("gender").value;
        education = document.getElementById("education").value;
        country = document.getElementById("country").value;
        native = document.getElementById("native").value;
        aiuse = document.getElementById("aiuse").value;
        
        if (age.length>0 && gender.length>0 && education.length>0 && country.length>0 && native.length>0)
        {
            psiTurk.recordTrialData({'phase':'prequestionnaire', 'status':'submit'});
            psiTurk.recordUnstructuredData('age', age);
            psiTurk.recordUnstructuredData('gender', gender);
            psiTurk.recordUnstructuredData('education', education);
            psiTurk.recordUnstructuredData('country', country);
            psiTurk.recordUnstructuredData('native', native);
            psiTurk.recordUnstructuredData('aiuse', aiuse); 

            // Record Prolific IDs
            const params = getUrlParameters();
            const prolific_pid = params.PROLIFIC_PID || null;
            const study_id = params.STUDY_ID || null;
            const session_id = params.SESSION_ID || null;
            
            if (prolific_pid) psiTurk.recordUnstructuredData('prolific_pid', prolific_pid);
            if (study_id) psiTurk.recordUnstructuredData('study_id', study_id);
            if (session_id) psiTurk.recordUnstructuredData('session_id', session_id);


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