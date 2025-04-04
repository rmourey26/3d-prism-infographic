import PrismContainer from "@/components/prism-container"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      <div className="container px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-6">Blockchain & AI for Logistics</h1>
        <p className="text-gray-300 text-center max-w-2xl mx-auto mb-8">
          Explore our platform's key features through this interactive 3D visualization. Click on any numbered face to
          learn more.
        </p>
      </div>

      <PrismContainer />
    </main>
  )
}

