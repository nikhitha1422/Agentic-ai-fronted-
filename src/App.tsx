import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Agents } from './pages/Agents'
import { ContactUs } from './pages/ContactUs'
import { SignUp } from './pages/SignUp'
import { Login } from './pages/Login'
import { Terms } from './pages/Terms'
import { Privacy } from './pages/Privacy'
// Dashboard Pages
import { DashboardHome } from './pages/dashboard/DashboardHome'
import { MeetingsList } from './pages/dashboard/MeetingsList'
import { MeetingDetails } from './pages/dashboard/MeetingDetails'
import { CreateMeeting } from './pages/dashboard/CreateMeeting'
import { AIJoiningStatus } from './pages/dashboard/AIJoiningStatus'
import { AIJoinedLive } from './pages/dashboard/AIJoinedLive'
import { LiveNotes } from './pages/dashboard/LiveNotes'
import { SummaryReady } from './pages/dashboard/SummaryReady'
import { SmartSummary } from './pages/dashboard/SmartSummary'
import { MeetingRoom } from './pages/MeetingRoom'
import { MeetingLobby } from './pages/MeetingLobby'
import { Tasks } from './pages/dashboard/Tasks'
import { Notifications } from './pages/dashboard/Notifications'
import { Calendar } from './pages/dashboard/Calendar'
import { Settings } from './pages/dashboard/Settings'
import { Profile } from './pages/dashboard/Profile'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Marketing Site Routes */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-white flex flex-col">
              <Navigation />
              <Home />
              <Footer />
            </div>
          }
        />
        <Route
          path="/about"
          element={
            <div className="min-h-screen bg-white flex flex-col">
              <Navigation />
              <About />
              <Footer />
            </div>
          }
        />
        <Route
          path="/agents"
          element={
            <div className="min-h-screen bg-white flex flex-col">
              <Navigation />
              <Agents />
              <Footer />
            </div>
          }
        />
        <Route
          path="/contact"
          element={
            <div className="min-h-screen bg-white flex flex-col">
              <Navigation />
              <ContactUs />
              <Footer />
            </div>
          }
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/terms"
          element={
            <div className="min-h-screen bg-white flex flex-col">
              <Navigation />
              <Terms />
              <Footer />
            </div>
          }
        />
        <Route
          path="/privacy"
          element={
            <div className="min-h-screen bg-white flex flex-col">
              <Navigation />
              <Privacy />
              <Footer />
            </div>
          }
        />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/meetings" element={<MeetingsList />} />
        <Route path="/dashboard/meetings/new" element={<CreateMeeting />} />
        <Route path="/dashboard/meetings/:meetingId" element={<MeetingDetails />} />
        <Route
          path="/dashboard/meetings/:meetingId/ai-joining"
          element={<AIJoiningStatus />}
        />
        <Route
          path="/dashboard/meetings/:meetingId/ai-live"
          element={<AIJoinedLive />}
        />
        <Route
          path="/dashboard/meetings/:meetingId/live-notes"
          element={<LiveNotes />}
        />
        <Route
          path="/dashboard/meetings/:meetingId/summary-ready"
          element={<SummaryReady />}
        />
        <Route
          path="/dashboard/meetings/:meetingId/summary"
          element={<SmartSummary />}
        />
        <Route path="/dashboard/tasks" element={<Tasks />} />
        <Route path="/dashboard/notifications" element={<Notifications />} />
        <Route path="/dashboard/calendar" element={<Calendar />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/dashboard/profile" element={<Profile />} />

        {/* Dashboard Catch-all */}
        <Route path="/dashboard/*" element={<DashboardHome />} />

        {/* Redirect unknown routes */}
        <Route path="/meet/:meetingId" element={<MeetingLobby />} />
        <Route path="/meeting/live/:meetingId" element={<MeetingRoom />} />
        <Route path="*" element={<div className="p-10 text-center">404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}