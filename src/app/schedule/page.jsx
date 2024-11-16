import { createClient } from '@/libs/supabase/server'
import Schedule from './components/Schedule'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  return <Schedule />
}
