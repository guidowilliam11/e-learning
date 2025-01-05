import { getServerSession } from 'next-auth'
import Sessions from './(session)/Session'
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export default async function page({params}) {
    const session = await getServerSession(authOptions)

    !session && redirect('/login')

    const { id } = params;

    return <Sessions user={session.user} courseId={id}/>
}
