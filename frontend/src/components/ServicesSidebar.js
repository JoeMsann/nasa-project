import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Upload,
  Calculator,
  BarChart3,
  FileText,
  Zap,
  Home,
  X,
  ChevronRight
} from 'lucide-react';

const SidebarOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  backdrop-filter: blur(4px);
`;

const SidebarContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 320px;
  height: 100vh;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 201;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  /* Hide scrollbar for Webkit browsers */
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;

  /* Hide scrollbar for IE/Edge */
  -ms-overflow-style: none;
`;

const SidebarHeader = styled.div`
  padding: 2rem 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SidebarTitle = styled.h2`
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled(motion.button)`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ServicesGrid = styled.div`
  padding: 1.5rem;
  flex: 1;
`;

const ServiceCategory = styled.div`
  margin-bottom: 2rem;
`;

const CategoryTitle = styled.h3`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
  padding-left: 0.5rem;
`;

const ServiceItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(102, 126, 234, 0.3);
    transform: translateY(-1px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const ServiceContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ServiceIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const ServiceInfo = styled.div`
  flex: 1;
`;

const ServiceName = styled.h4`
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
`;

const ServiceDescription = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin: 0;
  line-height: 1.3;
`;

const ServiceArrow = styled(ChevronRight)`
  color: rgba(255, 255, 255, 0.4);
  transition: all 0.2s ease;

  ${ServiceItem}:hover & {
    color: rgba(255, 255, 255, 0.8);
    transform: translateX(2px);
  }
`;

const ServicesSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const services = {
    'Main Views': [
      {
        name: 'Dashboard',
        description: 'Main hub with overview and quick access',
        icon: Home,
        path: '/',
        action: () => navigate('/')
      },
      {
        name: 'Analysis View',
        description: 'Detailed analysis and visualization tools',
        icon: BarChart3,
        path: '/analysis',
        action: () => navigate('/analysis')
      }
    ],
    'Analysis Tools': [
      {
        name: 'Chat Interface',
        description: 'AI-powered conversational analysis',
        icon: MessageSquare,
        component: 'ChatInterface',
        action: () => navigate('/')
      },
      {
        name: 'Vector Input',
        description: 'Input 122-element vectors for detection',
        icon: Calculator,
        component: 'VectorInput',
        action: () => navigate('/')
      },
      {
        name: 'Quick Analysis',
        description: 'Fast analysis with immediate results',
        icon: Zap,
        component: 'QuickAnalysis',
        action: () => navigate('/analysis')
      }
    ],
    'Data Processing': [
      {
        name: 'File Upload',
        description: 'Upload CSV files for batch processing',
        icon: Upload,
        component: 'FileUpload',
        action: () => navigate('/')
      },
      {
        name: 'Advanced Upload',
        description: 'Enhanced file processing with validation',
        icon: FileText,
        component: 'FileUploadAdvanced',
        action: () => navigate('/')
      },
      {
        name: 'Results Visualization',
        description: 'Interactive charts and data visualization',
        icon: BarChart3,
        component: 'ResultsVisualization',
        action: () => navigate('/analysis')
      }
    ]
  };

  const handleServiceClick = (service) => {
    if (service.action) {
      service.action();
    }
    onClose();
  };

  const sidebarVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    }
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <SidebarOverlay
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={onClose}
          />
          <SidebarContainer
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
          >
            <SidebarHeader>
              <SidebarTitle>Services</SidebarTitle>
              <CloseButton
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </CloseButton>
            </SidebarHeader>

            <ServicesGrid>
              {Object.entries(services).map(([category, items]) => (
                <ServiceCategory key={category}>
                  <CategoryTitle>{category}</CategoryTitle>
                  {items.map((service, index) => {
                    const Icon = service.icon;
                    const isCurrentPath = service.path && location.pathname === service.path;

                    return (
                      <ServiceItem
                        key={service.name}
                        onClick={() => handleServiceClick(service)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { delay: index * 0.05 }
                        }}
                      >
                        <ServiceContent>
                          <ServiceIcon>
                            <Icon size={20} />
                          </ServiceIcon>
                          <ServiceInfo>
                            <ServiceName>{service.name}</ServiceName>
                            <ServiceDescription>{service.description}</ServiceDescription>
                          </ServiceInfo>
                          <ServiceArrow size={16} />
                        </ServiceContent>
                      </ServiceItem>
                    );
                  })}
                </ServiceCategory>
              ))}
            </ServicesGrid>
          </SidebarContainer>
        </>
      )}
    </AnimatePresence>
  );
};

export default ServicesSidebar;