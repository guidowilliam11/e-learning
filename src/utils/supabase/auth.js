'use server'

import { createSupabaseServer } from '@/libs/supabase/server'

export async function registerWithEmailAndPassword(userData) {
  try {
    const supabase = await createSupabaseServer()

    if (!userData.email || !userData.password) {
      throw new Error('Email and password are required')
    }

    const result = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    })

    if (result?.error) {
      throw error
    }

    return result
  } catch (error) {
    console.error('Error sign up: ', error)
  }
}

export async function loginWithEmailAndPassword(userData) {
  try {
    const supabase = await createSupabaseServer()

    const result = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: userData.password,
    })

    return result
  } catch (error) {
    console.error('Error sign in: ', error)
  }
}
