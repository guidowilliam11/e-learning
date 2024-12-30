import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { connectToDatabase } from "@/libs/mongo/config"
import Peers from "@/models/PeerModel"
import { NextResponse } from "next/server"
import Students from "@/models/StudentModel"

export async function GET(req) {
  try {

    const url = new URL(req.url)

    const email = url.searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'TARGET_STUDENT_ID_REQUIRED' }, { status: 400 })
    }

    const session = await getServerSession(authOptions)

    const { user } = session

    await connectToDatabase()

    const targetStudent = await Students.findOne({ email })

    let notPeers = false
    const peer = await Peers.findOne({
      participants: {
        $in: user.id
      }
    }).findOne({
      participants: {
        $in: targetStudent._id
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