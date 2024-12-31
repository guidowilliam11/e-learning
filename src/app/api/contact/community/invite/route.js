import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Communities from "@/models/CommunityModel"
import Peers from "@/models/PeerModel"
import Students from "@/models/StudentModel"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    const url = new URL(req.url)

    const communityId = url.searchParams.get('communityId')

    const { user } = await getServerSession(authOptions)

    const community = await Communities.findById(communityId)
    const communityMembers = []
    community.participants.forEach(participant => {
      if (!participant.equals(user.id)) {
        communityMembers.push(participant)
      }
    })
    const peers = await Peers.find({
      participants: {
        $in: user.id,
        $nin: communityMembers
      }
    }).populate('participants', 'fullName picture email')

    const result = []
    peers.forEach(peer => {
      peer.participants.forEach(participant => {
        if (!participant._id.equals(user.id)) {
          result.push(participant)
        }
      })
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error when getting peers to invite: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { communityId, peerStudentId } = await req.json()

    const { user } = await getServerSession(authOptions)

    const community = await Communities.findById(communityId)
    const peers = await Students.findById(peerStudentId).select('fullName email picture')

    community.participants.push(peerStudentId)
    await community.save()

    return NextResponse.json(peers)

  } catch (error) {
    console.error('Error when getting peers to invite: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}