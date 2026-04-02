import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Welcome from './pages/Welcome'
import InviteDetails from './pages/InviteDetails'
import AcceptSuccess from './pages/AcceptSuccess'
import DeclineSuccess from './pages/DeclineSuccess'
import { TOURNAMENT } from './lib/constants'

const AcceptRsvp = lazy(() => import('./pages/AcceptRsvp'))
const DeclineRsvp = lazy(() => import('./pages/DeclineRsvp'))
const Tournament = lazy(() => import('./pages/Tournament'))
const Admin = lazy(() => import('./pages/Admin'))

function RouteFallback() {
  return <div className="min-h-svh bg-surface-primary" aria-hidden />
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<RouteFallback />}>
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
        </Suspense>
      </Layout>
    </BrowserRouter>
  )
}
