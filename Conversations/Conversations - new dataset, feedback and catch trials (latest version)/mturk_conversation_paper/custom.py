# this file imports custom routes into the experiment server
from __future__ import generator_stop
from flask import Blueprint, render_template, request, jsonify, Response, abort, current_app
from jinja2 import TemplateNotFound
from functools import wraps
from sqlalchemy import or_

from psiturk.psiturk_config import PsiturkConfig
from psiturk.experiment_errors import ExperimentError, InvalidUsageError
from psiturk.user_utils import PsiTurkAuthorization, nocache

# # Database setup
from psiturk.db import db_session, init_db
from psiturk.models import Participant
from json import dumps, loads
import json
import sqlite3

# load the configuration options
config = PsiturkConfig()
config.load_config()
# if you want to add a password protect route, uncomment and use this
#myauth = PsiTurkAuthorization(config)

# explore the Blueprint
custom_code = Blueprint('custom_code', __name__,
                        template_folder='templates', static_folder='static')


###########################################################
#  serving warm, fresh, & sweet custom, user-provided routes
#  add them here
###########################################################

# ----------------------------------------------
# example custom route
# ----------------------------------------------
@custom_code.route('/my_custom_view')
def my_custom_view():
    # Print message to server.log for debugging
    current_app.logger.info("Reached /my_custom_view")
    try:
        return render_template('custom.html')
    except TemplateNotFound:
        abort(404)

# ----------------------------------------------
# example using HTTP authentication
# ----------------------------------------------
#@custom_code.route('/my_password_protected_route')
#@myauth.requires_auth
#def my_password_protected_route():
#    try:
#        return render_template('custom.html')
#    except TemplateNotFound:
#        abort(404)

# ----------------------------------------------
# example accessing data
# ----------------------------------------------
#@custom_code.route('/view_data')
#@myauth.requires_auth
#def list_my_data():
#    users = Participant.query.all()
#    try:
#        return render_template('list.html', participants=users)
#    except TemplateNotFound:
#        abort(404)

# ----------------------------------------------
# example computing bonus
# ----------------------------------------------


@custom_code.route('/compute_bonus', methods=['GET'])
#def compute_bonus():
#    # check that user provided the correct keys
#    # errors will not be that gracefull here if being
#    # accessed by the Javascrip client
#    if not 'uniqueId' in request.args:
#        # i don't like returning HTML to JSON requests...  maybe should change this
#        raise ExperimentError('improper_inputs')
#    uniqueId = request.args['uniqueId']
#
#    try:
#        # lookup user in database
#        user = Participant.query.\
#           filter(Participant.uniqueid == uniqueId).\
#           one()
#        user_data = loads(user.datastring)  # load datastring from JSON
#        bonus = 0
#
#        for record in user_data['data']:  # for line in data file
#            trial = record['trialdata']
#            if trial['phase'] == 'TEST':
#                if trial['hit'] == True:
#                    bonus += 0.02
#        user.bonus = bonus
#        db_session.add(user)
#        db_session.commit()
#        resp = {"bonusComputed": "success"}
#        return jsonify(**resp)
#    except:
#        abort(404)  # again, bad to display HTML, but...


# def compute_bonus(participant_id):
#     # Connect to your database
#     conn = sqlite3.connect('participants.db')
#     c = conn.cursor()
    
#     # Query to get participant's data
#     c.execute("SELECT datastring FROM TuringConversationalAI WHERE uniqueid = ?", (participant_id,))
#     result = c.fetchone()
    
#     if not result:
#         return 0.0  # Return 0 if no data found
    
#     # Parse the JSON data
#     datastring = result[0]
#     data = json.loads(datastring)
    
#     # Access the specific data we saved
#     questiondata = data.get('questiondata', {})
    
#     # Get human/AI accuracy
#     humanai_correct = int(questiondata.get('correct_humanai', 0))
    
#     # Calculate bonus amount: $0.10 per correct classification
#     bonus_amount = round(humanai_correct * 0.10, 2)
    
#     # Optional: Cap the maximum bonus
#     max_bonus = 3.20  # $6.00 maximum (allows for 60 correct classifications)
#     bonus_amount = min(bonus_amount, max_bonus)
    
#     return bonus_amount

@custom_code.route('/compute_bonus', methods=['GET'])
def compute_bonus():
    # Check that user provided the correct keys
    if not 'uniqueId' in request.args:
        raise ExperimentError('improper_inputs')
    
    participant_id = request.args['uniqueId']
    
    try:
        # First, try to get the user from the standard Participant table to update the bonus
        user = Participant.query.filter(Participant.uniqueid == participant_id).one()
        
        # Connect to the custom database specified in config.txt
        # This uses the direct SQLite connection for the custom table
        db_path = 'participants_prolific.db'  # Match your config.txt database_url
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        
        # Query your custom table as specified in config.txt
        c.execute("SELECT datastring FROM TuringConversationalAI WHERE uniqueid = ?", (participant_id,))
        result = c.fetchone()
        
        if not result:
            print(f"No data found for participant {participant_id} in TuringConversationalAI table")
            # Check what tables exist and what participants exist for debugging
            c.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = c.fetchall()
            print(f"Tables in database: {tables}")
            
            c.execute("SELECT uniqueid FROM TuringConversationalAI LIMIT 5")
            sample_ids = c.fetchall()
            print(f"Sample participant IDs: {sample_ids}")
            
            bonus = 0.0  # Default to 0 if no data found
        else:
            # Parse the JSON data
            datastring = result[0]
            data = json.loads(datastring)
            
            # Access the specific data we saved
            questiondata = data.get('questiondata', {})
            
            # Get human/AI accuracy
            humanai_correct = int(questiondata.get('correct_humanai', 0))
            print(f"Correct human/AI classifications: {humanai_correct}")
            
            # Calculate bonus amount: $0.10 per correct classification
            bonus = round(humanai_correct * 0.15, 2)
            
            # Optional: Cap the maximum bonus
            max_bonus = 5  # $3.20 maximum
            bonus = min(bonus, max_bonus)
            print(f"Calculated bonus: ${bonus}")
        
        # Close the custom database connection
        conn.close()
        
        # Update the user's bonus in the standard Participant table
        user.bonus = bonus
        db_session.add(user)
        db_session.commit()
        
        # Return success response
        resp = {"bonusComputed": "success"}
        return jsonify(**resp)
    except Exception as e:
        print(f"Error computing bonus: {str(e)}")
        # Return a more detailed error for debugging
        return jsonify({"error": str(e)}), 500


@custom_code.route('/log_beginexp', methods=['POST'])
def log_beginexp():
    """Log the moment a participant starts the experiment."""
    if 'uniqueId' not in request.form:
        return jsonify({"status": "error", "message": "No uniqueId provided"}), 400
    
    uniqueId = request.form['uniqueId']

    try:
        # Find the participant in the database
        user = Participant.query.filter(Participant.uniqueid == uniqueId).one()

        # Log the beginexp time (if not already set)
        if user.beginexp is None:
            user.beginexp = user.beginhit  # Using `beginhit` as a reference
            db_session.add(user)
            db_session.commit()
            return jsonify({"status": "success", "message": "beginexp logged"}), 200
        else:
            return jsonify({"status": "error", "message": "beginexp already set"}), 400
    except:
        return jsonify({"status": "error", "message": "User not found"}), 404
