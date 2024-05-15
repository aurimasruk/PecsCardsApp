import axios from 'axios';

const apiUrl = 'http://10.0.2.2:5000';

export const getScores = async () => {
  try {
    const response = await axios.get(`${apiUrl}/get-scores`);
    return response.data;
  } catch (error) {
    console.error('Error fetching scores:', error);
    return {};
  }
};

export const sendFeedback = async (imageId, score) => {
  try {
    const response = await axios.post(`${apiUrl}/feedback`, {
      imageId,
      score,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending feedback:', error);
    throw error;
  }
};

export const resetEnvironment = async () => {
  try {
    const response = await axios.post(`${apiUrl}/reset-environment`);
    return response.data;
  } catch (error) {
    console.error('Error resetting environment:', error);
    throw error;
  }
};

export const runAutomatedFeedback = async () => {
  try {
    const response = await axios.post(`${apiUrl}/run-automated-feedback`);
    return response.data;
  } catch (error) {
    console.error('Error running automated feedback:', error);
    throw error;
  }
};
