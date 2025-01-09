'use client'

import { useEffect } from 'react'
import { signOut } from 'next-auth/react'

export default function Logout() {
  useEffect(() => {
    const handleLogout = async () => {
      await signOut({ callbackUrl: '/login' })
      localStorage.removeItem('fullName')
    }

    handleLogout()
  }, [])

  return <p>Logging out...</p>
}
