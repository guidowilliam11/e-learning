import Communities from "@/models/CommunityModel"
import Peers from "@/models/PeerModel"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route"
import { pusherConfigs } from "@/configs/pusherConfigs"
import { pusherServer } from "@/libs/pusher/pusherServer"

const { channelName, event } = pusherConfigs

export async function POST(req) {
  try {
    const { roomType, conversationId } = await req.json()

    if (!roomType || !conversationId) {
      return NextResponse.json({ error: 'MISSING_PARAMTERS' }, { status: 400 })
    }

    let result = {}

    switch (roomType) {
      case 'peer':
        result = await Peers.findById(conversationId).populate('participants', 'fullName picture').populate({
          path: 'lastMessage',
          populate: {
            path: 'sender',
            select: 'fullName',
            model: 'students'
          }
        })
        break
      case 'community':
        result = await Communities.findById(conversationId).populate('participants', 'fullName picture').populate({
          path: 'lastMessage',
          populate: {
            path: 'sender',
            select: 'fullName',
            model: 'students'
          }
        })
        break
    }

    const { user } = await getServerSession(authOptions)
    const userOnCall = result.onCall.indexOf(user.id)
    if (userOnCall > -1) {
      result.onCall.splice(userOnCall, 1)
    } else {
      result.onCall.push(user.id)
    }

    await result.save()
    const returnedResult = {
      ...result.toObject(),
      isCall: true,
      type: roomType
    }

    pusherServer.trigger(channelName.contact, event.contactUpdate, returnedResult)

    return NextResponse.json(returnedResult)

  } catch (error) {
    console.error('Error when getting room data: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}