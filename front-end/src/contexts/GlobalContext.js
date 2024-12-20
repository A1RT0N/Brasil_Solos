import React, { createContext, useState } from 'react';

// Criação do Contexto
export const GlobalContext = createContext();

// Criação do Provider
export const GlobalProvider = ({ children }) => {
  // Estado para armazenar o e-mail global
  const [globalEmail, setGlobalEmail] = useState('');

  return (
    <GlobalContext.Provider value={{ globalEmail, setGlobalEmail }}>
      {children}
    </GlobalContext.Provider>
  );
};
