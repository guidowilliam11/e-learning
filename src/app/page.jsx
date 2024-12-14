import { createSupabaseServer } from '@/libs/supabase/server'
import Home from './(home)/components/Home'
import { redirect } from 'next/navigation'

export default async function page() {
  const supabase = createSupabaseServer()

  const { data, error } = await (await supabase).auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  return <Home />
}
