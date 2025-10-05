import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  User,
  Bot,
  Loader,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { processMessage } from '../services/api';

// =================== Styled Components ===================

const ChatContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  height: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
`;

const ChatTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
`;

const MessageBubble = styled(motion.div)`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  ${(props) =>
    props.isUser &&
    `
    flex-direction: row-reverse;
    align-self: flex-end;
  `}
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${(props) =>
    props.isUser
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'rgba(255, 255, 255, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const MessageContent = styled.div`
  max-width: 70%;
  ${(props) => props.isUser && 'align-self: flex-end;'}
`;

const MessageText = styled.div`
  background: ${(props) =>
    props.isUser
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  padding: 1rem;
  border-radius: 16px;
  ${(props) =>
    props.isUser &&
    `
    border-bottom-right-radius: 4px;
  `}
  ${(props) =>
    !props.isUser &&
    `
    border-bottom-left-radius: 4px;
  `}
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const MessageActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  opacity: 0.7;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const InputContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
`;

const TextInput = styled.textarea`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.75rem;
  color: white;
  font-family: inherit;
  font-size: 0.9rem;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SendButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  padding: 2rem;
  line-height: 1.6;
`;

// =================== Component ===================

const ChatInterfaceAdvanced = ({ onAnalysisComplete, initialVector }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (initialVector) {
      setInput(initialVector);
    }
  }, [initialVector]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await processMessage(input.trim());
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (
        response.includes('exoplanet') ||
        response.includes('detection') ||
        response.includes('probability')
      ) {
        onAnalysisComplete?.(response);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Error: ${error.message}\n\nPlease try again or check your input format.`,
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatTitle>
          <Bot size={20} />
          AI Assistant
        </ChatTitle>
      </ChatHeader>

      <MessagesContainer>
        {messages.length === 0 ? (
          <WelcomeMessage>
            🪐 Welcome to the NASA Exoplanet Detection Assistant!
            <br />
            <br />
            I can help you analyze stellar data vectors, answer questions about
            exoplanet detection, and provide insights into the analysis results.
            <br />
            <br />
            Try pasting a 122-element vector or asking me about exoplanet
            detection methods.
          </WelcomeMessage>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              isUser={message.role === 'user'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Avatar isUser={message.role === 'user'}>
                {message.role === 'user' ? (
                  <User size={20} />
                ) : (
                  <Bot size={20} />
                )}
              </Avatar>

              <MessageContent isUser={message.role === 'user'}>
                <MessageText isUser={message.role === 'user'}>
                  {message.content}
                </MessageText>

                {message.role === 'assistant' && (
                  <MessageActions>
                    <ActionButton onClick={() => copyMessage(message.content)}>
                      <Copy size={14} />
                    </ActionButton>
                  </MessageActions>
                )}
              </MessageContent>
            </MessageBubble>
          ))
        )}

        <AnimatePresence>
          {isLoading && (
            <LoadingIndicator
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <Loader size={16} />
              </motion.div>
              AI is thinking...
            </LoadingIndicator>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <InputWrapper>
          <TextInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about exoplanet detection or paste your 122-element vector..."
            disabled={isLoading}
            rows={1}
          />
          <SendButton
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            whileHover={!isLoading ? { scale: 1.05 } : {}}
            whileTap={!isLoading ? { scale: 0.95 } : {}}
          >
            <Send size={20} />
          </SendButton>
        </InputWrapper>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatInterfaceAdvanced;
