"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CuboidIcon as Cube, Link, Shield, Zap, Cog } from "lucide-react"

const features = [
  { name: "Traceability", icon: Cube, description: "End-to-end visibility of products" },
  { name: "Security", icon: Shield, description: "Immutable and encrypted data storage" },
  { name: "Efficiency", icon: Zap, description: "Streamlined processes and reduced costs" },
  { name: "Integration", icon: Link, description: "Seamless connection with existing systems" },
  { name: "Automation", icon: Cog, description: "AI-driven decision making and operations" },
]

export default function BlockchainInfographic() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 overflow-hidden">
      <div className="relative w-full max-w-4xl aspect-square">
        <motion.div
          animate={{ rotateY: 360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-full h-full"
          style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.name}
              feature={feature}
              index={index}
              isHovered={hoveredIndex === index}
              setHovered={() => setHoveredIndex(index)}
              setUnhovered={() => setHoveredIndex(null)}
            />
          ))}
          <CentralNode />
        </motion.div>
      </div>
    </div>
  )
}

function FeatureCard({ feature, index, isHovered, setHovered, setUnhovered }) {
  const Icon = feature.icon
  const angle = (index / features.length) * Math.PI * 2
  const radius = 150
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  const z = 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1, x, y, z }}
      transition={{ delay: index * 0.2 }}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px)`,
        transformStyle: "preserve-3d",
      }}
      onMouseEnter={setHovered}
      onMouseLeave={setUnhovered}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <motion.div
              animate={{ rotateY: isHovered ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Card
                className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-700 border-gray-600 shadow-lg hover:shadow-xl transition-shadow duration-300"
                style={{ transformStyle: "preserve-3d" }}
              >
                <CardContent
                  className="flex flex-col items-center justify-center h-full p-4"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <Icon className="w-10 h-10 mb-2 text-blue-400" />
                  <Badge variant="secondary" className="text-sm font-semibold">
                    {feature.name}
                  </Badge>
                </CardContent>
              </Card>
              <Card
                className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-700 border-gray-600 shadow-lg absolute inset-0"
                style={{ transform: "rotateY(180deg) translateZ(20px)" }}
              >
                <CardContent className="flex items-center justify-center h-full p-4">
                  <p className="text-xs text-center">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{feature.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <ConnectionLine isHovered={isHovered} />
    </motion.div>
  )
}

function ConnectionLine({ isHovered }) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 w-[1px] bg-blue-400"
      style={{
        height: "150px",
        transformOrigin: "top",
      }}
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    />
  )
}

function CentralNode() {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 w-8 h-8 rounded-full bg-blue-500"
      style={{
        transform: "translate(-50%, -50%)",
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  )
}

// Add this CSS to your global styles or a separate CSS module
const styles = `
  .preserve-3d {
    transform-style: preserve-3d;
  }
`

// Add this style tag to your component or include it in your global styles
const StyleTag = () => <style>{styles}</style>

// Wrap your component with the StyleTag
const WrappedBlockchainInfographic = () => (
  <>
    <StyleTag />
    <BlockchainInfographic />
  </>
)

export { WrappedBlockchainInfographic as BlockchainInfographic }

