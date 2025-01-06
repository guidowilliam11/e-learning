import { getServerSession } from 'next-auth'
import Courses from './Courses'
import { redirect } from 'next/navigation'
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export default async function page() {
  const session = await getServerSession(authOptions)

  !session && redirect('/login')

  return <Courses user={session.user}/>
}
