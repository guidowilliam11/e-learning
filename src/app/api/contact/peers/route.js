import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { connectToDatabase } from "@/libs/mongo/config"
import Peers from "@/models/PeerModel"
import { NextResponse } from "next/server"

export async function GET(req) {
  try {

    const url = new URL(req.url)

    const currUserId = url.searchParams.get('currUserId')

    await connectToDatabase()

    const chats = await Peers.find({
      participants: {
        $in: currUserId,
      }
    }).populate('participants', 'fullName picture')

    const result = []
    for (const chat of chats) {
      const peer = chat.participants.find(participant => !participant._id.equals(currUserId))
      result.push(peer.toObject())
    }
    return NextResponse.json(result)

  } catch (error) {
    console.error('Error when getting peers: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}