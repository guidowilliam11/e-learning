'use server'

import { createSupabaseServer } from '@/libs/supabase/server'
import { redirect } from 'next/navigation'

const Logout = async () => {
  const supabase = await createSupabaseServer()

  await supabase.auth.signOut()

  return redirect('/login')
}

export default Logout
