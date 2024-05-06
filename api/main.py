from flask import Flask, jsonify, request
import json
import gym

app = Flask(__name__)
env = gym.make('FrozenLake-v1', is_slippery=False)  # Non-slippery version for deterministic behavior

@app.route('/feedback', methods=['POST'])
def feedback():
    data = request.json
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    try:
        image_id = data['imageId']
        score = data['score']
    except KeyError as e:
        return jsonify({'error': 'Missing key in the request', 'missing_key': str(e)}), 400
    
    print(f"Received feedback for image {image_id}: {score}")
    return jsonify({'status': 'success', 'imageId': image_id, 'score': score})

@app.route('/reset', methods=['GET'])
def reset():
    state = env.reset()
    return jsonify({'state': state})

@app.route('/step', methods=['POST'])
def step():
    action = request.json['action']
    state, reward, done, info = env.step(action)
    return jsonify({
        'state': state,
        'reward': reward,
        'done': done,
        'info': info
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
