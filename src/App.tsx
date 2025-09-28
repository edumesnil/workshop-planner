import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './components/HomePage'
import { WorkshopPlanner } from './components/WorkshopPlanner'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/planner" element={<WorkshopPlanner />} />
      </Routes>
    </Layout>
  )
}

export default App