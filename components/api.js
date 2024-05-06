// api.js
const API_URL = 'http://10.0.2.2:5000'; // actual API URL

console.log("api.js is loaded");

export const sendFeedback = async (imageId, score) => {
    try {
      const response = await fetch(`http://10.0.2.2:5000/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageId, score })
      });
      const text = await response.text(); // First get the response text
      console.log('Raw response:', text);
      const data = JSON.parse(text); // Then parse it as JSON
      console.log('Feedback response:', data);
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };
  