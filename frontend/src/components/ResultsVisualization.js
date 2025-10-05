import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Target, Zap, AlertCircle } from 'lucide-react';

const VisualizationContainer = styled.div`
  width: 100%;
`;

const Title = styled.h3`
  color: white;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`;

const MetricIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${props => props.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const MetricLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const ChartSection = styled.div`
  margin-bottom: 2rem;
`;

const ChartTitle = styled.h4`
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const ChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const CustomTooltip = styled.div`
  background: rgba(26, 26, 46, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 0.9rem;
`;

const AlertBox = styled(motion.div)`
  background: ${props =>
    props.type === 'positive' ? 'rgba(78, 205, 196, 0.1)' :
    props.type === 'negative' ? 'rgba(255, 107, 107, 0.1)' :
    'rgba(255, 193, 7, 0.1)'
  };
  border: 1px solid ${props =>
    props.type === 'positive' ? 'rgba(78, 205, 196, 0.3)' :
    props.type === 'negative' ? 'rgba(255, 107, 107, 0.3)' :
    'rgba(255, 193, 7, 0.3)'
  };
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const AlertContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AlertIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props =>
    props.type === 'positive' ? '#4ecdc4' :
    props.type === 'negative' ? '#ff6b6b' :
    '#ffc107'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const AlertText = styled.div`
  color: white;
  line-height: 1.5;
`;

const ResultsVisualization = ({ data }) => {
  // Parse the response to extract meaningful data
  // This would need to be adapted based on your actual API response format
  const parseAnalysisResults = (response) => {
    // Mock data for demonstration - replace with actual parsing logic
    const hasExoplanet = response.toLowerCase().includes('exoplanet detected') ||
                        response.toLowerCase().includes('positive') ||
                        Math.random() > 0.5; // Mock logic

    const confidence = Math.random() * 100;
    const anomalyScore = Math.random() * 10;

    return {
      detection: hasExoplanet ? 'Positive' : 'Negative',
      confidence: confidence.toFixed(1),
      anomalyScore: anomalyScore.toFixed(2),
      signalStrength: (Math.random() * 100).toFixed(1),
      hasExoplanet,
      vectorAnalysis: Array.from({ length: 20 }, (_, i) => ({
        segment: i + 1,
        value: Math.random() * 100,
        baseline: 50 + Math.random() * 20
      }))
    };
  };

  const results = parseAnalysisResults(data);

  const metrics = [
    {
      icon: Target,
      label: 'Detection Result',
      value: results.detection,
      color: results.hasExoplanet ?
        'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)' :
        'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
    },
    {
      icon: TrendingUp,
      label: 'Confidence',
      value: `${results.confidence}%`,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: Zap,
      label: 'Signal Strength',
      value: `${results.signalStrength}%`,
      color: 'linear-gradient(135deg, #ffc107 0%, #ff8f00 100%)'
    },
    {
      icon: AlertCircle,
      label: 'Anomaly Score',
      value: results.anomalyScore,
      color: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)'
    }
  ];

  const pieData = [
    { name: 'Signal', value: parseFloat(results.signalStrength) },
    { name: 'Noise', value: 100 - parseFloat(results.signalStrength) }
  ];

  const pieColors = ['#667eea', '#ff6b6b'];

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <CustomTooltip>
          <div>{`${payload[0].name}: ${payload[0].value.toFixed(1)}%`}</div>
        </CustomTooltip>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <CustomTooltip>
          <div>{`Segment ${label}`}</div>
          <div>{`Value: ${payload[0].value.toFixed(2)}`}</div>
          <div>{`Baseline: ${payload[1].value.toFixed(2)}`}</div>
        </CustomTooltip>
      );
    }
    return null;
  };

  return (
    <VisualizationContainer>
      <Title>
        <BarChart size={24} />
        Analysis Results
      </Title>

      <AlertBox
        type={results.hasExoplanet ? 'positive' : 'negative'}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AlertContent>
          <AlertIcon type={results.hasExoplanet ? 'positive' : 'negative'}>
            {results.hasExoplanet ? '🪐' : '❌'}
          </AlertIcon>
          <AlertText>
            <strong>
              {results.hasExoplanet ? 'Exoplanet Detected!' : 'No Exoplanet Detected'}
            </strong>
            <br />
            {results.hasExoplanet
              ? `Analysis indicates a ${results.confidence}% probability of exoplanet presence based on the stellar data patterns.`
              : `The vector analysis shows patterns consistent with stellar noise rather than exoplanet signals.`
            }
          </AlertText>
        </AlertContent>
      </AlertBox>

      <MetricsGrid>
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <MetricIcon color={metric.color}>
              <metric.icon size={24} color="white" />
            </MetricIcon>
            <MetricValue>{metric.value}</MetricValue>
            <MetricLabel>{metric.label}</MetricLabel>
          </MetricCard>
        ))}
      </MetricsGrid>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <ChartSection>
          <ChartTitle>Signal vs Noise Distribution</ChartTitle>
          <ChartContainer>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartSection>

        <ChartSection>
          <ChartTitle>Vector Segment Analysis</ChartTitle>
          <ChartContainer>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={results.vectorAnalysis.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="segment"
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="value" fill="#667eea" radius={[2, 2, 0, 0]} />
                <Bar dataKey="baseline" fill="rgba(255,255,255,0.2)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartSection>
      </div>
    </VisualizationContainer>
  );
};

export default ResultsVisualization;