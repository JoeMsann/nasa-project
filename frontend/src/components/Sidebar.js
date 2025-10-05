import React, { useState } from 'react';
import styled from 'styled-components';
import FileUpload from './FileUpload';
import { useMessages } from '../hooks/useMessages';

const SidebarContainer = styled.div`
  width: 320px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
`;

const SidebarSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h3`
  color: white;
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 1rem 0;
`;

const ClearButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const InfoSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
`;

const InfoTitle = styled.h4`
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0;
`;

const InfoList = styled.ul`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0.5rem 0 0 1rem;
  padding: 0;
`;

const Sidebar = () => {
  const { clearMessages } = useMessages();

  const handleClearChat = () => {
    clearMessages();
  };

  return (
    <SidebarContainer>
      <SidebarSection>
        <SectionTitle>📁 Upload CSV Data</SectionTitle>
        <FileUpload />
      </SidebarSection>

      <Divider />

      <SidebarSection>
        <ClearButton onClick={handleClearChat}>
          🗑️ Clear Chat
        </ClearButton>
      </SidebarSection>

      <InfoSection>
        <InfoTitle>ℹ️ About this system</InfoTitle>
        <InfoText>
          This NASA Exoplanet Detection System uses machine learning to analyze stellar data and identify potential exoplanets.
        </InfoText>

        <InfoTitle style={{ marginTop: '1rem' }}>Features:</InfoTitle>
        <InfoList>
          <li>Vector Analysis: Input 122-element vectors</li>
          <li>Batch Processing: Upload CSV files</li>
          <li>Conversational Interface: Ask questions</li>
        </InfoList>

        <InfoTitle style={{ marginTop: '1rem' }}>Data Requirements:</InfoTitle>
        <InfoList>
          <li>Vectors must contain exactly 122 values</li>
          <li>All values should be between 0.0 and 1.0</li>
          <li>CSV files: each vector as a row with 122 columns</li>
        </InfoList>
      </InfoSection>
    </SidebarContainer>
  );
};

export default Sidebar;