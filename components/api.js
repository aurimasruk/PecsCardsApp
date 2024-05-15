import axios from 'axios';

const apiUrl = 'http://10.0.2.2:5000'; // Change this to your API base URL if different

export const sendFeedback = async (imageId, score) => {
  try {
    const response = await axios.post(`${apiUrl}/feedback`, { imageId, score });
    return response.data;
  } catch (error) {
    console.error('Error in sendFeedback:', error);
    throw error;
  }
};

export const getScores = async () => {
  try {
    const response = await axios.get(`${apiUrl}/get-scores`);
    return response.data;
  } catch (error) {
    console.error('Error in getScores:', error);
    throw error;
  }
};

export const resetEnvironment = async () => {
  try {
    const response = await axios.post(`${apiUrl}/reset-environment`);
    return response.data;
  } catch (error) {
    console.error('Error in resetEnvironment:', error);
    throw error;
  }
};

export const testFeedback = async (imageId, score, iterations) => {
  try {
    console.log(`Sending test feedback request: imageId=${imageId}, score=${score}, iterations=${iterations}`);
    const response = await axios.post(`${apiUrl}/test-feedback`, { imageId, score, iterations });
    console.log('Test feedback response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in testFeedback:', error);
    throw error;
  }
};

export const runAutomatedFeedback = async () => {
  try {
    const response = await axios.post(`${apiUrl}/run-automated-feedback`);
    return response.data;
  } catch (error) {
    console.error('Error in runAutomatedFeedback:', error);
    throw error;
  }
};
