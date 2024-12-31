import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { connectToDatabase } from "@/libs/mongo/config"
import Peers from "@/models/PeerModel"
import { NextResponse } from "next/server"

export async function GET(req) {
  try {

    const { user } = await getServerSession(authOptions)
    await connectToDatabase()

    const chats = await Peers.find({
      participants: {
        $in: user.id,
      }
    }).populate('participants', 'fullName picture email')

    const result = []
    for (const chat of chats) {
      const peer = chat.participants.find(participant => !participant._id.equals(user.id))
      result.push(peer.toObject())
    }
    return NextResponse.json(result)

  } catch (error) {
    console.error('Error when getting peers: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}