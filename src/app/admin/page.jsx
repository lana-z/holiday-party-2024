'use client'

import { useState, useEffect } from 'react'
import AdminLogin from '../components/AdminLogin'
import AdminDashboard from '../components/AdminDashboard'
import { Toaster } from 'react-hot-toast'

export default function AdminPage() {
  const [adminToken, setAdminToken] = useState(null)

  useEffect(() => {
    // Check for existing admin token in session storage
    const token = sessionStorage.getItem('adminToken')
    if (token) {
      setAdminToken(token)
    }
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken')
    setAdminToken(null)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Toaster position="top-right" />
      {!adminToken ? (
        <AdminLogin onLogin={setAdminToken} />
      ) : (
        <AdminDashboard adminToken={adminToken} onLogout={handleLogout} />
      )}
    </div>
  )
}
