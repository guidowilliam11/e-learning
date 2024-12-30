import Messages from "@/models/MessageModel"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(req) {
  try {

    const { conversationId } = await req.json()

    const { user } = await getServerSession(authOptions)

    const messages = await Messages.updateMany({ conversationId }, {
      $addToSet: { seenBy: user.id }
    })

    const updatedMessages = await Messages.find({ conversationId }).populate('sender', 'fullName email picture')

    return NextResponse.json(updatedMessages)

  } catch (error) {
    console.error('Error when validating messages: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 