import { getServerSession } from 'next-auth'
import Post from './component/Post'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function Page({ params }) {
  const session = await getServerSession(authOptions)
  const id = (await params).id

  !session && redirect('/login')

  return <Post id={id} user={session.user.id} />
}
