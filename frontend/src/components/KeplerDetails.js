import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft, Info, Thermometer, Zap, Star, Globe } from 'lucide-react';
import { fetchKeplerById } from '../services/api';
import * as THREE from 'three';

const Container = styled(motion.div)`
  min-height: 100vh;
  padding: 1rem;
  padding-top: 5rem; /* Space for navigation bar */
  background: radial-gradient(ellipse at top, #1a1a2e 0%, #0f0f1b 100%);
  color: white;
  max-width: 1400px;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: 2rem;
    padding-top: 6rem; /* More space on larger screens */
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const BackButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(-2px);
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    font-size: 1.5rem;
  }
`;

const ErrorContainer = styled.div`
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  padding: 1.5rem;
  border-radius: 1rem;
  text-align: center;
  color: #ff3b30;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const DataCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.2rem;
  backdrop-filter: blur(10px);
  height: fit-content;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #667eea;
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const DataRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.6rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  gap: 1rem;

  &:last-child {
    border-bottom: none;
  }

  @media (min-width: 768px) {
    padding: 0.75rem 0;
    align-items: center;
  }
`;

const DataLabel = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  flex: 1;
  min-width: 0;

  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`;

const DataValue = styled.span`
  color: white;
  font-weight: 500;
  text-align: right;
  flex-shrink: 0;
  word-break: break-word;
  font-size: 0.85rem;

  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`;

const PlanetVisualizationCard = styled(DataCard)`
  @media (min-width: 1200px) {
    grid-column: span 2;
  }
`;

const PlanetContainer = styled.div`
  width: 100%;
  height: 450px;
  border-radius: 0.5rem;
  overflow: hidden;
  position: relative;
  background: transparent;

  @media (min-width: 768px) {
    height: 550px;
  }
`;

const PlanetInfo = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.7);
  padding: 0.75rem;
  border-radius: 0.5rem;
  backdrop-filter: blur(10px);
  z-index: 10;
`;

const PlanetStats = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
`;

const ColorLegend = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  padding: 0.75rem;
  border-radius: 0.5rem;
  backdrop-filter: blur(10px);
  z-index: 10;
  min-width: 200px;
`;

const LegendTitle = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.9);

  &:last-child {
    margin-bottom: 0;
  }
`;

const ColorSwatch = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 3px;
`;

const ComparisonBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ComparisonLabel = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  min-width: 60px;
`;

const ComparisonValue = styled.div`
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  position: relative;
`;

const ComparisonFill = styled(motion.div)`
  height: 100%;
  border-radius: 2px;
  position: absolute;
  top: 0;
  left: 0;
`;

const MetricCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const MetricValue = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
`;

const MetricUnit = styled.span`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-left: 0.25rem;
`;

const MetricComparison = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.25rem;
`;


const formatValue = (value, unit = '') => {
  if (value === -1 || value === 0) return 'N/A';
  if (typeof value === 'number') {
    return `${value.toLocaleString()} ${unit}`.trim();
  }
  return value;
};

// Three.js Planet Visualization Component
const PlanetVisualization = ({ data }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const planetRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current || !data) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Calculate planet characteristics from Kepler data (made bigger)
    const planetRadius = Math.max(1.0, Math.min(7, (data["Planet_Radius_(Earth_radii)"] || 1) * 0.8));
    const temperature = data["Equilibrium_Temperature_(K)"] || 300;
    const insolationFlux = data["Insolation_Flux_(Earth_flux)"] || 1;

    // Color based on temperature (K to RGB)
    let planetColor;
    if (temperature < 200) {
      planetColor = new THREE.Color(0x4169E1); // Cold blue
    } else if (temperature < 300) {
      planetColor = new THREE.Color(0x87CEEB); // Light blue
    } else if (temperature < 400) {
      planetColor = new THREE.Color(0x90EE90); // Light green
    } else if (temperature < 600) {
      planetColor = new THREE.Color(0xFFD700); // Gold
    } else if (temperature < 1000) {
      planetColor = new THREE.Color(0xFF4500); // Orange red
    } else {
      planetColor = new THREE.Color(0xFF0000); // Hot red
    }

    // Create planet geometry and material
    const geometry = new THREE.SphereGeometry(planetRadius, 64, 64);
    const material = new THREE.MeshPhongMaterial({
      color: planetColor,
      shininess: 50,
      transparent: true,
      opacity: 0.95
    });

    const planet = new THREE.Mesh(geometry, material);
    scene.add(planet);

    // Add atmosphere effect for larger planets
    if (planetRadius > 2) {
      const atmosphereGeometry = new THREE.SphereGeometry(planetRadius * 1.1, 32, 32);
      const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: planetColor,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
      });
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      scene.add(atmosphere);
    }

    // Add rings for gas giants (radius > 3 Earth radii)
    if ((data["Planet_Radius_(Earth_radii)"] || 1) > 3) {
      const ringGeometry = new THREE.RingGeometry(planetRadius * 1.5, planetRadius * 2.5, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      });
      const rings = new THREE.Mesh(ringGeometry, ringMaterial);
      rings.rotation.x = Math.PI / 2;
      scene.add(rings);
    }

    // Lighting based on stellar properties
    const stellarTemp = data["Stellar_Effective_Temperature_(K)"] || 5778;
    let lightColor;
    if (stellarTemp < 3500) {
      lightColor = 0xFF4500; // Red dwarf
    } else if (stellarTemp < 5000) {
      lightColor = 0xFFA500; // Orange
    } else if (stellarTemp < 6000) {
      lightColor = 0xFFFFFF; // White
    } else {
      lightColor = 0x87CEEB; // Blue
    }

    const directionalLight = new THREE.DirectionalLight(lightColor, insolationFlux);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    // Position camera closer for bigger appearance
    camera.position.z = planetRadius * 3;

    // Mouse controls for dragging
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (event) => {
      isDragging = true;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleMouseMove = (event) => {
      if (isDragging && planetRef.current) {
        const deltaMove = {
          x: event.clientX - previousMousePosition.x,
          y: event.clientY - previousMousePosition.y
        };

        planetRef.current.rotation.y += deltaMove.x * 0.01;
        planetRef.current.rotation.x += deltaMove.y * 0.01;

        previousMousePosition = {
          x: event.clientX,
          y: event.clientY
        };
      }
    };

    // Add event listeners
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseleave', handleMouseUp);
    renderer.domElement.style.cursor = 'grab';

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;
    planetRef.current = planet;

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      if (planetRef.current && !isDragging) {
        planetRef.current.rotation.y += 0.003;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (mountRef.current && renderer && camera) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [data]);

  const planetRadius = data["Planet_Radius_(Earth_radii)"] || 1;
  const temperature = data["Equilibrium_Temperature_(K)"] || 300;
  const orbitalPeriod = data["Orbital_Period_(days)"] || 365;

  return (
    <PlanetVisualizationCard
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <CardHeader>
        <Globe size={24} />
        <CardTitle>3D Planet Visualization</CardTitle>
      </CardHeader>
      <PlanetContainer ref={mountRef}>
        <PlanetInfo>
          <PlanetStats>
            <div><strong>Size:</strong> {planetRadius.toFixed(1)}× Earth</div>
            <div><strong>Temperature:</strong> {temperature}K</div>
            <div><strong>Year:</strong> {orbitalPeriod.toFixed(1)} days</div>
            <div><strong>Type:</strong> {
              planetRadius < 1.5 ? 'Rocky Planet' :
              planetRadius < 4 ? 'Sub-Neptune' :
              planetRadius < 10 ? 'Gas Giant' : 'Super Giant'
            }</div>
          </PlanetStats>
        </PlanetInfo>

        <ColorLegend>
          <LegendTitle>Planet Color Guide</LegendTitle>
          <LegendItem>
            <ColorSwatch style={{ backgroundColor: '#4169E1' }} />
            <span>Frozen (&lt; 200K)</span>
          </LegendItem>
          <LegendItem>
            <ColorSwatch style={{ backgroundColor: '#87CEEB' }} />
            <span>Cold (200-300K)</span>
          </LegendItem>
          <LegendItem>
            <ColorSwatch style={{ backgroundColor: '#90EE90' }} />
            <span>Cool (300-400K)</span>
          </LegendItem>
          <LegendItem>
            <ColorSwatch style={{ backgroundColor: '#FFD700' }} />
            <span>Warm (400-600K)</span>
          </LegendItem>
          <LegendItem>
            <ColorSwatch style={{ backgroundColor: '#FF4500' }} />
            <span>Hot (600-1000K)</span>
          </LegendItem>
          <LegendItem>
            <ColorSwatch style={{ backgroundColor: '#FF0000' }} />
            <span>Extreme (&gt; 1000K)</span>
          </LegendItem>
        </ColorLegend>
      </PlanetContainer>
    </PlanetVisualizationCard>
  );
};

const KeplerDetails = () => {
  const { keplerId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadKeplerData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchKeplerById(keplerId);

        // Handle Gradio response - expecting array with one item
        let keplerData = null;
        let hasExplicitFailure = false;

        if (Array.isArray(result) && result.length > 0) {
          // Gradio returns an array with one item
          const firstItem = result[0];

          // Check for explicit failure
          if (firstItem && firstItem.success === false) {
            hasExplicitFailure = true;
          } else if (firstItem && firstItem.success && firstItem.data) {
            // Format: [{ success: true, kepler_id: ..., data: {...} }]
            keplerData = firstItem.data;
          } else if (firstItem && firstItem.data) {
            // Format: [{ data: {...} }]
            keplerData = firstItem.data;
          } else if (firstItem) {
            // Direct data format: [{ Row_ID: ..., Kepler_ID: ... }]
            keplerData = firstItem;
          }
        } else if (result && result.success === false) {
          hasExplicitFailure = true;
        } else if (result && result.success && result.data) {
          // Format: { success: true, kepler_id: ..., data: {...} }
          keplerData = result.data;
        } else if (result && result.data) {
          // Format: { data: {...} }
          keplerData = result.data;
        } else if (result) {
          // Direct data format
          keplerData = result;
        }

        if (keplerData) {
          setData(keplerData);
        } else if (hasExplicitFailure) {
          setData(null);
        } else {
          setError('No valid data structure received from API');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (keplerId) {
      loadKeplerData();
    }
  }, [keplerId]);

  const goBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Star size={48} />
          </motion.div>
          <span style={{ marginLeft: '1rem' }}>Loading Kepler {keplerId} data...</span>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <BackButton onClick={goBack} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ArrowLeft size={20} />
            Back
          </BackButton>
        </Header>
        <ErrorContainer>
          <h2>Error Loading Data</h2>
          <p>{error}</p>
        </ErrorContainer>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container>
        <Header>
          <BackButton onClick={goBack} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ArrowLeft size={20} />
            Back
          </BackButton>
        </Header>
        <ErrorContainer>
          <h2>No Data Found</h2>
          <p>No data available for Kepler ID {keplerId}</p>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Header>
        <BackButton onClick={goBack} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ArrowLeft size={20} />
          Back
        </BackButton>
        <Title>Kepler {data?.Kepler_ID || data?.kepler_id || keplerId}</Title>
      </Header>

      <DataGrid>
        <PlanetVisualization data={data} />

        <DataCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <CardHeader>
            <Globe size={24} />
            <CardTitle>Planet Properties</CardTitle>
          </CardHeader>
          <DataRow>
            <DataLabel>Orbital Period</DataLabel>
            <DataValue>{formatValue(data["Orbital_Period_(days)"], 'days')}</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>Orbital Period Error</DataLabel>
            <DataValue>{formatValue(data["Orbital_Period_Error_(days)"], 'days')}</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>Planet Radius</DataLabel>
            <DataValue>{formatValue(data["Planet_Radius_(Earth_radii)"], 'Earth radii')}</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>Planet Radius Error</DataLabel>
            <DataValue>{formatValue(data["Planet_Radius_Error_(Earth_radii)"], 'Earth radii')}</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>Transit Orbital Period</DataLabel>
            <DataValue>{formatValue(data["Transit_Orbital_Period_(days)"], 'days')}</DataValue>
          </DataRow>
        </DataCard>

        <DataCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CardHeader>
            <Thermometer size={24} />
            <CardTitle>Temperature & Energy</CardTitle>
          </CardHeader>
          <DataRow>
            <DataLabel>Equilibrium Temperature</DataLabel>
            <DataValue>{formatValue(data["Equilibrium_Temperature_(K)"], 'K')}</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>Temperature Error</DataLabel>
            <DataValue>{formatValue(data["Equilibrium_Temperature_Error_(K)"], 'K')}</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>Planet Effective Temperature</DataLabel>
            <DataValue>{formatValue(data["Planet_Effective_Temperature_(K)"], 'K')}</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>Planet Temperature Error</DataLabel>
            <DataValue>{formatValue(data["Planet_Effective_Temperature_Error_(K)"], 'K')}</DataValue>
          </DataRow>
        </DataCard>

        <DataCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <CardHeader>
            <Zap size={24} />
            <CardTitle>Radiation & Flux</CardTitle>
          </CardHeader>
          <DataRow>
            <DataLabel>Insolation Flux</DataLabel>
            <DataValue>{formatValue(data["Insolation_Flux_(Earth_flux)"], 'Earth flux')}</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>Insolation Flux Error</DataLabel>
            <DataValue>{formatValue(data["Insolation_Flux_Error_(Earth_flux)"], 'Earth flux')}</DataValue>
          </DataRow>
        </DataCard>

        <DataCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <CardHeader>
            <Star size={24} />
            <CardTitle>Stellar Properties</CardTitle>
          </CardHeader>
          <DataRow>
            <DataLabel>Stellar Effective Temperature</DataLabel>
            <DataValue>{formatValue(data["Stellar_Effective_Temperature_(K)"], 'K')}</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>Stellar Temperature Error</DataLabel>
            <DataValue>{formatValue(data["Stellar_Effective_Temperature_Error_(K)"], 'K')}</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>Stellar Surface Gravity</DataLabel>
            <DataValue>{formatValue(data["Stellar_Surface_Gravity_(log10_cm/s²)"], 'log₁₀(cm/s²)')}</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>Surface Gravity Error</DataLabel>
            <DataValue>{formatValue(data["Stellar_Surface_Gravity_Error_(log10_cm/s²)"], 'log₁₀(cm/s²)')}</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>Stellar Radius</DataLabel>
            <DataValue>{formatValue(data["Stellar_Radius_(Solar_radii)"], 'Solar radii')}</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>Stellar Radius Error</DataLabel>
            <DataValue>{formatValue(data["Stellar_Radius_Error_(Solar_radii)"], 'Solar radii')}</DataValue>
          </DataRow>
        </DataCard>
      </DataGrid>
    </Container>
  );
};

export default KeplerDetails;