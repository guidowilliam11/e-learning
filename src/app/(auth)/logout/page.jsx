'use client'

import { useEffect } from 'react'
import { signOut } from 'next-auth/react'

export default function Logout() {
  useEffect(() => {
    localStorage.removeItem('userDetails')
    const handleLogout = async () => {
      await signOut({ callbackUrl: '/login' })
    }

    handleLogout()
  }, [])

  return <p>Logging out...</p>
}
