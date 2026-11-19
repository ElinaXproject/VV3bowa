import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import AddApp from './pages/AddApp'
import AppDetails from './pages/AppDetails'
import Folders from './pages/Folders'
import Export from './pages/Export'
import Settings from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddApp />} />
          <Route path="/app/:id" element={<AppDetails />} />
          <Route path="/folders" element={<Folders />} />
          <Route path="/export" element={<Export />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
