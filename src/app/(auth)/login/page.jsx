import React from 'react'
import Login from './components/Login'
import { redirect } from 'next/navigation'
import { createClient } from '@/libs/supabase/server'

export const metadata = {
  title: 'Login',
  description: 'Login to your account',
}

export default async function Page() {
  const supabase = createClient()

  const { data } = await supabase.auth.getUser()

  if (data.user) {
    redirect('/')
  }
  return <Login />
}
