import Messages from "@/models/MessageModel"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"
import Communities from "@/models/CommunityModel"
import Peers from "@/models/PeerModel"
import { pusherServer } from "@/libs/pusher/pusherServer"
import { pusherConfigs } from "@/configs/pusherConfigs"
import { createClient } from "@/libs/supabase/config"

const { channelName, event } = pusherConfigs

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
      const supabase = await createClient()
      const bufferBytes = await file.arrayBuffer()
      const buffer = Buffer.from(bufferBytes)

      const splittedFileName = file.name.split('.')
      const fileExtension = splittedFileName.pop()
      newMessage.fileName = `${splittedFileName.pop()}.${fileExtension}`
      const filePath = `${crypto.randomUUID()}.${fileExtension}`

      const { data, error } = await supabase.storage
        .from('message')
        .upload(filePath, buffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        })

      if (data) {
        newMessage.file = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`
      }
      if (error) {
        newMessage.file = ''
        throw error
      }
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
        })
          .populate('participants', 'fullName')
          .populate({
            path: 'lastMessage',
            populate: {
              path: 'sender',
              select: 'fullName email picture',
              model: 'students'
            }
          })
        break
    }

    pusherServer.trigger(channelName.contact, event.contactUpdate, {
      ...result.toObject(),
      type: conversationType === 'peers' ? 'peer' : 'community'
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error when validating messages: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 