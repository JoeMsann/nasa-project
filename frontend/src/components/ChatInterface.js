import React, { useState } from 'react';
import styled from 'styled-components';
import { useMessages } from '../hooks/useMessages';
import { processMessage } from '../services/api';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.05);
  margin: 1rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
`;

const ChatTitle = styled.h2`
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
`;

const ChatContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatInterface = () => {
  const { messages, addMessage, isLoading, setIsLoading } = useMessages();

  const handleSendMessage = async (content, csvData = null) => {
    const userMessage = { role: 'user', content };
    addMessage(userMessage);

    setIsLoading(true);
    try {
      const response = await processMessage(content, csvData);
      const assistantMessage = { role: 'assistant', content: response };
      addMessage(assistantMessage);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `I encountered an error: ${error.message}\n\nPlease try rephrasing your question or check your data format.`
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatTitle>💬 Chat with the Assistant</ChatTitle>
      </ChatHeader>
      <ChatContent>
        <MessageList messages={messages} isLoading={isLoading} />
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </ChatContent>
    </ChatContainer>
  );
};

export default ChatInterface;