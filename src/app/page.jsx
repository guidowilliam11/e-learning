import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import Home from './(home)/components/Home'
import { redirect } from 'next/navigation'

export default async function page() {
  const session = await getServerSession(authOptions)

  !session && redirect('/login')

  return <Home user={session.user} />
}
