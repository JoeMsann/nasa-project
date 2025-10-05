import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Sparkles } from 'lucide-react';

const QuickAnalysisContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
`;

const Title = styled.h3`
  color: white;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const InputArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-family: monospace;
  font-size: 0.9rem;
  resize: vertical;
  margin-bottom: 1rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.08);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const PrimaryButton = styled(motion.button)`
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(motion.button)`
  padding: 1rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const ExampleVectors = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ExampleTitle = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const ExampleButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 0.8rem;
  text-decoration: underline;
  margin-right: 1rem;

  &:hover {
    color: #764ba2;
  }
`;

const QuickAnalysis = () => {
  const navigate = useNavigate();
  const [inputVector, setInputVector] = useState('');

  const exampleVectors = {
    'Positive Example': '0.95, 0.87, 0.92, 0.78, 0.89, 0.91, 0.85, 0.93, 0.88, 0.90, 0.84, 0.86, 0.94, 0.83, 0.87, 0.92, 0.89, 0.85, 0.91, 0.88, 0.93, 0.86, 0.90, 0.84, 0.87, 0.95, 0.89, 0.92, 0.85, 0.88, 0.91, 0.87, 0.93, 0.90, 0.86, 0.94, 0.88, 0.85, 0.92, 0.89, 0.87, 0.91, 0.93, 0.90, 0.86, 0.88, 0.94, 0.87, 0.85, 0.92, 0.89, 0.91, 0.88, 0.93, 0.86, 0.90, 0.87, 0.94, 0.85, 0.92, 0.89, 0.91, 0.88, 0.87, 0.93, 0.90, 0.86, 0.94, 0.85, 0.92, 0.89, 0.88, 0.91, 0.87, 0.93, 0.90, 0.86, 0.94, 0.88, 0.85, 0.92, 0.89, 0.87, 0.91, 0.93, 0.90, 0.86, 0.88, 0.94, 0.87, 0.85, 0.92, 0.89, 0.91, 0.88, 0.93, 0.86, 0.90, 0.87, 0.94, 0.85, 0.92, 0.89, 0.91, 0.88, 0.87, 0.93, 0.90, 0.86, 0.94, 0.85, 0.92, 0.89, 0.88, 0.91, 0.87, 0.93, 0.90, 0.86, 0.94, 0.88, 0.85',
    'Negative Example': '0.12, 0.08, 0.15, 0.22, 0.11, 0.19, 0.25, 0.13, 0.18, 0.20, 0.14, 0.16, 0.24, 0.17, 0.23, 0.12, 0.21, 0.15, 0.09, 0.18, 0.13, 0.26, 0.10, 0.24, 0.17, 0.15, 0.21, 0.12, 0.25, 0.18, 0.09, 0.23, 0.13, 0.20, 0.16, 0.14, 0.22, 0.25, 0.12, 0.21, 0.17, 0.19, 0.13, 0.20, 0.24, 0.18, 0.14, 0.23, 0.15, 0.12, 0.21, 0.19, 0.22, 0.13, 0.24, 0.20, 0.17, 0.14, 0.25, 0.12, 0.21, 0.19, 0.18, 0.23, 0.13, 0.20, 0.16, 0.24, 0.15, 0.12, 0.21, 0.22, 0.19, 0.23, 0.13, 0.20, 0.24, 0.18, 0.12, 0.25, 0.21, 0.17, 0.19, 0.13, 0.20, 0.24, 0.16, 0.22, 0.14, 0.23, 0.25, 0.12, 0.21, 0.19, 0.18, 0.13, 0.24, 0.20, 0.17, 0.23, 0.15, 0.12, 0.21, 0.22, 0.19, 0.23, 0.13, 0.20, 0.24, 0.18, 0.12, 0.25, 0.21, 0.17, 0.19, 0.13, 0.20, 0.24, 0.16, 0.22, 0.14, 0.23'
  };

  const handleAnalyze = () => {
    if (inputVector.trim()) {
      // Navigate to analysis view with the vector data
      navigate('/analysis', { state: { vectorData: inputVector.trim() } });
    }
  };

  const loadExample = (example) => {
    setInputVector(example);
  };

  return (
    <QuickAnalysisContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <Title>
        <Zap size={20} />
        Quick Vector Analysis
      </Title>

      <Description>
        Paste a 122-element vector below for instant exoplanet detection analysis.
        Each value should be between 0.0 and 1.0, separated by commas.
      </Description>

      <InputArea
        value={inputVector}
        onChange={(e) => setInputVector(e.target.value)}
        placeholder="0.1, 0.2, 0.3, 0.4, 0.5, ... (122 comma-separated values)"
      />

      <ButtonGroup>
        <PrimaryButton
          onClick={handleAnalyze}
          disabled={!inputVector.trim()}
          whileHover={inputVector.trim() ? { scale: 1.02 } : {}}
          whileTap={inputVector.trim() ? { scale: 0.98 } : {}}
        >
          <Sparkles size={18} />
          Analyze Vector
          <ArrowRight size={18} />
        </PrimaryButton>

        <SecondaryButton
          onClick={() => navigate('/analysis')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Full Analysis Tool
        </SecondaryButton>
      </ButtonGroup>

      <ExampleVectors>
        <ExampleTitle>Try example vectors:</ExampleTitle>
        {Object.entries(exampleVectors).map(([name, vector]) => (
          <ExampleButton
            key={name}
            onClick={() => loadExample(vector)}
          >
            {name}
          </ExampleButton>
        ))}
      </ExampleVectors>
    </QuickAnalysisContainer>
  );
};

export default QuickAnalysis;