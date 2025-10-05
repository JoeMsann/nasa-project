import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, CheckCircle, AlertCircle, X, BarChart3 } from 'lucide-react';
import Papa from 'papaparse';
import { uploadAndAnalyzeCsv } from '../services/api';

const UploadContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
`;

const UploadTitle = styled.h3`
  color: white;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DropZone = styled(motion.div)`
  border: 2px dashed ${props =>
    props.isDragActive ? '#667eea' :
    props.hasError ? '#ff6b6b' :
    'rgba(255, 255, 255, 0.3)'
  };
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props =>
    props.isDragActive ? 'rgba(102, 126, 234, 0.1)' :
    'rgba(255, 255, 255, 0.02)'
  };

  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }
`;

const UploadIcon = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin-bottom: 1rem;
`;

const UploadText = styled.div`
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const UploadSubtext = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
`;

const FilePreview = styled(motion.div)`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`;

const FileIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FileDetails = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  color: white;
  font-weight: 500;
  font-size: 0.95rem;
`;

const FileSize = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
`;

const RemoveButton = styled(motion.button)`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const DataPreview = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  max-height: 150px;
  overflow-y: auto;
`;

const AnalyzeButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
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
  font-size: 1rem;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled(motion.div)`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  color: #ff6b6b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FileUploadAdvanced = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setError('Please upload a valid CSV file');
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      setError(null);
      setUploadedFile(file);

      Papa.parse(file, {
        complete: (results) => {
          if (results.errors.length > 0) {
            setError('Error parsing CSV file');
            return;
          }
          setFileData(results.data);
        },
        header: false,
        skipEmptyLines: true,
        preview: 5 // Only preview first 5 rows
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    maxFiles: 1,
    multiple: false
  });

  const removeFile = () => {
    setUploadedFile(null);
    setFileData(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    try {
      const response = await uploadAndAnalyzeCsv(uploadedFile);
      // Handle success - maybe show results in a modal or navigate to results page
    } catch (error) {
      setError(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <UploadContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <UploadTitle>
        <Upload size={20} />
        Upload CSV Data
      </UploadTitle>

      <DropZone
        {...getRootProps()}
        isDragActive={isDragActive}
        hasError={!!error}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input {...getInputProps()} />
        <UploadIcon
          animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Upload size={32} color="white" />
        </UploadIcon>
        <UploadText>
          {isDragActive ? 'Drop your CSV file here' : 'Drag & drop your CSV file'}
        </UploadText>
        <UploadSubtext>
          or click to browse files
        </UploadSubtext>
      </DropZone>

      <AnimatePresence>
        {uploadedFile && fileData && (
          <FilePreview
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FileHeader>
              <FileInfo>
                <FileIcon>
                  <File size={20} color="white" />
                </FileIcon>
                <FileDetails>
                  <FileName>{uploadedFile.name}</FileName>
                  <FileSize>
                    {formatFileSize(uploadedFile.size)} • {fileData.length} rows × {fileData[0]?.length || 0} columns
                  </FileSize>
                </FileDetails>
              </FileInfo>
              <RemoveButton
                onClick={removeFile}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </RemoveButton>
            </FileHeader>

            {fileData.length > 0 && (
              <DataPreview>
                <div style={{ marginBottom: '0.5rem', color: 'rgba(255,255,255,0.6)' }}>
                  Preview (first 5 rows):
                </div>
                {fileData.slice(0, 5).map((row, i) => (
                  <div key={i}>
                    [{row.slice(0, 8).join(', ')}{row.length > 8 ? ', ...' : ''}]
                  </div>
                ))}
              </DataPreview>
            )}

            <AnalyzeButton
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              whileHover={!isAnalyzing ? { scale: 1.02 } : {}}
              whileTap={!isAnalyzing ? { scale: 0.98 } : {}}
            >
              <BarChart3 size={20} />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Data'}
            </AnalyzeButton>
          </FilePreview>
        )}

        {error && (
          <ErrorMessage
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AlertCircle size={20} />
            {error}
          </ErrorMessage>
        )}
      </AnimatePresence>
    </UploadContainer>
  );
};

export default FileUploadAdvanced;