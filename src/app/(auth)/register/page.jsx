import Register from './components/Register'
import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/libs/supabase/server'

export const metadata = {
  title: 'Register',
}

export default async function Page() {
  const supabase = createSupabaseServer()

  const { data, error } = await (await supabase).auth.getUser()

  console.log(data)

  if (data.user) {
    redirect('/')
  }
  return <Register />
}
