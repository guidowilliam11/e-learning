import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Notes from "./Notes";
import {redirect} from "next/navigation";

export default async function Home() {
    const session = await getServerSession(authOptions);

    !session && redirect('/login')

    return <Notes user={session.user}/>
}
