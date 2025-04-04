"use client"

import React, { useState, useRef, useEffect, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  Text,
  PerspectiveCamera,
  OrbitControls,
  Environment,
  MeshTransmissionMaterial,
  Float,
  Sparkles,
  Trail,
} from "@react-three/drei"
import * as THREE from "three"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CuboidIcon, Shield, Zap, Link, Cog, Database } from "lucide-react"

// Add this after the imports
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("3D rendering error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-center p-6 max-w-md">
            <h2 className="text-xl font-bold text-red-400 mb-4">Something went wrong</h2>
            <p className="text-gray-300 mb-4">
              We couldn't load the 3D visualization. This might be due to browser compatibility issues.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Define our features
const features = [
  {
    name: "Traceability",
    icon: CuboidIcon,
    description:
      "End-to-end visibility of products throughout the supply chain, ensuring authenticity and origin verification.",
    color: "#3b82f6",
    icon3D: "Cube",
  },
  {
    name: "Security",
    icon: Shield,
    description:
      "Immutable and encrypted data storage protecting sensitive information across the entire logistics network.",
    color: "#10b981",
    icon3D: "Shield",
  },
  {
    name: "Efficiency",
    icon: Zap,
    description:
      "Streamlined processes and reduced costs through optimized routing and real-time inventory management.",
    color: "#f59e0b",
    icon3D: "Lightning",
  },
  {
    name: "Integration",
    icon: Link,
    description:
      "Seamless connection with existing systems including ERP, WMS, and other supply chain management tools.",
    color: "#8b5cf6",
    icon3D: "Chain",
  },
  {
    name: "Automation",
    icon: Cog,
    description: "AI-driven decision making and operations that reduce human error and increase operational speed.",
    color: "#ec4899",
    icon3D: "Gear",
  },
  {
    name: "Data",
    icon: Database,
    description: "Comprehensive analytics and insights derived from blockchain-secured supply chain data.",
    color: "#06b6d4",
    icon3D: "Database",
  },
]

// Golden ratio constant
const PHI = 1.618033988749895

// Create a hexagon shape
function createHexagonShape(radius = 1) {
  const shape = new THREE.Shape()
  const sides = 6

  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    if (i === 0) {
      shape.moveTo(x, y)
    } else {
      shape.lineTo(x, y)
    }
  }

  shape.closePath()
  return shape
}

// 3D Icon Components
const Icon3D = ({ type, color, scale = 0.3, position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  // Create different 3D geometries based on icon type
  const renderIcon = () => {
    switch (type) {
      case "Cube":
        return (
          <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
          </mesh>
        )
      case "Shield":
        return (
          <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
            <mesh>
              <cylinderGeometry args={[0.8, 1, 1.5, 6, 1, false]} />
              <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.2, 0.1]}>
              <boxGeometry args={[0.4, 0.6, 0.1]} />
              <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.5} />
            </mesh>
          </group>
        )
      case "Lightning":
        return (
          <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
            <mesh>
              <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[0.3, -0.4, 0]} rotation={[0, 0, Math.PI / 4]}>
              <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[-0.3, -0.4, 0]} rotation={[0, 0, -Math.PI / 4]}>
              <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
            </mesh>
          </group>
        )
      case "Chain":
        return (
          <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
            <mesh position={[-0.6, 0, 0]}>
              <torusGeometry args={[0.3, 0.1, 16, 32]} />
              <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0.6, 0, 0]}>
              <torusGeometry args={[0.3, 0.1, 16, 32]} />
              <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.1, 0.1, 1.2, 8]} rotation={[0, 0, Math.PI / 2]} />
              <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        )
      case "Gear":
        return (
          <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
            <mesh>
              <cylinderGeometry args={[0.8, 0.8, 0.2, 16]} />
              <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
            </mesh>
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2
              const x = Math.cos(angle) * 0.8
              const y = Math.sin(angle) * 0.8
              return (
                <mesh key={i} position={[x, y, 0]}>
                  <boxGeometry args={[0.2, 0.2, 0.2]} />
                  <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
                </mesh>
              )
            })}
          </group>
        )
      case "Database":
        return (
          <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 0.3, 16]} />
              <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.5, 0.5, 0.3, 16]} />
              <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.4, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 0.3, 16]} />
              <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.1, 0.1, 1.2, 8]} />
              <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.5} />
            </mesh>
          </group>
        )
      default:
        return (
          <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
          </mesh>
        )
    }
  }

  return renderIcon()
}

// Cosmic Trail Effect
function CosmicTrail({ target, active, color }) {
  const trailRef = useRef()
  const trailMaterialRef = useRef()

  useFrame(() => {
    if (trailMaterialRef.current) {
      trailMaterialRef.current.opacity = active ? 0.8 : THREE.MathUtils.lerp(trailMaterialRef.current.opacity, 0, 0.05)
    }
  })

  return (
    <Trail ref={trailRef} width={1.5} length={8} color={color} attenuation={(t) => t * t} target={target}>
      <meshBasicMaterial ref={trailMaterialRef} transparent opacity={0} />
    </Trail>
  )
}

// Northern Lights Effect
function NorthernLights({ active, intensity = 1 }) {
  const count = 100
  const pointsRef = useRef()
  const materialRef = useRef()

  // Create points for northern lights effect
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 20
      positions[i3 + 1] = (Math.random() - 0.5) * 10
      positions[i3 + 2] = (Math.random() - 0.5) * 20

      // Create gradient colors (green to purple to blue)
      const t = Math.random()
      if (t < 0.33) {
        colors[i3] = 0.1
        colors[i3 + 1] = 0.8
        colors[i3 + 2] = 0.3
      } else if (t < 0.66) {
        colors[i3] = 0.5
        colors[i3 + 1] = 0.2
        colors[i3 + 2] = 0.8
      } else {
        colors[i3] = 0.2
        colors[i3 + 1] = 0.5
        colors[i3 + 2] = 0.9
      }
    }

    return [positions, colors]
  }, [count])

  // Animate the northern lights
  useFrame(({ clock }) => {
    if (pointsRef.current && materialRef.current) {
      const time = clock.getElapsedTime() * 0.2

      const positions = pointsRef.current.geometry.attributes.position.array

      for (let i = 0; i < count; i++) {
        const i3 = i * 3

        // Create wave-like motion
        positions[i3 + 1] =
          Math.sin(time + positions[i3] * 0.1) * 2 + Math.sin(time * 0.8 + positions[i3 + 2] * 0.1) * 2
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true

      // Adjust opacity based on active state
      materialRef.current.opacity = active
        ? THREE.MathUtils.lerp(materialRef.current.opacity, 0.8 * intensity, 0.05)
        : THREE.MathUtils.lerp(materialRef.current.opacity, 0, 0.05)
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.5}
        transparent
        opacity={0}
        vertexColors
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

// Hexagonal face component with golden ratio proportions
function HexagonalFace({ index, position, rotation, feature, onClick, hovered }) {
  const IconComponent = feature.icon
  const hexRadius = 1 // Base radius
  const innerRadius = hexRadius / PHI // Golden ratio for inner elements

  // Create hexagon geometry
  const hexShape = useMemo(() => createHexagonShape(hexRadius), [hexRadius])
  const geometry = useMemo(() => new THREE.ShapeGeometry(hexShape), [hexShape])

  // Refs for animations
  const groupRef = useRef()
  const glowRef = useRef()

  // Hover animation
  useFrame(() => {
    if (groupRef.current) {
      if (hovered) {
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0.2, 0.1)
      } else {
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0, 0.1)
      }
    }

    if (glowRef.current) {
      glowRef.current.material.opacity = hovered
        ? THREE.MathUtils.lerp(glowRef.current.material.opacity, 0.8, 0.1)
        : THREE.MathUtils.lerp(glowRef.current.material.opacity, 0.3, 0.1)
    }
  })

  return (
    <group position={position} rotation={rotation}>
      <group
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation()
          onClick(feature)
        }}
        onPointerOver={(e) => {
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = "auto"
        }}
      >
        {/* Base hexagon */}
        <mesh geometry={geometry} receiveShadow castShadow>
          <meshPhysicalMaterial
            color="#1e293b"
            metalness={0.5}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.2}
            envMapIntensity={1}
          />
        </mesh>

        {/* Glow effect */}
        <mesh ref={glowRef} geometry={geometry} position={[0, 0, -0.05]} scale={1.05}>
          <meshBasicMaterial color={feature.color} transparent={true} opacity={0.3} side={THREE.BackSide} />
        </mesh>

        {/* Feature name */}
        <Text
          position={[0, hexRadius * 0.5, 0.01]}
          fontSize={hexRadius * 0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          font={undefined}
          maxWidth={hexRadius * 1.5}
          textAlign="center"
        >
          {feature.name}
        </Text>

        {/* 3D Feature Icon */}
        <group position={[0, -hexRadius * 0.2, 0.1]}>
          <Icon3D type={feature.icon3D} color={feature.color} scale={0.3} />
        </group>
      </group>
    </group>
  )
}

// Connection line component
function ConnectionLine({ start, end, color, visible }) {
  const ref = useRef()

  useEffect(() => {
    if (ref.current) {
      const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]

      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
      ref.current.geometry = lineGeometry
    }
  }, [start, end])

  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color={color} transparent opacity={visible ? 1 : 0} linewidth={2} />
    </line>
  )
}

// Particles effect component
function ParticlesEffect() {
  return <Sparkles count={100} scale={10} size={0.5} speed={0.3} opacity={0.5} color={"#ffffff"} />
}

// Create a component for the hexagonal prism
function HexagonalPrism({ setSelectedFeature }) {
  const groupRef = useRef()
  const [rotationAxis, setRotationAxis] = useState({ x: 0, y: 1, z: 0 })
  const [rotationSpeed, setRotationSpeed] = useState(0.005)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [centerPoint] = useState([0, 0, 0])
  const [isDragging, setIsDragging] = useState(false)
  const [dragIntensity, setDragIntensity] = useState(0)
  const { camera } = useThree()

  // Change rotation randomly
  const changeRotation = () => {
    // Generate random rotation axis
    const newAxis = {
      x: Math.random() * 0.2,
      y: Math.random() * 0.8 + 0.2, // Keep y as primary rotation axis
      z: Math.random() * 0.2,
    }

    // Normalize the vector
    const length = Math.sqrt(newAxis.x ** 2 + newAxis.y ** 2 + newAxis.z ** 2)
    newAxis.x /= length
    newAxis.y /= length
    newAxis.z /= length

    // Set new rotation speed (between 0.003 and 0.008)
    const newSpeed = 0.003 + Math.random() * 0.005

    setRotationAxis(newAxis)
    setRotationSpeed(newSpeed)
  }

  // Initial random rotation
  useEffect(() => {
    changeRotation()

    // Setup drag detection
    const handleDragStart = () => setIsDragging(true)
    const handleDragEnd = () => {
      setIsDragging(false)
      setDragIntensity(0)
    }

    window.addEventListener("mousedown", handleDragStart)
    window.addEventListener("touchstart", handleDragStart)
    window.addEventListener("mouseup", handleDragEnd)
    window.addEventListener("touchend", handleDragEnd)

    return () => {
      window.removeEventListener("mousedown", handleDragStart)
      window.removeEventListener("touchstart", handleDragStart)
      window.removeEventListener("mouseup", handleDragEnd)
      window.removeEventListener("touchend", handleDragEnd)
    }
  }, [])

  // Previous rotation for calculating velocity
  const prevRotation = useRef({ x: 0, y: 0, z: 0 })

  // Animation loop
  useFrame(() => {
    if (groupRef.current) {
      // Auto rotation when not dragging
      if (!isDragging) {
        groupRef.current.rotation.x += rotationAxis.x * rotationSpeed
        groupRef.current.rotation.y += rotationAxis.y * rotationSpeed
        groupRef.current.rotation.z += rotationAxis.z * rotationSpeed
      }

      // Calculate rotation velocity for trail intensity
      const rotVelocity = {
        x: Math.abs(groupRef.current.rotation.x - prevRotation.current.x),
        y: Math.abs(groupRef.current.rotation.y - prevRotation.current.y),
        z: Math.abs(groupRef.current.rotation.z - prevRotation.current.z),
      }

      const totalVelocity = rotVelocity.x + rotVelocity.y + rotVelocity.z
      setDragIntensity(isDragging ? Math.min(totalVelocity * 100, 1) : 0)

      // Store current rotation for next frame
      prevRotation.current = {
        x: groupRef.current.rotation.x,
        y: groupRef.current.rotation.y,
        z: groupRef.current.rotation.z,
      }
    }
  })

  // Calculate positions for each face using golden ratio
  const getFacePositions = () => {
    const positions = []
    const radius = PHI // Use golden ratio for radius
    const height = radius / PHI // Height based on golden ratio

    // Side faces
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      const x = Math.sin(angle) * radius
      const z = Math.cos(angle) * radius

      positions.push({
        position: [x, 0, z],
        rotation: [0, -angle + Math.PI, 0],
        connectionStart: [x * 0.2, 0, z * 0.2], // Start point near the face
        connectionEnd: centerPoint, // End at center
      })
    }

    return positions
  }

  const facePositions = getFacePositions()

  return (
    <Float
      speed={2} // Animation speed
      rotationIntensity={0.2} // XYZ rotation intensity
      floatIntensity={0.2} // Up/down float intensity
    >
      <group ref={groupRef} onClick={() => changeRotation()} onPointerMissed={() => changeRotation()}>
        {/* Central node */}
        <mesh position={centerPoint} castShadow>
          <dodecahedronGeometry args={[0.4, 0]} />
          <MeshTransmissionMaterial
            backside={true}
            samples={10}
            thickness={0.2}
            chromaticAberration={0.05}
            anisotropy={0.1}
            distortion={0.5}
            distortionScale={0.3}
            temporalDistortion={0.1}
            iridescence={1}
            iridescenceIOR={1}
            iridescenceThicknessRange={[0, 1400]}
          />
        </mesh>

        {/* Cosmic trails for central node */}
        <CosmicTrail target={groupRef} active={isDragging && dragIntensity > 0.1} color="#4ade80" />

        {/* Northern Lights Effect */}
        <NorthernLights active={isDragging} intensity={dragIntensity} />

        {/* Connection lines */}
        {facePositions.map((face, index) => (
          <ConnectionLine
            key={`connection-${index}`}
            start={face.connectionStart}
            end={face.connectionEnd}
            color={features[index].color}
            visible={hoveredIndex === index}
          />
        ))}

        {/* Feature faces */}
        {features.map((feature, index) => (
          <HexagonalFace
            key={index}
            index={index}
            position={facePositions[index].position}
            rotation={facePositions[index].rotation}
            feature={feature}
            onClick={setSelectedFeature}
            hovered={hoveredIndex === index}
            onHover={() => setHoveredIndex(index)}
            onUnhover={() => setHoveredIndex(null)}
          />
        ))}

        {/* Particle effects */}
        <ParticlesEffect />
      </group>
    </Float>
  )
}

// Main component
export default function FeaturePrism() {
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [cameraPosition, setCameraPosition] = useState([0, 0, 8])

  // Responsive camera position
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768
      setCameraPosition([0, 0, isMobile ? 10 : 8])
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <ErrorBoundary>
      <div className="w-full h-full relative">
        <Canvas shadows dpr={[1, 2]}>
          <color attach="background" args={["#030712"]} />
          <fog attach="fog" args={["#030712", 5, 20]} />

          <PerspectiveCamera makeDefault position={cameraPosition} fov={45} />

          {/* Lighting setup */}
          <ambientLight intensity={0.2} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={0.5} />

          {/* Environment for reflections */}
          <Environment preset="night" />

          {/* Main 3D content */}
          <HexagonalPrism setSelectedFeature={setSelectedFeature} />

          {/* Controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            autoRotate={false}
            dampingFactor={0.05}
            enableDamping={true}
          />
        </Canvas>

        {/* Feature Modal */}
        <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
          <DialogContent className="sm:max-w-md bg-gray-900 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                {selectedFeature && (
                  <>
                    {React.createElement(selectedFeature.icon, {
                      className: "h-6 w-6",
                      style: { color: selectedFeature.color },
                    })}
                    <span style={{ color: selectedFeature.color }}>{selectedFeature.name}</span>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <p className="text-gray-200 text-lg leading-relaxed">{selectedFeature?.description}</p>
            </div>

            <DialogFooter>
              <Button
                onClick={() => setSelectedFeature(null)}
                style={{
                  backgroundColor: selectedFeature?.color,
                  borderColor: selectedFeature?.color,
                }}
                className="hover:opacity-90"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Instructions overlay */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-md text-center">
          <p className="text-sm md:text-base">
            Click on any hexagon to learn more about each feature.
            <br className="hidden md:block" />
            Click and drag to rotate and create cosmic trails.
          </p>
        </div>
      </div>
    </ErrorBoundary>
  )
}

