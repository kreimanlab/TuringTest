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
	"instructions/instruct-ready.html",
	"prequestionnaire.html",
	"stage.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"prequestionnaire.html",
	"instructions/instruct-1.html"
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
var TurExperiment = function() {

	var wordon; // time word is presented

	var imagelist = [];
    var trialindex =-1;

    var TOTAL_IMAGES = 1000;
    var NUM_TRIALS = 10;
    var TRIAL_IMAGES = _.range(1, TOTAL_IMAGES+1);
    TRIAL_IMAGES = _.shuffle(TRIAL_IMAGES);
    TRIAL_IMAGES = TRIAL_IMAGES.slice(0, NUM_TRIALS);
    
    for (i = 0; i < NUM_TRIALS; i++)
    {
        imagenum = TRIAL_IMAGES[i].toString();
        while (imagenum.length < 4) imagenum = "0" + imagenum;
        
        var imagename = "/static/images/imgset/" + imagenum + ".jpg";
        imagelist.push(imagename);
    }
    
    psiTurk.preloadImages(imagelist);

	var next = function() {
		if (imagelist.length===0) {
			finish();
		}
		else {
			wordon = new Date().getTime();
            current_img = imagelist.shift();
            trialindex = trialindex + 1;
            d3.select("#stim").html('<img src='+current_img+' alt="stimuli" width="680" height="680">');
            
			// d3.select("#stim").html('<img src="/static/images/imgset/0099.jpg" alt="stimuli" width="600" height="530">');
			document.getElementById("submittrial").addEventListener("click", submitClick);
            
            speaker_ai.checked = false;
            speaker_human.checked = false;
            
            gender_female.checked = false;
            gender_male.checked = false;
		}
	};
	

	var finish = function() {
	    // $("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new Questionnaire();
	};
	
	
	// Load the stage.html snippet into the body of the page
	psiTurk.showPage('stage.html');
    
    const speaker_ai = document.getElementById("ai");
    const speaker_human = document.getElementById("human");
            
    const gender_female = document.getElementById("female");
    const gender_male = document.getElementById("male");
	// Register the response handler that is defined above to handle any
	// key down events.
	// $("body").focus().keydown(response_handler); 

	// Start the test
	next();

	document.getElementById("submittrial").addEventListener("click", submitClick);
    
    
	function submitClick()
		{
            let response_speaker;
            let response_gender;
            
			var rt = new Date().getTime() - wordon;
            

            if ((speaker_ai.checked || speaker_human.checked) && (gender_female.checked || gender_male.checked) && rt > 3000)
			{
                
                if (speaker_ai.checked)
                {
                    response_speaker = "ai";
                }
                
                if (speaker_human.checked)
                {
                    response_speaker = "human";
                }
                
                if (gender_female.checked)
                {
                    response_gender = "female";
                }
                
                if (gender_male.checked)
                {
                    response_gender = "male";
                }
                
				psiTurk.recordTrialData({'phase': "TEST",
		                                 'imageID': current_img, //image name presented                             
		                                 'caption': '', //worker response for image name 
                                         // 'groundtruth': ,
                                         'response_speaker': response_speaker,
                                         'response_gender': response_gender,
                                         'hit': true,
		                                 'counterbalance': mycounterbalance+1, //type of choices in that trial
		                                 'rt':rt, //response time		                                 
		                             	 'trial': trialindex+1} //trial index starting from 1
		                               );
			    next();
			}
		    else
		    {
                if (rt <= 3000)
                {
                    window.alert("Warning: Please view the image and read the caption carefully!!");
                }
                if (!((speaker_ai.checked || speaker_human.checked) && (gender_female.checked || gender_male.checked)))
                {
                    window.alert("Warning: Please answer all questions!!");
                }
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
            psiTurk.showPage("instructions/instruct-1.html")
        }
        else
        {
            window.alert("Warning: Please answer all the question!!");
        }
	};
    record_responses();
}


function begin_experiment() {
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