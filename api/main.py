from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import numpy as np
import gym
import json
import os
import logging
import subprocess

app = Flask(__name__)
# CORS(app)
socketio = SocketIO(app)

# Initialize Frozen Lake environment
env = gym.make('FrozenLake8x8-v1')
q_table = np.zeros([env.observation_space.n, env.action_space.n])
learning_rate = 0.1
discount_factor = 0.99
exploration_rate = 1.0
exploration_decay_rate = 0.99

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Load scores and mappings from a file
scores_path = os.path.join(os.path.dirname(__file__), 'scores.json')
id_to_state_path = os.path.join(os.path.dirname(__file__), 'id_to_state.json')

if os.path.exists(scores_path):
    with open(scores_path, 'r') as f:
        scores = json.load(f)
else:
    scores = {}

if os.path.exists(id_to_state_path):
    with open(id_to_state_path, 'r') as f:
        id_to_state = json.load(f)
else:
    id_to_state = {}

# Ensure the environment is reset before starting
state = env.reset()
if isinstance(state, tuple):
    state = state[0]

def update_q_table(state, action, reward, next_state, done):
    best_next_action = np.argmax(q_table[next_state])
    td_target = reward + (discount_factor * q_table[next_state, best_next_action] * (not done))
    td_error = td_target - q_table[state, action]
    q_table[state, action] += learning_rate * td_error
    logging.debug(f"State: {state}, Action: {action}, Reward: {reward}, Next State: {next_state}, Done: {done}")
    logging.debug(f"Updated Q-table: {q_table}")

@app.route('/feedback', methods=['POST'])
def feedback():
    global state
    try:
        data = request.get_json()
        logging.debug(f"Received feedback data: {data}")
        
        image_id = data['imageId']
        score = data['score']
        
        # Validate inputs
        if not isinstance(image_id, str) or not isinstance(score, int):
            raise ValueError("Invalid data types for imageId or score")
        
        # Map image_id to state
        if image_id not in id_to_state:
            id_to_state[image_id] = len(id_to_state)
            with open('id_to_state.json', 'w') as f:
                json.dump(id_to_state, f)
        
        state = id_to_state[image_id]
        action = score - 1  # Assuming 1-4 maps to actions 0-3
        reward = score  # Set reward to the feedback score
        
        logging.debug(f"Before env.step - State: {state}, Action: {action}, Reward: {reward}")
        
        next_state, env_reward, done, truncated, info = env.step(action)
        logging.debug(f"After env.step - Next State: {next_state}, Env Reward: {env_reward}, Done: {done}")
        
        update_q_table(state, action, reward, next_state, done)
        
        if done or truncated:
            state = env.reset()
            if isinstance(state, tuple):
                state = state[0]
        else:
            state = next_state  # Continue to the next state
        
        # Calculate the adjusted score for the card
        q_values = q_table[id_to_state[image_id]]
        highest_q_value = np.max(q_values)
        mean_q_value = np.mean(q_values)
        normalized_score = (highest_q_value + mean_q_value) / 2  # Simple normalization
        
        scores[image_id] = float(normalized_score)
        
        logging.debug(f"Scores: {scores}")
        with open('scores.json', 'w') as f:
            json.dump(scores, f)
        
        # Emit the updated scores to all clients
        socketio.emit('scores_updated', scores)
        
        return jsonify({"message": "Feedback received", "scores": scores})
    except Exception as e:
        logging.error(f"Error processing feedback: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route('/reset-environment', methods=['POST'])
def reset_environment():
    global state, q_table
    state = env.reset()
    
    # Check if state is a tuple and extract the first element
    if isinstance(state, tuple):
        state = state[0]
    
    # Reset scores
    scores.clear()
    with open(scores_path, 'w') as f:
        json.dump(scores, f)
    
    # Reset Q-table
    q_table = np.zeros([env.observation_space.n, env.action_space.n])
    
    # Emit the reset scores to all clients
    socketio.emit('scores_updated', scores)
    
    return jsonify({"message": "Environment reset", "state": int(state)})

@app.route('/test-feedback', methods=['POST'])
def test_feedback():
    try:
        data = request.get_json()
        image_id = data['imageId']
        score = data['score']
        iterations = data.get('iterations', 10)
        
        results = []
        
        for _ in range(iterations):
            response = feedback()
            results.append(response.get_json())
        
        return jsonify({"message": "Test feedback completed", "results": results})
    except Exception as e:
        logging.error(f"Error in test-feedback: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route('/run-automated-feedback', methods=['POST'])
def run_automated_feedback():
    try:
        # Path to your automated_feedback.py script
        script_path = os.path.join(os.path.dirname(__file__), 'automated_feedback.py')
        
        # Run the script
        result = subprocess.run(['python', script_path], capture_output=True, text=True)
        
        # Check if the script ran successfully
        if result.returncode != 0:
            logging.error(f"Error running automated_feedback.py: {result.stderr}")
            return jsonify({"error": "Failed to run automated feedback script", "details": result.stderr}), 500
        
        # Emit the updated scores to all clients
        with open(scores_path, 'r') as f:
            scores = json.load(f)
        socketio.emit('scores_updated', scores)
        
        return jsonify({"message": "Automated feedback script executed successfully", "output": result.stdout})
    except Exception as e:
        logging.error(f"Error in run-automated-feedback: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route('/get-scores', methods=['GET'])
def get_scores():
    return jsonify(scores)

if __name__ == '__main__':
    socketio.run(app, debug=True)
