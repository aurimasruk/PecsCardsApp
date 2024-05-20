import requests
import json
import csv
import pandas as pd
import matplotlib.pyplot as plt
import os

# Request to the /run-tests endpoint
url = 'http://127.0.0.1:5000/run-tests'
response = requests.post(url, headers={'Content-Type': 'application/json'})

if response.status_code == 200:
    data = response.json()
else:
    print("Failed to run tests")
    exit()

# Gather data
results = data['results']
csv_file = os.path.join(os.path.dirname(__file__), 'test_results.csv')

header = ['test_case'] + sorted(set(key for result in results for key in result['scores'].keys()))

with open(csv_file, 'w', newline='') as f:
    writer = csv.writer(f, quoting=csv.QUOTE_NONNUMERIC)
    writer.writerow(header)
    for result in results:
        test_case = result.get('test_case', {})
        test_case_str = json.dumps(test_case)
        row = [test_case_str] + [result['scores'].get(key, 0) for key in header[1:]]
        writer.writerow(row)

print(f"Results saved to {csv_file}")

with open(csv_file, 'r') as f:
    content = f.read()
    print("CSV Content:\n", content)

# Load the CSV file
try:
    df = pd.read_csv(csv_file)
    df = df[df['test_case'] != '{}']
    df['average_score'] = df.iloc[:, 1:].mean(axis=1)

    print(df[['test_case', 'average_score']])

    test_cases = df['test_case']
    average_scores = df['average_score']
    df_sorted = df.sort_values(by='average_score', ascending=False)

    # Top 10
    top_10 = df_sorted.head(10)
    top_10['short_test_case'] = top_10['test_case'].apply(lambda x: json.loads(x))
    top_10['short_test_case'] = top_10['short_test_case'].apply(
        lambda x: f"LR: {x['learning_rate']}, DF: {x['discount_factor']}, ER: {x['exploration_rate']}, EDR: {x['exploration_decay_rate']}"
    )
    top_10_test_cases = top_10['short_test_case']
    top_10_average_scores = top_10['average_score']

    # Top 10 worst
    bottom_10 = df_sorted.tail(10)
    bottom_10['short_test_case'] = bottom_10['test_case'].apply(lambda x: json.loads(x))
    bottom_10['short_test_case'] = bottom_10['short_test_case'].apply(
        lambda x: f"LR: {x['learning_rate']}, DF: {x['discount_factor']}, ER: {x['exploration_rate']}, EDR: {x['exploration_decay_rate']}"
    )
    bottom_10_test_cases = bottom_10['short_test_case']
    bottom_10_average_scores = bottom_10['average_score']

    # Plot top 10
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.barh(top_10_test_cases, top_10_average_scores, color='skyblue')
    for i in range(len(top_10_average_scores)):
        ax.text(top_10_average_scores.iloc[i] + 0.05, i, round(top_10_average_scores.iloc[i], 2), va='center')
    ax.set_xlabel('Average Score')
    ax.set_ylabel('Test Case')
    ax.set_title('Top 10 Average Scores for Different Test Cases')
    ax.grid(True, linestyle='--', linewidth=0.5, alpha=0.7)
    plt.subplots_adjust(left=0.3, right=0.95)
    plt.show()

    # Plot bottom 10
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.barh(bottom_10_test_cases, bottom_10_average_scores, color='salmon')
    for i in range(len(bottom_10_average_scores)):
        ax.text(bottom_10_average_scores.iloc[i] + 0.05, i, round(bottom_10_average_scores.iloc[i], 2), va='center')
    ax.set_xlabel('Average Score')
    ax.set_ylabel('Test Case')
    ax.set_title('Top 10 Worst Scores for Different Test Cases')
    ax.grid(True, linestyle='--', linewidth=0.5, alpha=0.7)
    plt.subplots_adjust(left=0.3, right=0.95)
    plt.show()

except Exception as e:
    print(f"Error processing CSV file: {e}")
