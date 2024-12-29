import { getServerSession } from 'next-auth'
import Schedule from './components/Schedule'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function Page() {
  const session = await getServerSession(authOptions)

  !session && redirect('/login')

  return <Schedule user={session.user} />
}
