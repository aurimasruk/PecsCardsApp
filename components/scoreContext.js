import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScoreContext = React.createContext(null);

const initialState = {
  scores: {}
};

const scoreReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SCORES':
      return { ...state, scores: action.scores };
    case 'UPDATE_SCORE':
      const updatedScores = { ...state.scores, [action.id]: action.score };
      AsyncStorage.setItem('scores', JSON.stringify(updatedScores)); // Persist updated scores
      return { ...state, scores: updatedScores };
    default:
      return state;
  }
};

export const ScoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(scoreReducer, initialState);

  useEffect(() => {
    const loadScores = async () => {
      const scoresData = await AsyncStorage.getItem('scores');
      if (scoresData) {
        dispatch({ type: 'SET_SCORES', scores: JSON.parse(scoresData) });
      }
    };
    loadScores();
  }, []);

  return (
    <ScoreContext.Provider value={{ state, dispatch }}>
      {children}
    </ScoreContext.Provider>
  );
};
