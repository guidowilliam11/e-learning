'use client'

import { signOut } from 'next-auth/react'

export default function Logout() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return handleLogout()
}
