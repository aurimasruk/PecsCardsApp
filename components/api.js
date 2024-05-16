import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://10.0.2.2:5000',
  timeout: 10000, // 10 seconds timeout
});

export const getScores = async () => {
  try {
    console.log('Sending request to get scores');
    const response = await axiosInstance.get('/get-scores');
    console.log('Received scores:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching scores:', error);
    throw error;
  }
};

export const sendFeedback = async (imageId, score) => {
  try {
    console.log(`Sending feedback for imageId: ${imageId}, score: ${score}`);
    const response = await axiosInstance.post('/feedback', { imageId, score });
    console.log('Feedback response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending feedback:', error);
    throw error;
  }
};

export const resetEnvironment = async () => {
  try {
    console.log('Sending request to reset environment');
    const response = await axiosInstance.post('/reset-environment');
    console.log('Reset environment response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error resetting environment:', error);
    throw error;
  }
};

export const runAutomatedFeedback = async () => {
  try {
    console.log('Sending request to run automated feedback');
    const response = await axiosInstance.post('/run-automated-feedback');
    console.log('Automated feedback response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error running automated feedback:', error);
    throw error;
  }
};
