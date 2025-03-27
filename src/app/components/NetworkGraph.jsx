import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  MeshDistortMaterial,
  MeshWobbleMaterial,
} from "@react-three/drei";
import "./NetworkGraph.css";

// Node component with glow effect using standard materials
const Node = ({ position, name, onNodeClick, highlighted = false }) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef();
  const [scale, setScale] = useState(1);

  // Handle hover effects
  const onPointerOver = () => {
    setHovered(true);
    setScale(1.2);
    document.body.classList.add("cursor-pointer");
  };

  const onPointerOut = () => {
    setHovered(false);
    setScale(1);
    document.body.classList.remove("cursor-pointer");
  };

  // Animate node
  useFrame(({ clock }) => {
    if (ref.current) {
      // Floating animation
      ref.current.position.y =
        position[1] + Math.sin(clock.elapsedTime * 0.7) * 0.05;

      // Smooth scale transition
      ref.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.2);
    }
  });

  return (
    <group>
      {/* Outer glow sphere */}
      <mesh position={position} scale={1.2}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial
          color={highlighted ? "#ff7b00" : "#4d9bff"}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Main node sphere */}
      <mesh
        ref={ref}
        position={position}
        onClick={() => onNodeClick(name)}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        {highlighted ? (
          <MeshDistortMaterial
            color="#ff7b00"
            emissive="#ff5500"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
            speed={3}
            distort={0.1}
          />
        ) : (
          <meshPhysicalMaterial
            color={hovered ? "#7fc1ff" : "#67c7eb"}
            emissive="#3498db"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.2}
          />
        )}
      </mesh>
      {/* Labels removed as requested */}
    </group>
  );
};

// Connection component with glow effect
const Connection = ({ start, end }) => {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);

  // Calculate connection geometry
  const direction = new THREE.Vector3().subVectors(endVec, startVec);
  const length = direction.length();
  direction.normalize();

  const center = new THREE.Vector3().addVectors(
    startVec,
    direction.clone().multiplyScalar(length / 2)
  );

  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
  const euler = new THREE.Euler().setFromQuaternion(quaternion);

  return (
    <group>
      {/* Glow layer */}
      <mesh position={center.toArray()} rotation={[euler.x, euler.y, euler.z]}>
        <cylinderGeometry args={[0.04, 0.04, length, 8]} />
        <meshBasicMaterial color="#4d9bff" transparent opacity={0.15} />
      </mesh>

      {/* Core line */}
      <mesh position={center.toArray()} rotation={[euler.x, euler.y, euler.z]}>
        <cylinderGeometry args={[0.015, 0.015, length, 6]} />
        <MeshWobbleMaterial
          color="#a0d8ff"
          emissive="#4d9bff"
          emissiveIntensity={0.3}
          factor={0.2}
          speed={0.5}
          roughness={0.3}
          metalness={0.7}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};

// Auto-rotation controller component
const AutoRotate = ({ speed = 0.1, enabled = true, zoomEnabled = true }) => {
  const controlsRef = useRef();
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const lastInteractionTime = useRef(0);
  const rotationTimeout = useRef(null);

  // Setup event listeners to detect user interaction
  useEffect(() => {
    const startInteraction = () => {
      setIsUserInteracting(true);
      lastInteractionTime.current = Date.now();

      // Clear existing timeout
      if (rotationTimeout.current) {
        clearTimeout(rotationTimeout.current);
      }
    };

    const endInteraction = () => {
      // Set a timeout to resume auto-rotation after 2 seconds of inactivity
      rotationTimeout.current = setTimeout(() => {
        setIsUserInteracting(false);
      }, 2000);
    };

    window.addEventListener("mousedown", startInteraction);
    window.addEventListener("mouseup", endInteraction);
    window.addEventListener("keydown", startInteraction);

    // Only add wheel listener if zoom is enabled
    if (zoomEnabled) {
      window.addEventListener("wheel", startInteraction);
    }

    return () => {
      window.removeEventListener("mousedown", startInteraction);
      window.removeEventListener("mouseup", endInteraction);
      window.removeEventListener("keydown", startInteraction);

      if (zoomEnabled) {
        window.removeEventListener("wheel", startInteraction);
      }

      if (rotationTimeout.current) {
        clearTimeout(rotationTimeout.current);
      }
    };
  }, [zoomEnabled]);

  // Apply the slow rotation
  useFrame(() => {
    if (controlsRef.current && enabled && !isUserInteracting) {
      // Rotate around the y-axis (adjust axis as needed)
      controlsRef.current.autoRotate = true;
      controlsRef.current.autoRotateSpeed = speed;
      controlsRef.current.update();
    } else if (controlsRef.current) {
      controlsRef.current.autoRotate = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false} // Zoom disabled as requested
      enablePan={false}
      enableRotate={true}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={(Math.PI * 3) / 4}
      // These settings will be overridden by the useFrame hook above
      autoRotate={false}
    />
  );
};

// Main network component
const NetworkGraph = () => {
  const [highlightedNode, setHighlightedNode] = useState(2); // Index of the highlighted node (initially Transformers)

  // Define nodes with names and positions
  const nodes = [
    { name: "NLP", position: [0, 0, 0] },
    { name: "Computer Vision", position: [3, 1, 2] },
    { name: "Transformers", position: [-2.2, -1, 3] },
    { name: "Deep Learning", position: [3.5, -2, -1.5] },
    { name: "Reinforcement Learning", position: [-3, 2.2, -2] },
    { name: "GANs", position: [1.5, 3, -3] },
    { name: "Neural Networks", position: [-1.5, -3, 1.5] },
    { name: "Machine Learning", position: [2.5, 0, -3.5] },
    { name: "Data Science", position: [-3.5, -2, 0] },
    { name: "Computer Graphics", position: [3, -3.5, 2] },
    { name: "Robotics", position: [-2.2, 3.5, -1.5] },
    { name: "Speech Recognition", position: [1.5, -1.5, 3.5] },
    { name: "Knowledge Graphs", position: [-3, 0, -3] },
  ];

  // Define connections between nodes (indices in the nodes array)
  const connections = [
    [0, 1],
    [0, 2],
    [0, 11], // NLP connections
    [1, 3],
    [1, 9], // Computer Vision connections
    [2, 6], // Transformers connection
    [3, 6],
    [3, 7], // Deep Learning connections
    [4, 10], // Reinforcement Learning connection
    [4, 12],
    [5, 9], // GANs connection
    [6, 7],
    [6, 8], // Neural Networks connections
    [7, 8],
    [7, 12], // Machine Learning connections
    [8, 12], // Data Science connection
    [10, 4], // Robotics connection
    [10, 0],
    [11, 2], // Speech Recognition connection
    [12, 0], // Knowledge Graphs connection
  ];

  const handleNodeClick = (nodeName, index) => {
    console.log(`Node clicked: ${nodeName}`);
    setHighlightedNode(index); // Update the highlighted node when clicked

    // Here you could add navigation logic
    // window.open('https://example.com/' + nodeName.toLowerCase().replace(' ', '-'), '_blank');
  };

  return (
    <div className="network-container">
      <Canvas
        camera={{ position: [0, 0, 16], fov: 40 }}
        className="network-canvas"
        gl={{ antialias: true }}
      >
        {/* Render all nodes */}
        {nodes.map((node, index) => (
          <Node
            key={index}
            position={node.position}
            name={node.name}
            onNodeClick={(name) => handleNodeClick(name, index)}
            highlighted={index === highlightedNode}
          />
        ))}

        {/* Render all connections */}
        {connections.map((connection, index) => (
          <Connection
            key={index}
            start={nodes[connection[0]].position}
            end={nodes[connection[1]].position}
          />
        ))}

        {/* Auto Rotation Controller - replace the standard OrbitControls */}
        <AutoRotate speed={0.5} enabled={true} zoomEnabled={false} />
      </Canvas>
    </div>
  );
};

export default NetworkGraph;
