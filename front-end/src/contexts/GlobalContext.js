import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [globalEmail, setGlobalEmail] = useState('');

  return (
    <GlobalContext.Provider value={{ globalEmail, setGlobalEmail }}>
      {children}
    </GlobalContext.Provider>
  );
};
