import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';

const PlanetContainer = styled.div`
  width: 100%;
  height: 550px;
  position: relative;
  background: transparent;

  canvas {
    width: 100% !important;
    height: 100% !important;
  }

  @media (max-width: 768px) {
    height: 400px;
  }
`;

const PlanetViewer = () => {
  const mountRef = useRef(null);
  const planetRef = useRef(null);
  const animationRef = useRef(null);

  // Pluto configuration from threex.planets repository
  const plutoConfig = {
    map: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/plutomap1k.jpg',
    bumpMap: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/plutobump1k.jpg',
    size: 3.5,
    bumpScale: 0.02
  };

  const createPluto = () => {
    const geometry = new THREE.SphereGeometry(plutoConfig.size, 64, 64);
    const loader = new THREE.TextureLoader();

    const material = new THREE.MeshPhongMaterial({
      map: loader.load(plutoConfig.map),
      bumpMap: loader.load(plutoConfig.bumpMap),
      bumpScale: plutoConfig.bumpScale,
      color: 0xffffff
    });

    return new THREE.Mesh(geometry, material);
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create Pluto
    const pluto = createPluto();
    scene.add(pluto);
    planetRef.current = pluto;

    // Add starfield background
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Lighting optimized for Pluto
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Position camera
    camera.position.z = 6;

    // Mouse interaction variables
    let isDragging = false;
    let autoRotate = true;
    let previousMousePosition = { x: 0, y: 0 };
    const rotationSpeed = 0.005;
    const autoRotationSpeed = 0.008;

    // Mouse event handlers
    const onMouseDown = (event) => {
      isDragging = true;
      autoRotate = false;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    };

    const onMouseMove = (event) => {
      if (!isDragging) return;

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      if (planetRef.current) {
        planetRef.current.rotation.y += deltaMove.x * rotationSpeed;
        planetRef.current.rotation.x += deltaMove.y * rotationSpeed;
      }

      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    };

    const onMouseUp = () => {
      isDragging = false;
      setTimeout(() => {
        if (!isDragging) {
          autoRotate = true;
        }
      }, 2000);
    };

    const onMouseLeave = () => {
      isDragging = false;
      autoRotate = true;
    };

    // Touch event handlers for mobile
    const onTouchStart = (event) => {
      if (event.touches.length === 1) {
        isDragging = true;
        autoRotate = false;
        previousMousePosition = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        };
      }
    };

    const onTouchMove = (event) => {
      if (!isDragging || event.touches.length !== 1) return;
      event.preventDefault();

      const deltaMove = {
        x: event.touches[0].clientX - previousMousePosition.x,
        y: event.touches[0].clientY - previousMousePosition.y
      };

      if (planetRef.current) {
        planetRef.current.rotation.y += deltaMove.x * rotationSpeed;
        planetRef.current.rotation.x += deltaMove.y * rotationSpeed;
      }

      previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    };

    const onTouchEnd = () => {
      isDragging = false;
      setTimeout(() => {
        if (!isDragging) {
          autoRotate = true;
        }
      }, 2000);
    };

    // Add event listeners
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mouseleave', onMouseLeave);
    renderer.domElement.addEventListener('touchstart', onTouchStart);
    renderer.domElement.addEventListener('touchmove', onTouchMove);
    renderer.domElement.addEventListener('touchend', onTouchEnd);

    renderer.domElement.style.cursor = 'grab';

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      if (autoRotate && !isDragging && planetRef.current) {
        planetRef.current.rotation.x += autoRotationSpeed * 0.3;
        planetRef.current.rotation.y += autoRotationSpeed;
        planetRef.current.rotation.z += autoRotationSpeed * 0.2;
      }

      renderer.domElement.style.cursor = isDragging ? 'grabbing' : 'grab';

      renderer.render(scene, camera);
    };

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;

      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Start animation
    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);

      if (renderer.domElement) {
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('mouseup', onMouseUp);
        renderer.domElement.removeEventListener('mouseleave', onMouseLeave);
        renderer.domElement.removeEventListener('touchstart', onTouchStart);
        renderer.domElement.removeEventListener('touchmove', onTouchMove);
        renderer.domElement.removeEventListener('touchend', onTouchEnd);
      }

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <PlanetContainer ref={mountRef} />;
};

export default PlanetViewer;