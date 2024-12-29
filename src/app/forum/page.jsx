import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Forum from './component/Forum'

export default async function Page() {
  const session = await getServerSession(authOptions)

  !session && redirect('/login')

  return <Forum user={session.user} />
}
