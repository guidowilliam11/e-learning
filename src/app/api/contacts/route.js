import { connectToDatabase } from "@/libs/mongo/config"
import Communities from "@/models/CommunityModel"
import Peers from "@/models/PeerModel"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)

    const { user } = session

    await connectToDatabase()

    let result = {}
    let peers = []
    let communities = []

    peers = await Peers.find({
      participants: {
        $in: user.id
      }
    }).populate('participants', 'fullName picture email')
      .populate({
        path: 'lastMessage',
        model: 'messages',
        populate: {
          path: 'sender',
          model: 'students',
          select: 'fullName email picture'
        }
      })
    communities = await Communities.find({
      participants: {
        $in: user.id
      }
    }).populate('participants', 'fullName')
      .populate({
        path: 'lastMessage',
        model: 'messages',
        populate: {
          path: 'sender',
          model: 'students',
          select: 'fullName email picture'
        }
      })

    result = {
      peers,
      communities
    }

    return NextResponse.json(result)

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}