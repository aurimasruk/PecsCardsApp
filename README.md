# PECS Card Recommendation System for Kids with Autism

This project is a mobile application that helps children with autism communicate using PECS (Picture Exchange Communication System) cards. The system leverages **Reinforcement Learning (RL)** to recommend cards based on the scores and feedback provided during user interactions. The app also includes developer mode functionalities for testing and debugging purposes. The application was created for the Lithuanian language.

## Features

- **PECS Card Display**: Displays different categories of PECS cards (Animals, Food, Emotions, etc.).
- **Reinforcement Learning**: The system learns from user feedback to recommend cards based on user preferences.
- **Score Tracking**: Each image is associated with a score, which updates dynamically based on user feedback.
- **Session-based Recommendations**: Custom card recommendations are made for each session.
- **Developer Mode**: Provides tools for testing, resetting environments, and running automated feedback.
- **Backend Integration**: A Flask-based backend manages the reinforcement learning environment and processes feedback.

---

## Getting Started

### 1.1 Prerequisites

1. Ensure that Node.js and npm are installed. You can download them from the official Node.js website.
2. Ensure that Python 3.x and pip are installed. You can download them from the Python website.
3. Install Expo CLI by running the following command in the console:
    ```bash
    npm install -g expo-cli
    ```
4. Install **VirtualEnv** for Python to manage the virtual environment:
    ```bash
    pip install virtualenv
    ```
### 1.2 Starting the Front-End of the System

1. In the root directory of the project, install the dependencies:
    ```bash
    npm install
    ```
2. Start the Expo server:
    ```bash
    npx expo start
    ```
3. In the console, choose to open the app by selecting **a** for Android. Wait until the environment is set up, and the app will open in an emulated Android environment.

### 1.3. Starting the System API

1. Navigate to the `api/` directory, where the `main.py` and `automated_feedback.py` files are located, and create and activate a virtual environment:
    ```bash
    python -m venv venv
    ```
2. Install the required Python libraries:
    ```bash
    pip install flask flask-socketio flask-cors gym numpy requests pandas matplotlib
    ```
3. Start the API and Flask server:
    ```bash
    python main.py
    ```
4. The server will start at: `http://127.0.0.1:5000`
5. To run tests for analyzing reinforcement learning model parameter sets, execute the following command:
    ```bash
    python run_tests.py
    ```
By following these steps, you should be able to successfully run the application and test the model's performance in another environment.

---

## Usage
- When the app is launched, users can browse different categories of PECS cards (e.g., Animals, Foods).
- Users can give feedback on each card using smiley icons (from sad to very happy).
- The system learns from this feedback and updates the recommended cards.
- In Session Mode, users will be presented with recommended cards based on the session-specific feedback.

    
### API Endpoints
The backend provides several endpoints to interact with the reinforcement learning environment and handle feedback:

- ``/feedback``: Receives feedback for a specific image and updates the Q-learning model.
- ``/get-scores``: Returns the current scores of all images.
- ``/reset-environment``: Resets the RL environment and clears all scores.
- ``/run-automated-feedback``: Simulates feedback for multiple images to test the system.
- ``/session-scores``: Retrieves session-specific scores.

### Developer Mode
The application includes a Developer Mode for testing and debugging purposes.

#### Features of Developer Mode:
- **Reset Session Environment:** Clears session-specific data and restarts the session.
- **Test Feedback:** Runs automated feedback to test the reinforcement learning system.
- **Enable/Disable Developer Mode:** Toggle developer mode in the Settings screen.

To activate Developer Mode:

1. Navigate to Settings from the main screen.
2. Toggle the switch for "Kūrėjo režimas" (Developer Mode).



### Project Structure
    ```
    pecs-autism-recommendation/
    │
    ├── backend/                     # Flask backend for handling feedback and training RL model
    │   ├── main.py                  # Main backend server file (Flask + RL environment)
    │   ├── automated_feedback.py     # Automated feedback script for testing RL
    │   └── run_tests.py             # Script to run tests on RL configurations
    │
    ├── frontend/                    # React Native app
    │   ├── App.js                   # Entry point of the React Native app
    │   ├── components/              # React components
    │   │   ├── categoriesData.js    # Contains data for PECS categories and images
    │   │   ├── scoreContext.js      # Score management using React Context API
    │   │   └── ...                  # Other components (SettingsScreen, CategoryScreen, etc.)
    │   └── assets/                  # Static assets like images for the cards
    │
    └── README.md                    # Project documentation```
    
