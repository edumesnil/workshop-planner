import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Workshop Layout
          <span className="text-primary-600"> Optimizer</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          One-click optimization tool that takes your workshop dimensions and tools, 
          then generates optimal layouts instantly using constraint satisfaction algorithms.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link
              to="/planner"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-colors"
            >
              Start Planning
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Features</h2>
          <p className="mt-4 text-lg text-gray-600">
            Completely free optimization powered by research-based algorithms
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-900">Instant Optimization</h3>
            <p className="mt-2 text-gray-600">
              Advanced constraint satisfaction algorithms generate optimal layouts in seconds
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-900">3D Visualization</h3>
            <p className="mt-2 text-gray-600">
              Interactive 3D preview powered by Three.js to visualize your optimized workshop
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-900">Completely Free</h3>
            <p className="mt-2 text-gray-600">
              No paid APIs or subscriptions. Pure algorithmic optimization based on woodworking research
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}