import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/libs/mongo/config"
import Peers from "@/models/PeerModel"
import Students from "@/models/StudentModel"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    const url = new URL(req.url)
    const email = url.searchParams.get('email')
    if (!email) {
      return NextResponse.json({ error: 'EMAIL_REQUIRED' }, { status: 400 })
    }

    const session = await getServerSession(authOptions)

    const { user } = session

    await connectToDatabase()

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
        $all: [user.id, searchedPeer._id]
      }
    })

    if (existingPeer) {
      alreadyPeers = true
    }

    if (!alreadyPeers && !searchedPeer.preferences.allowPeerInvite) {
      return NextResponse.json({ error: 'INVITE_NOT_ALLOWED' }, { status: 401 })
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

    const validateTargetPeer = await Students.findById(targetPeer._id, 'fullName email picture preferences')
    if (!validateTargetPeer.preferences.allowPeerInvite) {
      return NextResponse.json({ error: 'INVITE_NOT_ALLOWED' }, { status: 401 })
    }

    await Peers.create({
      participants: [
        user.id,
        validateTargetPeer._id
      ],
      lastMessage: null
    })

    return NextResponse.json({
      ...validateTargetPeer.toObject(),
      alreadyPeers: true
    })

  } catch (error) {
    console.error('Error when adding for peer: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}