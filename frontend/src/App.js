import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { MessageProvider } from './hooks/useMessages';
import Dashboard from './components/Dashboard';
import AnalysisView from './components/AnalysisView';
import Navigation from './components/Navigation';
import ServicesSidebar from './components/ServicesSidebar';

const AppContainer = styled.div`
  min-height: 100vh;
  background: radial-gradient(ellipse at top, #1a1a2e 0%, #0f0f1b 100%);
  position: relative;
  overflow-x: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const MainContent = styled(motion.main)`
  position: relative;
  z-index: 1;
  min-height: 100vh;
`;

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <MessageProvider>
      <Router>
        <AppContainer>
          <Navigation
            currentView={currentView}
            setCurrentView={setCurrentView}
            onToggleSidebar={toggleSidebar}
          />
          <ServicesSidebar
            isOpen={sidebarOpen}
            onClose={closeSidebar}
          />
          <MainContent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analysis" element={<AnalysisView />} />
            </Routes>
          </MainContent>
        </AppContainer>
      </Router>
    </MessageProvider>
  );
}

export default App;