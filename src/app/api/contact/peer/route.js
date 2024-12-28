import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { connectToDatabase } from "@/libs/mongo/config"
import Peers from "@/models/PeerModel"
import { NextResponse } from "next/server"

export async function GET(req) {
  try {

    const url = new URL(req.url)

    const targetStudentId = url.searchParams.get('targetStudentId')

    if (!targetStudentId) {
      return NextResponse.json({ error: 'TARGET_STUDENT_ID_REQUIRED' }, { status: 400 })
    }

    const session = await getServerSession(authOptions)

    const { user } = session

    await connectToDatabase()

    let notPeers = false
    const peer = await Peers.findOne({
      participants: {
        $in: user.id
      }
    }).findOne({
      participants: {
        $in: targetStudentId
      }
    }).populate('participants', 'fullName picture email')

    if (!peer) {
      notPeers = true
    }

    // Get target student
    const result = peer.participants.find(participant => !participant._id.equals(user.id))

    return NextResponse.json({
      ...result.toObject(),
      notPeers
    })

  } catch (error) {
    console.error('Error when getting peer data: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}