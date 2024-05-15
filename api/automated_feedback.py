import requests
import json
import random

base_url = 'http://127.0.0.1:5000'

# Simulate feedback for multiple images
image_ids = ['a1', 'a2', 'f2', 'ac1', 'ac2', 'a3', 'cl1']
iterations = 50  # Number of iterations for each image

for image_id in image_ids:
    for _ in range(iterations):
        score = random.choice([1, 2, 3, 4])  # Randomly select a score from 1 to 4
        response = requests.post(f'{base_url}/feedback', json={'imageId': image_id, 'score': score})
        print(f'Feedback for {image_id} with score {score}:', response.json())

# Get and print updated scores
response = requests.get(f'{base_url}/get-scores')
print('Updated Scores:', response.json())
