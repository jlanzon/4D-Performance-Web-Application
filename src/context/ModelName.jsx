import React, { createContext, useState, useEffect } from 'react';

export const ModelNameContext = createContext();

export const ModelNameProvider = ({ children }) => {
  const [modelName, setModelName] = useState(() => {
    return localStorage.getItem('modelName') || 'GPT Model';
  });

  useEffect(() => {
    localStorage.setItem('modelName', modelName);
  }, [modelName]);

  const value = {
    modelName,
    setModelName,
  };

  return (
    <ModelNameContext.Provider value={value}>
      {children}
    </ModelNameContext.Provider>
  );
};
