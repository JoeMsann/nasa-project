import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ChatInterfaceAdvanced from './ChatInterfaceAdvanced';
import ResultsVisualization from './ResultsVisualization';
import VectorInput from './VectorInput';

const AnalysisContainer = styled.div`
  padding: 6rem 2rem 2rem;
  max-width: 1600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  min-height: calc(100vh - 6rem);

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const MainPanel = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SidePanel = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 1200px) {
    order: -1;
  }
`;

const PanelCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  height: fit-content;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const AnalysisView = () => {
  const location = useLocation();
  const [analysisResults, setAnalysisResults] = useState(null);
  const [currentVector, setCurrentVector] = useState('');

  useEffect(() => {
    // Check if we have vector data from navigation state
    if (location.state?.vectorData) {
      setCurrentVector(location.state.vectorData);
    }
  }, [location.state]);

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
  };

  const handleVectorChange = (vector) => {
    setCurrentVector(vector);
    // Clear previous results when vector changes
    setAnalysisResults(null);
  };

  return (
    <AnalysisContainer>
      <MainPanel
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <Title>Exoplanet Analysis</Title>
          <Subtitle>
            Advanced AI-powered analysis for exoplanet detection and stellar data interpretation
          </Subtitle>
        </div>

        <ChatInterfaceAdvanced
          onAnalysisComplete={handleAnalysisComplete}
          initialVector={currentVector}
        />

        {analysisResults && (
          <PanelCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResultsVisualization data={analysisResults} />
          </PanelCard>
        )}
      </MainPanel>

      <SidePanel
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <PanelCard>
          <VectorInput
            value={currentVector}
            onChange={handleVectorChange}
          />
        </PanelCard>

        <PanelCard>
          <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.2rem' }}>
            📊 Analysis Info
          </h3>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            <p>• <strong>Vector Size:</strong> Exactly 122 elements required</p>
            <p>• <strong>Value Range:</strong> 0.0 to 1.0</p>
            <p>• <strong>Format:</strong> Comma-separated values</p>
            <p>• <strong>Analysis Time:</strong> ~2-5 seconds</p>
            <p>• <strong>Accuracy:</strong> 95%+ detection rate</p>
          </div>
        </PanelCard>
      </SidePanel>
    </AnalysisContainer>
  );
};

export default AnalysisView;