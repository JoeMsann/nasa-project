import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import Papa from 'papaparse';
import { useMessages } from '../hooks/useMessages';
import { uploadAndAnalyzeCsv } from '../services/api';

const DropzoneContainer = styled.div`
  border: 2px dashed ${props => props.isDragActive ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isDragActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};

  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.05);
  }
`;

const DropzoneText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
`;

const FileInfo = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 0.75rem;
  margin-top: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const FileName = styled.div`
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const FileDetails = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
`;

const AnalyzeButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border: none;
  border-radius: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(255, 107, 107, 0.3);
`;

const FileUpload = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { addMessage, setIsLoading } = useMessages();

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setError(null);
      setUploadedFile(file);

      // Parse CSV to show preview
      Papa.parse(file, {
        complete: (results) => {
          setFileData(results.data);
        },
        header: false,
        skipEmptyLines: true
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    maxFiles: 1,
    onDropRejected: (rejectedFiles) => {
      setError('Please upload a valid CSV file');
    }
  });

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    const userMessage = {
      role: 'user',
      content: `Analyze the uploaded CSV file: ${uploadedFile.name}`
    };
    addMessage(userMessage);

    setIsAnalyzing(true);
    setIsLoading(true);

    try {
      const response = await uploadAndAnalyzeCsv(uploadedFile);
      const assistantMessage = { role: 'assistant', content: response };
      addMessage(assistantMessage);
      setError(null);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `I encountered an error analyzing the CSV file: ${error.message}\n\nPlease ensure your CSV contains vectors with exactly 122 values between 0.0 and 1.0.`
      };
      addMessage(errorMessage);
      setError(error.message);
    } finally {
      setIsAnalyzing(false);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <DropzoneContainer {...getRootProps()} isDragActive={isDragActive}>
        <input {...getInputProps()} />
        <DropzoneText>
          {isDragActive ? (
            "Drop the CSV file here..."
          ) : (
            "Choose a CSV file with vectors or drag and drop here"
          )}
        </DropzoneText>
        <DropzoneText style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.8 }}>
          Each row should contain 122 numerical values between 0.0 and 1.0
        </DropzoneText>
      </DropzoneContainer>

      {uploadedFile && fileData && (
        <FileInfo>
          <FileName>📊 {uploadedFile.name}</FileName>
          <FileDetails>
            Shape: {fileData.length} rows × {fileData[0]?.length || 0} columns
          </FileDetails>
          <AnalyzeButton
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? '📈 Analyzing...' : '📈 Analyze CSV'}
          </AnalyzeButton>
        </FileInfo>
      )}

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}
    </div>
  );
};

export default FileUpload;