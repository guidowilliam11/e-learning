import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/libs/mongo/config"
import Peers from "@/models/PeerModel"
import Students from "@/models/StudentModel"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)

    const { user } = session

    await connectToDatabase()

    const url = new URL(req.url)
    const email = url.searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'EMAIL_REQUIRED' }, { status: 400 })
    }

    if (user.email === email) {
      return NextResponse.json({ error: 'YOURSELF' }, { status: 400 })
    }

    let alreadyPeers = false
    const searchedPeer = await Students.findOne({ email: email })
    if (!searchedPeer) {
      return NextResponse.json({ error: 'NOT_FOUND' }, { status: 400 })
    }

    const existingPeer = await Peers.findOne({
      participants: {
        $in: user.id
      }
    }).findOne({
      participants: {
        $in: searchedPeer._id
      }
    })

    if (existingPeer) {
      alreadyPeers = true
    }

    return NextResponse.json({
      ...searchedPeer.toObject(),
      alreadyPeers
    })

  } catch (error) {
    console.error('Error when searching for peer: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const targetPeer = await req.json()

    const session = await getServerSession(authOptions)

    const { user } = session

    await connectToDatabase()

    const peer = await Peers.create({
      participants: [
        user.id,
        targetPeer._id
      ],
      lastMessage: null
    })

    return NextResponse.json(peer.toObject())

  } catch (error) {
    console.error('Error when adding for peer: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}