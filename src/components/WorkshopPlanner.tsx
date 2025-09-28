export function WorkshopPlanner() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Workshop Layout Planner</h1>
        <p className="mt-2 text-gray-600">
          Configure your workshop dimensions and tools to generate an optimized layout
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Workshop Configuration</h2>
            
            {/* Workshop Dimensions */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Length (inches)
                </label>
                <input
                  type="number"
                  defaultValue={213}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (inches)
                </label>
                <input
                  type="number"
                  defaultValue={103}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (inches)
                </label>
                <input
                  type="number"
                  defaultValue={96}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Tools Selection */}
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">Available Tools</h3>
              <div className="space-y-2">
                {['Table Saw', 'Bandsaw', 'Planer', 'Jointer', 'Router Table', 'Drill Press', 'Workbench'].map((tool) => (
                  <label key={tool} className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{tool}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full mt-6 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors">
              Generate Layout
            </button>
          </div>
        </div>

        {/* Visualization Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border h-96 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-lg font-medium">3D Workshop Visualization</p>
              <p className="text-sm">Configure your workshop and click "Generate Layout" to see the optimized 3D layout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}