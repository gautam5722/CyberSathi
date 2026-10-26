
import { Navigate, Route, Routes } from 'react-router-dom'

import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import NotificationDetailsPage from './pages/NotificationDetailsPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ContactUs from './pages/ContactUs'
import ContactSettingsPage from './pages/ContactSettingsPage'


function App() {
  return (
    <Routes>
      {/* Public homepage */}
      <Route path="/" element={<HomePage />} />

      {/* Category-wise notifications */}
      <Route path="/category/:category" element={<CategoryPage />} />

      {/* Complete notification details */}
      <Route
        path="/notification/:id"
        element={<NotificationDetailsPage />}
      />

      {/* Admin pages */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      <Route path="/admin/contact-settings" element={<ContactSettingsPage />}
      />

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />

      {/* Contact Us  */}

      <Route path="/contact" element={<ContactUs />} />
    </Routes>
  )
}

export default App
