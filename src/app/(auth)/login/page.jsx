import Login from './components/Login'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Login',
  description: 'Login to your account',
}

export default async function Page() {
  const session = await getServerSession(authOptions)

  session && redirect('/')

  return <Login />
}
