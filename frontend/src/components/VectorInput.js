import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Calculator, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import ChatInterfaceAdvanced from "./ChatInterfaceAdvanced";

const InputContainer = styled.div`
  width: 100%;
`;

const Title = styled.h3`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  border: 1px solid ${props =>
    props.hasError ? '#ff6b6b' :
    props.isValid ? '#4ecdc4' :
    'rgba(255, 255, 255, 0.2)'
  };
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-family: monospace;
  font-size: 0.85rem;
  resize: vertical;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.08);
  }
`;

const ValidationInfo = styled(motion.div)`
  margin-top: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;

  ${props => props.type === 'error' && `
    background: rgba(255, 107, 107, 0.1);
    border: 1px solid rgba(255, 107, 107, 0.3);
    color: #ff6b6b;
  `}

  ${props => props.type === 'success' && `
    background: rgba(78, 205, 196, 0.1);
    border: 1px solid rgba(78, 205, 196, 0.3);
    color: #4ecdc4;
  `}

  ${props => props.type === 'info' && `
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
  `}
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Button = styled(motion.button)`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  ${props => props.variant === 'primary' && `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  `}

  ${props => props.variant === 'secondary' && `
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 0.5rem;
  text-align: center;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
`;

const VectorInput = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value || '');
  const [validation, setValidation] = useState({isValid: false, message: '', count: 0});

  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value || '');
    }
  }, [value]);

  useEffect(() => {
    validateVector(localValue);
  }, [localValue]);

  const validateVector = (input) => {
    if (!input.trim()) {
      setValidation({isValid: false, message: 'Enter vector data to validate', count: 0});
      return;
    }

    try {
      // Extract numbers from input
      const numbers = input.match(/\\d*\\.?\\d+/g) || [];
      const count = numbers.length;

      if (count === 0) {
        setValidation({isValid: false, message: 'No valid numbers found', count: 0});
        return;
      }

      if (count !== 122) {
        setValidation({
          isValid: false,
          message: `Expected 122 values, found ${count}`,
          count
        });
        return;
      }

      // Check value ranges
      const values = numbers.map(Number);
      const outOfRange = values.filter(v => v < 0 || v > 1);

      if (outOfRange.length > 0) {
        setValidation({
          isValid: false,
          message: `${outOfRange.length} values outside range [0.0, 1.0]`,
          count
        });
        return;
      }

      setValidation({
        isValid: true,
        message: 'Vector format is valid ✓',
        count,
        stats: {
          min: Math.min(...values).toFixed(3),
          max: Math.max(...values).toFixed(3),
          avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(3)
        }
      });

    } catch (error) {
      setValidation({isValid: false, message: 'Error parsing vector data', count: 0});
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  const generateRandomVector = () => {
    const vector = Array.from({length: 122}, () => Math.random().toFixed(3));
    const newValue = vector.join(', ');
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  const clearInput = () => {
    setLocalValue('');
    onChange?.('');
  };

  return (
      <InputContainer>
        <Title>
          <Calculator size={20}/>
          Vector Input
        </Title>

        <TextArea
            value={localValue}
            onChange={handleChange}
            placeholder={`Paste your 122-element vector here...

Example:
0.123, 0.456, 0.789, 0.234, ...`}
            hasError={validation.message && !validation.isValid}
            isValid={validation.isValid}
        />

        {validation.message && (
            <ValidationInfo
                type={
                  validation.isValid
                      ? 'success'
                      : validation.count > 0
                          ? 'error'
                          : 'info'
                }
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
            >
              {validation.isValid ? (
                  <CheckCircle size={16}/>
              ) : validation.count > 0 ? (
                  <AlertTriangle size={16}/>
              ) : (
                  <Calculator size={16}/>
              )}
              {validation.message}
            </ValidationInfo>
        )}

        {validation.isValid && validation.stats && (
            <Stats>
              <StatItem>
                <StatLabel>Min Value</StatLabel>
                <StatValue>{validation.stats.min}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Max Value</StatLabel>
                <StatValue>{validation.stats.max}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Average</StatLabel>
                <StatValue>{validation.stats.avg}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Count</StatLabel>
                <StatValue>{validation.count}</StatValue>
              </StatItem>
            </Stats>
        )}

        <ButtonGroup>
          <Button
              variant="secondary"
              onClick={generateRandomVector}
              whileHover={{scale: 1.02}}
              whileTap={{scale: 0.98}}
          >
            <RefreshCw size={16}/>
            Random
          </Button>

          <Button
              variant="secondary"
              onClick={clearInput}
              whileHover={{scale: 1.02}}
              whileTap={{scale: 0.98}}
          >
            Clear
          </Button>
        </ButtonGroup>
      </InputContainer>
  );
}
export default VectorInput;
