import requests
import json

base_url = 'http://127.0.0.1:5000'

# Simulate feedback for multiple images
image_ids = ['a1', 'a2', 'f2', 'ac1', 'ac2', 'a3', 'cl1']
iterations = 50  # Number of iterations for each image

for image_id in image_ids:
    for _ in range(iterations):
        response = requests.post(f'{base_url}/feedback', json={'imageId': image_id, 'score': 4})
        print(f'Feedback for {image_id}:', response.json())

# Get and print updated scores
response = requests.get(f'{base_url}/get-scores')
print('Updated Scores:', response.json())
