import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ApplicationSummaryPage from './pages/ApplicationSummaryPage'
import ThankYouPage from './pages/ThankYouPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/review" element={<ApplicationSummaryPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
      </Routes>
    </BrowserRouter>
  )
}
