import { connectToDatabase } from "@/libs/mongo/config"
import Communities from "@/models/CommunityModel"
import Peers from "@/models/PeerModel"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req) {
  try {
    const url = new URL(req.url)
    const contactType = url.searchParams.get('contactType')

    if (!contactType) {
      return NextResponse.json(
        { error: 'contactType is required' },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)

    const { user } = session

    await connectToDatabase()

    let result = []

    switch (contactType) {
      case 'peer':
        result = await Peers.find({
          participants: {
            $in: user.id
          }
        }).populate('participants', 'fullName picture email')
        break
      case 'community':
        result = await Communities.find({
          participants: {
            $in: user.id
          }
        }).populate('lastMessage')
        break
    }

    if (result.lastMessage) {
      result.populate('lastMessage')
    }

    return NextResponse.json(result)

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}