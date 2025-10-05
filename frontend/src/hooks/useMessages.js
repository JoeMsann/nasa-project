import React, { createContext, useContext, useState } from 'react';

const MessageContext = createContext();

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm your NASA Exoplanet Detection Assistant 🪐

I can help you with:
- Analyzing 122-element vectors for exoplanet detection
- Uploading and processing CSV files with multiple vectors
- Answering questions about exoplanet detection methods

How can I assist you today?`
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Hello! I'm your NASA Exoplanet Detection Assistant 🪐

I can help you with:
- Analyzing 122-element vectors for exoplanet detection
- Uploading and processing CSV files with multiple vectors
- Answering questions about exoplanet detection methods

How can I assist you today?`
      }
    ]);
  };

  return (
    <MessageContext.Provider value={{
      messages,
      addMessage,
      clearMessages,
      isLoading,
      setIsLoading
    }}>
      {children}
    </MessageContext.Provider>
  );
};