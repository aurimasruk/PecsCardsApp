import requests
import json
import random
import time

base_url = 'http://127.0.0.1:5000' # URL for emulator

# Simulate feedback for multiple images
image_ids = [
    'a1', 'a2', 'a3', 'f1', 'f2', 'f3', 'f4', 
    'ac1', 'ac2', 'ac5', 'ac6', 'cl1', 'cl2', 
    'cl3', 'cl4', 'e1', 'e2', 'e3', 'e4', 'p1', 
    'p2', 'p3', 'p4', 'p5', 'p6', 'c1', 'c2', 
    'c4', 's1', 's2', 's3', 's4', 'n1', 'n2', 
    'n3', 'n4', 'n5', 'n6', 'n7', 'n8', 'n9', 'n10'
]
iterations = 50  # Number of iterations for each image

batch_size = 10  # Number of images to process in each batch
delay_between_batches = 0  # Delay in seconds between each batch

try:
    for i in range(0, len(image_ids), batch_size):
        batch = image_ids[i:i+batch_size]
        for image_id in batch:
            for _ in range(iterations):
                score = random.choice([1, 2, 3, 4])  # Randomly select a score from 1 to 4
                response = requests.post(f'{base_url}/feedback', json={'imageId': image_id, 'score': score})
                response.raise_for_status()
                # print(f'Feedback for {image_id} with score {score}:', response.json())  # Logging
        
        # Delay between batches
        time.sleep(delay_between_batches)

    # Get and print updated scores
    # response = requests.get(f'{base_url}/get-scores')
    # response.raise_for_status()
    # print('Updated Scores:', response.json())
    print('Automated feedback executed successfully')

except requests.exceptions.RequestException as e:
    print(f'Error during automated feedback: {e}')
