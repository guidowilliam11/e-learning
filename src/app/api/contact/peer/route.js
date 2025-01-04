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

    const targetStudent = await Students.findOne({ email }, 'fullName picture email preferences')
    if (!targetStudent) {
      return NextResponse.json({ error: 'PEER_NOT_FOUND' }, { status: 404 })
    }

    const session = await getServerSession(authOptions)

    const { user } = session
    await connectToDatabase()


    let alreadyPeers = false
    const peer = await Peers.findOne({
      participants: {
        $all: [user.id, targetStudent._id]
      }
    })

    if (peer) {
      alreadyPeers = true
    }

    return NextResponse.json({
      ...targetStudent.toObject(),
      alreadyPeers
    })

  } catch (error) {
    console.error('Error when getting peer data: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}