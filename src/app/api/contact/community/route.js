import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import Communities from "@/models/CommunityModel"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const newCommunity = await req.json()

    const session = await getServerSession(authOptions)

    const { user } = session

    const picture = newCommunity.picture

    if (picture) {
      const bufferBytes = await picture.arrayBuffer()
      const buffer = Buffer.from(bufferBytes)

      const pictureExtension = picture.name.split('.').pop()
      const newPictureName = `${crypto.randomUUID()}.${pictureExtension}`

      const path = `/community/community-display-pictures/${newPictureName}`
      const relativePath = `public${path}`
      await writeFile(relativePath, buffer)

      newCommunity.picture = path
    } else {
      newCommunity.picture = '/public/images/default-community-picture.png'
    }

    newCommunity.participants.push(user.id)
    const community = await Communities.create(newCommunity)

    return NextResponse.json(community.toObject())

  } catch (error) {
    console.error('Error when creating community: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}