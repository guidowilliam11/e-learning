import Messages from "@/models/MessageModel"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"
import { writeFile } from "fs/promises"
import Communities from "@/models/CommunityModel"
import Peers from "@/models/PeerModel"

export async function POST(req) {
  try {

    const formData = await req.formData()

    const text = formData.get('text')
    const file = formData.get('file')

    if (!text && !file) {
      return NextResponse.json({ error: 'TEXT_OR_FILE_IS_REQUIRED' })
    }

    const { user } = await getServerSession(authOptions)
    const conversationId = formData.get('conversationId')
    const conversationType = formData.get('conversationType')

    const newMessage = {
      conversationId,
      conversationType,
      text,
      sender: user.id,
      seenBy: [user.id]
    }

    if (file && file !== 'null') {
      const bufferBytes = await file.arrayBuffer()
      const buffer = Buffer.from(bufferBytes)

      const splittedFileName = file.name.split('.')
      const fileExtension = splittedFileName.pop()
      newMessage.fileName = `${splittedFileName.pop()}.${fileExtension}`
      const newFileName = `${crypto.randomUUID()}.${fileExtension}`

      const path = `/message/files/${newFileName}`
      const relativePath = `public${path}`
      await writeFile(relativePath, buffer)

      newMessage.file = path
    }

    const message = await Messages.create(newMessage)
    await message.populate('sender', 'fullName email picture')

    let result = {}
    switch (conversationType) {
      case 'peers':
        result = await Peers.findByIdAndUpdate(conversationId, {
          lastMessage: message._id
        }, {
          new: true
        }).populate('participants')
          .populate({
            path: 'lastMessage',
            populate: {
              path: 'sender',
              select: 'fullName email picture',
              model: 'students'
            }
          })
        break
      case 'communities':
        result = await Communities.findByIdAndUpdate(conversationId, {
          lastMessage: message._id
        }, {
          new: true
        }).populate({
          path: 'lastMessage',
          populate: {
            path: 'sender',
            select: 'fullName email picture',
            model: 'students'
          }
        })
        break
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error when validating messages: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 