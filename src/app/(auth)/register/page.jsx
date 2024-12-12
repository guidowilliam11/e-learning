import Register from './components/Register'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export const metadata = {
  title: 'Register',
}

export default async function Page() {
  const session = await getServerSession(authOptions)

  session && redirect('/')

  return <Register />
}
