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
session_q_table = np.zeros([env.observation_space.n, env.action_space.n])

# Parameters
learning_rate = 0.8
discount_factor = 0.9
exploration_rate = 1.0
max_exploration_rate = 1.0
min_exploration_rate = 0.001
exploration_decay_rate = 0.01
max_steps = 100  # Define a maximum number of steps per episode
total_episodes = 1000  # Define total episodes for training

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Load scores and mappings from a file
scores_path = os.path.join(os.path.dirname(__file__), 'scores.json')
id_to_state_path = os.path.join(os.path.dirname(__file__), 'id_to_state.json')
session_scores_path = os.path.join(os.path.dirname(__file__), 'session_scores.json')

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

# Clear session scores at startup
session_scores = {}
with open(session_scores_path, 'w') as f:
    json.dump(session_scores, f)

def update_q_table(q_table, state, action, reward, next_state, done, env_reward):
    best_next_action = np.argmax(q_table[next_state])
    td_target = (reward + env_reward) + (discount_factor * q_table[next_state, best_next_action] * (not done))
    td_error = td_target - q_table[state, action]
    q_table[state, action] += learning_rate * td_error
    # logging.debug(f"State: {state}, Action: {action}, Reward: {reward}, Env Reward: {env_reward}, Next State: {next_state}, Done: {done}")

@app.route('/feedback', methods=['POST'])
def feedback():
    global state, exploration_rate
    try:
        data = request.get_json()
        # logging.debug(f"Received feedback data: {data}")
        
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
        
        # Handle exploration-exploitation tradeoff
        if np.random.rand() < exploration_rate:
            action = np.random.choice(env.action_space.n)
        else:
            action = np.argmax(q_table[state])
        
        reward = score  # Set reward to the feedback score
        
        next_state, env_reward, done, truncated, info = env.step(action)
        
        if env_reward == 1.0:
            logging.info(f"REWARD 1.0 ACHIEVED - State: {state}, Action: {action}, Reward: {reward}, Next State: {next_state}, Done: {done}")
        # else:
        #     logging.debug(f"State: {state}, Action: {action}, Reward: {reward}, Env Reward: {env_reward}, Next State: {next_state}, Done: {done}")
        
        update_q_table(q_table, state, action, reward, next_state, done, env_reward)
        update_q_table(session_q_table, state, action, reward, next_state, done, env_reward)
        
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
        session_scores[image_id] = float(normalized_score)
        
        with open('scores.json', 'w') as f:
            json.dump(scores, f)
        with open('session_scores.json', 'w') as f:
            json.dump(session_scores, f)
        
        # Emit the updated scores to all clients
        socketio.emit('scores_updated', scores)
        
        # Decay the exploration rate
        exploration_rate = min_exploration_rate + (max_exploration_rate - min_exploration_rate) * np.exp(-exploration_decay_rate * len(scores))
        
        return jsonify({"message": "Feedback received", "scores": scores})
    except Exception as e:
        logging.error(f"Error processing feedback: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@app.route('/reset-environment', methods=['POST'])
def reset_environment():
    global state, q_table, exploration_rate
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
    
    reset_session_environment()
    
    # Reset exploration rate
    exploration_rate = max_exploration_rate
    
    # Emit the reset scores to all clients
    socketio.emit('scores_updated', scores)
    
    return jsonify({"message": "Environment reset", "state": int(state)})

@app.route('/reset-session-environment', methods=['POST'])
def reset_session_environment():
    global state, session_q_table, session_scores
    state = env.reset()
    
    # Check if state is a tuple and extract the first element
    if isinstance(state, tuple):
        state = state[0]
    
    # Reset session scores
    session_scores.clear()
    with open(session_scores_path, 'w') as f:
        json.dump(session_scores, f)
    
    # Reset session Q-table
    session_q_table = np.zeros([env.observation_space.n, env.action_space.n])
    
    # Emit the reset scores to all clients
    socketio.emit('scores_updated', session_scores)
    
    return jsonify({"message": "Session environment reset", "state": int(state)})

@app.route('/test-feedback', methods=['POST'])
def test_feedback():
    try:
        data = request.get_json()
        image_id = data['imageId']
        score = data['score']
        iterations = data.get('iterations', 10)
        
        results = []
        
        for _ in range(iterations):
            feedback_data = {
                'imageId': image_id,
                'score': score
            }
            with app.test_request_context(json=feedback_data, content_type='application/json'):
                response = feedback()
                results.append(response.get_json())
        
        return jsonify({"message": "Test feedback completed", "results": results})
    except Exception as e:
        logging.error(f"Error in test-feedback: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route('/run-automated-feedback', methods=['POST'])
def run_automated_feedback():
    try:
        # Path to automated_feedback.py script
        script_path = os.path.join(os.path.dirname(__file__), 'automated_feedback.py')
        
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

@app.route('/session-scores', methods=['GET'])
def get_session_scores():
    return jsonify(session_scores)

@app.route('/run-tests', methods=['POST'])
def run_tests():
    try:
        # Define ranges for each parameter
        learning_rates = [0.1, 0.2, 0.5, 0.8]
        discount_factors = [0.99, 0.9, 0.8]
        exploration_rates = [1.0, 0.9, 0.8]
        exploration_decay_rates = [0.99, 0.8, 0.2, 0.05]
        
        test_cases = []
        
        # Generate all combinations of parameter values
        for lr in learning_rates:
            for df in discount_factors:
                for er in exploration_rates:
                    for edr in exploration_decay_rates:
                        test_cases.append({
                            "learning_rate": lr,
                            "discount_factor": df,
                            "exploration_rate": er,
                            "exploration_decay_rate": edr
                        })
        
        results = []
        
        for i, params in enumerate(test_cases):
            global learning_rate, discount_factor, exploration_rate, exploration_decay_rate
            learning_rate = params['learning_rate']
            discount_factor = params['discount_factor']
            exploration_rate = params['exploration_rate']
            exploration_decay_rate = params['exploration_decay_rate']
            
            logging.info(f"Running test {i+1} with parameters: {params}")
            reset_environment()
            
            for episode in range(total_episodes):
                state = env.reset()
                if isinstance(state, tuple):
                    state = state[0]
                
                total_reward = 0
                for step in range(max_steps):
                    # Handle exploration-exploitation tradeoff
                    if np.random.rand() < exploration_rate:
                        action = np.random.choice(env.action_space.n)
                    else:
                        action = np.argmax(q_table[state])
                    
                    next_state, env_reward, done, truncated, info = env.step(action)
                    reward = env_reward
                    
                    if env_reward == 1.0:
                        logging.info(f"REWARD 1.0 ACHIEVED - State: {state}, Action: {action}, Reward: {reward}, Next State: {next_state}, Done: {done}")
                    
                    update_q_table(q_table, state, action, reward, next_state, done, env_reward)
                    update_q_table(session_q_table, state, action, reward, next_state, done, env_reward)
                    
                    total_reward += reward
                    
                    if done or truncated:
                        break
                    state = next_state
                
                # logging.debug(f"Episode {episode + 1} finished with total reward: {total_reward}")
            
            # Simulate feedback to evaluate performance
            for image_id in id_to_state.keys():
                for _ in range(10):  # Number of feedbacks per image
                    feedback_data = {
                        'imageId': image_id,
                        'score': np.random.randint(1, 5)  # Random score between 1 and 4
                    }
                    with app.test_request_context(json=feedback_data, content_type='application/json'):
                        response = feedback()
                        results.append(response.get_json())
            
            results.append({
                "test_case": params,
                "scores": scores.copy()
            })
        
        return jsonify({"message": "Tests completed", "results": results})
    except Exception as e:
        logging.error(f"Error in run-tests: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    socketio.run(app, debug=True)
