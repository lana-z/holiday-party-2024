'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, RefreshCw, LogOut } from 'lucide-react'

export default function AdminDashboard({ adminToken, onLogout }) {
  const [rsvps, setRsvps] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedRsvp, setSelectedRsvp] = useState(null)

  const fetchRsvps = async () => {
    try {
      const response = await fetch('/api/admin/manage-rsvps', {
        headers: {
          'x-admin-token': adminToken
        }
      })
      
      if (!response.ok) throw new Error('Failed to fetch RSVPs')
      
      const data = await response.json()
      setRsvps(data)
    } catch (error) {
      toast.error('Failed to load RSVPs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRsvps()
  }, [adminToken])

  const handleDelete = async (guestId) => {
    if (!confirm('Are you sure you want to delete this RSVP?')) return

    try {
      const response = await fetch(`/api/admin/manage-rsvps?guestId=${guestId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-token': adminToken
        }
      })

      if (!response.ok) throw new Error('Failed to delete RSVP')

      toast.success('RSVP deleted successfully')
      fetchRsvps()
    } catch (error) {
      toast.error('Failed to delete RSVP')
    }
  }

  const handleReset = async () => {
    if (!confirm('Are you sure you want to delete ALL RSVPs? This cannot be undone!')) return

    try {
      const response = await fetch('/api/admin/manage-rsvps', {
        method: 'DELETE',
        headers: {
          'x-admin-token': adminToken
        }
      })

      if (!response.ok) throw new Error('Failed to reset RSVPs')

      toast.success('All RSVPs deleted successfully')
      fetchRsvps()
    } catch (error) {
      toast.error('Failed to reset RSVPs')
    }
  }

  if (loading) {
    return <div className="text-center mt-8 text-[#fdf7d7]">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-[#fdf7d7] font-playfair font-bold">RSVP Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={fetchRsvps}
            className="text-[#fdf7d7] hover:text-emerald transition-colors"
            title="Refresh RSVPs"
          >
            <RefreshCw size={24} />
          </button>
          <button
            onClick={handleReset}
            className="text-[#fdf7d7] hover:text-red-500 transition-colors"
            title="Reset All RSVPs"
          >
            <Trash2 size={24} />
          </button>
          <button
            onClick={onLogout}
            className="text-[#fdf7d7] hover:text-emerald transition-colors"
            title="Logout"
          >
            <LogOut size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(rsvps).map(([guestId, rsvp]) => (
          <motion.div
            key={guestId}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gray-800/50 rounded-lg p-4 relative group"
          >
            <button
              onClick={() => handleDelete(guestId)}
              className="absolute top-2 right-2 text-[#fdf7d7] opacity-0 group-hover:opacity-100 
                       hover:text-red-500 transition-all duration-200"
              title="Delete RSVP"
            >
              <Trash2 size={20} />
            </button>

            <h3 className="text-xl text-[#fdf7d7] font-playfair mb-2">
              {rsvp.name}
              {rsvp.hasPlusOne && rsvp.plusOneName && ` & ${rsvp.plusOneName}`}
            </h3>

            <div className="space-y-2 text-[#f1f1f1]">
              <p>Status: {rsvp.isAttending ? '✅ Attending' : '❌ Not Attending'}</p>
              {rsvp.dietaryRestrictions && (
                <p>Dietary: {rsvp.dietaryRestrictions}</p>
              )}
              {rsvp.note && (
                <p className="italic">"{rsvp.note}"</p>
              )}
              <p className="text-sm text-gray-400">
                Submitted: {new Date(rsvp.timestamp).toLocaleString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {Object.keys(rsvps).length === 0 && (
        <div className="text-center text-[#fdf7d7] mt-8">
          No RSVPs yet
        </div>
      )}
    </div>
  )
}
