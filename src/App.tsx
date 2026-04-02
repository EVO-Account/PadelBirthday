import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Welcome from './pages/Welcome'
import InviteDetails from './pages/InviteDetails'
import AcceptRsvp from './pages/AcceptRsvp'
import DeclineRsvp from './pages/DeclineRsvp'
import AcceptSuccess from './pages/AcceptSuccess'
import DeclineSuccess from './pages/DeclineSuccess'
import Tournament from './pages/Tournament'
import Admin from './pages/Admin'
import { TOURNAMENT } from './lib/constants'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/details" element={<InviteDetails />} />
          <Route path="/accept" element={<AcceptRsvp />} />
          <Route path="/decline" element={<DeclineRsvp />} />
          <Route path="/success/accept" element={<AcceptSuccess />} />
          <Route path="/success/decline" element={<DeclineSuccess />} />
          <Route path="/tournament" element={<Tournament />} />
          <Route path={`/admin/${TOURNAMENT.adminSecret}`} element={<Admin />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
