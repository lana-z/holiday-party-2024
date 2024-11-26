'use client'

import { useState, useEffect } from 'react'
import Header from './components/Header'
import Invitation from './components/Invitation'
import RsvpForm from './components/RsvpForm'
import Footer from './components/Footer'
import PartyBackground from './components/PartyBackground'
import PasswordEntry from './components/PasswordEntry'
import { Toaster } from 'react-hot-toast'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const auth = localStorage.getItem('authenticated') === 'true'
    setIsAuthenticated(auth)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PartyBackground />
        <div className="relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <main className="min-h-screen relative">
        <PartyBackground />
        <Toaster position="top-center" />
        <div className="relative z-10 w-full flex flex-col items-center">
          {!isAuthenticated ? (
            <div className="w-full max-w-md mx-auto mt-20">
              <h1 className="text-4xl font-great-vibes text-center text-[#fdf7d7] mb-8">
                Swanky Cocktail Party
              </h1>
              <PasswordEntry onSuccess={() => setIsAuthenticated(true)} />
            </div>
          ) : (
            <>
              <div className="w-full">
                <Header />
              </div>
              <div className="w-full">
                <Invitation />
                <RsvpForm />
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
