import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Upload, MessageCircle, BarChart3, Sparkles, ArrowRight, Database } from 'lucide-react';
import FileUploadAdvanced from './FileUploadAdvanced';
import QuickAnalysis from './QuickAnalysis';

const DashboardContainer = styled.div`
  padding: 6rem 2rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Hero = styled(motion.section)`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CTAButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(102, 126, 234, 0.3);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h3`
  color: white;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const QuickActionsSection = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  color: white;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [showQuickAnalysis, setShowQuickAnalysis] = useState(false);

  const features = [
    {
      icon: Database,
      title: 'Vector Analysis',
      description: 'Input 122-element vectors representing stellar measurements for instant exoplanet detection analysis.',
      action: () => navigate('/analysis')
    },
    {
      icon: Upload,
      title: 'Batch Processing',
      description: 'Upload CSV files containing multiple vectors for comprehensive batch analysis with detailed reports.',
      action: () => setShowQuickAnalysis(true)
    },
    {
      icon: MessageCircle,
      title: 'AI Assistant',
      description: 'Ask questions about exoplanet detection methods and get expert explanations from our AI assistant.',
      action: () => navigate('/analysis')
    },
    {
      icon: BarChart3,
      title: 'Visual Analytics',
      description: 'View detection results with interactive charts and visualizations for better data understanding.',
      action: () => navigate('/analysis')
    }
  ];

  return (
    <DashboardContainer>
      <Hero
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Discover Exoplanets with AI
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Advanced machine learning analysis of stellar data to detect potential exoplanets
          in distant star systems with unprecedented accuracy.
        </Subtitle>
        <CTAButton
          onClick={() => navigate('/analysis')}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles size={20} />
          Start Analysis
          <ArrowRight size={20} />
        </CTAButton>
      </Hero>

      <FeaturesGrid>
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            onClick={feature.action}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <FeatureIcon>
              <feature.icon size={28} color="white" />
            </FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeaturesGrid>

      <QuickActionsSection>
        <SectionTitle>Quick Actions</SectionTitle>
        <QuickActions>
          <FileUploadAdvanced />
          <QuickAnalysis />
        </QuickActions>
      </QuickActionsSection>
    </DashboardContainer>
  );
};

export default Dashboard;