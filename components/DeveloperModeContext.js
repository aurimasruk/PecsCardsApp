import React, { createContext, useState } from 'react';

export const DeveloperModeContext = createContext();

export const DeveloperModeProvider = ({ children }) => {
  const [isDeveloperMode, setDeveloperMode] = useState(false);

  return (
    <DeveloperModeContext.Provider value={{ isDeveloperMode, setDeveloperMode }}>
      {children}
    </DeveloperModeContext.Provider>
  );
};
