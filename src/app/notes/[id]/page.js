import { getServerSession } from 'next-auth'
import Notes from './(notes)/page'
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export default async function page() {
    const session = await getServerSession(authOptions)

    !session && redirect('/login')

    return <Notes user={session.user}/>
}