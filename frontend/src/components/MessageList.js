import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  scroll-behavior: smooth;
`;

const MessageWrapper = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: ${props => props.role === 'user' ? 'flex-end' : 'flex-start'};
`;

const Message = styled.div`
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: ${props =>
    props.role === 'user'
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'rgba(255, 255, 255, 0.1)'
  };
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 2px;

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: white;
    animation: pulse 1.4s ease-in-out infinite both;
  }

  .dot:nth-child(1) { animation-delay: -0.32s; }
  .dot:nth-child(2) { animation-delay: -0.16s; }
  .dot:nth-child(3) { animation-delay: 0; }

  @keyframes pulse {
    0%, 80%, 100% {
      opacity: 0.3;
      transform: scale(0.9);
    }
    40% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const MessageList = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <MessagesContainer>
      {messages.map((message, index) => (
        <MessageWrapper key={index} role={message.role}>
          <Message role={message.role}>
            {message.content}
          </Message>
        </MessageWrapper>
      ))}
      {isLoading && (
        <MessageWrapper role="assistant">
          <LoadingMessage>
            💭 Thinking...
            <LoadingDots>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </LoadingDots>
          </LoadingMessage>
        </MessageWrapper>
      )}
      <div ref={messagesEndRef} />
    </MessagesContainer>
  );
};

export default MessageList;