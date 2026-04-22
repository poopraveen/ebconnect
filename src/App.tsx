import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ApplicationSummaryPage from './pages/ApplicationSummaryPage'
import ThankYouPage from './pages/ThankYouPage'
import EhdWelcomePage from './pages/EhdWelcomePage'
import EhdScreenPage from './pages/EhdScreenPage'
import EhdDeclarePage from './pages/EhdDeclarePage'
import EhdOtpPage from './pages/EhdOtpPage'
import EhdUserInfoPage from './pages/EhdUserInfoPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AS Review flow */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/review" element={<ApplicationSummaryPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />

        {/* EHD (Electronic Health Declaration) flow */}
        <Route path="/ehd" element={<EhdWelcomePage />} />
        <Route path="/ehd/userInfo" element={<EhdUserInfoPage />} />
        <Route path="/ehd/screen" element={<EhdScreenPage />} />
        <Route path="/ehd/questions" element={<EhdDeclarePage />} />
        <Route path="/ehd/otp" element={<EhdOtpPage />} />
      </Routes>
    </BrowserRouter>
  )
}
