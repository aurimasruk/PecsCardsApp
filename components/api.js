import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://10.0.2.2:5000',
  timeout: 30000,
});

export const getScores = async () => {
  try {
    const response = await axiosInstance.get('/get-scores');
    return response.data;
  } catch (error) {
    console.error('Error fetching scores:', error);
    throw error;
  }
};

export const sendFeedback = async (imageId, score) => {
  try {
    const response = await axiosInstance.post('/feedback', { imageId, score });
    return response.data;
  } catch (error) {
    console.error('Error sending feedback:', error);
    throw error;
  }
};

export const resetEnvironment = async () => {
  try {
    const response = await axiosInstance.post('/reset-environment');
    return response.data;
  } catch (error) {
    console.error('Error resetting environment:', error);
    throw error;
  }
};
export const resetSessionEnvironment = async () => {
  try {
    const response = await axiosInstance.post('/reset-session-environment');
    return response.data;
  } catch (error) {
    console.error('Error resetting session environment:', error);
    throw error;
  }
};

export const runAutomatedFeedback = async () => {
  try {
    const response = await axiosInstance.post('/run-automated-feedback');
    return response.data;
  } catch (error) {
    console.error('Error running automated feedback:', error);
    throw error;
  }
};

export const getSessionScores = async () => {
  try {
    const response = await axiosInstance.get('/session-scores');
    return response.data;
  } catch (error) {
    console.error('Error fetching session scores:', error);
    throw error;
  }
};
